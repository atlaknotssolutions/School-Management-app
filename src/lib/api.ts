import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { store } from "../store";
import { clearAuthStorage, logout, setTokens } from "../store/authSlice";

const API_BASE_URL =
  Constants.expoConfig?.extra?.apiUrl ||
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.1.23:5000/api";

const json = (method: string, body?: any) => ({
  method,
  body: body ? JSON.stringify(body) : undefined,
});

async function request(path: string, options: any = {}) {
  const isFormData = options.body instanceof FormData;
  const { auth } = store.getState();

  const token =
    auth.accessToken || (await AsyncStorage.getItem("erp_access_token"));

  const userRaw = await AsyncStorage.getItem("erp_user");
  const user = auth.user || (userRaw ? JSON.parse(userRaw) : null);

  const passiveSchoolId =
    auth.activeSchoolId || (await AsyncStorage.getItem("erp_active_school"));

  const includeSchoolHeader = user?.role === "super_admin" && passiveSchoolId;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(includeSchoolHeader ? { "X-School-Id": passiveSchoolId } : {}),
      ...options.headers,
    },
  });

  // Token refresh logic
  if (response.status === 401 && !options._retry) {
    const refreshToken =
      auth.refreshToken || (await AsyncStorage.getItem("erp_refresh_token"));

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(
          `${API_BASE_URL}/auth/refresh-token`,
          json("POST", { refreshToken }),
        );
        const refreshBody = await refreshResponse.json().catch(() => ({}));

        if (refreshResponse.ok && refreshBody.data?.accessToken) {
          store.dispatch(
            setTokens({
              accessToken: refreshBody.data.accessToken,
              refreshToken: refreshBody.data.refreshToken,
            }),
          );

          // Persist new tokens
          await AsyncStorage.setItem(
            "erp_access_token",
            refreshBody.data.accessToken,
          );
          if (refreshBody.data.refreshToken) {
            await AsyncStorage.setItem(
              "erp_refresh_token",
              refreshBody.data.refreshToken,
            );
          }

          return request(path, { ...options, _retry: true });
        }
      } catch (e) {
        // refresh failed
      }
    }

    // The access and refresh tokens are no longer usable.
    await clearAuthStorage();
    store.dispatch(logout());
    throw new Error("Session expired. Please login again.");
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Request failed");
  }

  return body;
}

export const api = {
  login: (credentials: any) =>
    request("/auth/login", json("POST", credentials)),
  register: (payload: any) => request("/auth/register", json("POST", payload)),
  me: () => request("/auth/me"),

  notifications: {
    list: (params = "") =>
      request(`/notifications${params ? `?${params}` : ""}`),
    unreadCount: () => request("/notifications/unread-count"),
    markAllRead: () => request("/notifications/read-all", json("PATCH")),
    markRead: (id: string) =>
      request(`/notifications/${id}/read`, json("PATCH")),
  },

  users: {
    list: (schoolId?: string) =>
      request(`/auth/users${schoolId ? `?schoolId=${schoolId}` : ""}`),
    create: (user: any) => request("/auth/users", json("POST", user)),
    updateStatus: (id: string, isActive: boolean) =>
      request(`/auth/users/${id}/status`, json("PATCH", { isActive })),
    remove: (id: string) => request(`/auth/users/${id}`, { method: "DELETE" }),
  },

  schools: {
    list: () => request("/auth/schools"),
    create: (school: any) => request("/auth/schools", json("POST", school)),
  },

  plans: {
    list: (params = "") =>
      request(`/platform/plans${params ? `?${params}` : ""}`),
    get: (id: string) => request(`/platform/plans/${id}`),
    create: (plan: any) => request("/platform/plans", json("POST", plan)),
    update: (id: string, plan: any) =>
      request(`/platform/plans/${id}`, json("PATCH", plan)),
    remove: (id: string) =>
      request(`/platform/plans/${id}`, { method: "DELETE" }),
  },

  analytics: {
    summary: () => request("/platform/analytics"),
  },

  platform: {
    settings: {
      get: () => request("/platform/settings"),
      update: (payload: any) =>
        request("/platform/settings", {
          method: "PATCH",
          body: JSON.stringify(payload),
        }),
    },
    reports: {
      catalog: () => request("/platform/reports"),
      generate: (type: string, params = "") =>
        request(`/platform/reports/${type}${params ? `?${params}` : ""}`),
    },
    auditLogs: (params = "") =>
      request(`/platform/audit-logs${params ? `?${params}` : ""}`),
    schools: {
      list: (params = "") =>
        request(`/platform/schools${params ? `?${params}` : ""}`),
      get360: (id: string) => request(`/platform/schools/${id}`),
      setStatus: (id: string, status: string, reason?: string) =>
        request(
          `/platform/schools/${id}/status`,
          json("PATCH", { status, reason }),
        ),
      updateOnboarding: (id: string, status: string, notes?: string) =>
        request(
          `/platform/schools/${id}/onboarding`,
          json("PATCH", { status, notes }),
        ),
    },
    users: {
      list: (params = "") =>
        request(`/platform/users${params ? `?${params}` : ""}`),
      get360: (id: string) => request(`/platform/users/${id}`),
      update: (id: string, user: any) =>
        request(`/auth/users/${id}`, json("PATCH", user)),
      setStatus: (id: string, isActive: boolean) =>
        request(`/auth/users/${id}/status`, json("PATCH", { isActive })),
      remove: (id: string) =>
        request(`/auth/users/${id}`, { method: "DELETE" }),
      restore: (id: string) =>
        request(`/auth/users/${id}/restore`, { method: "POST" }),
    },
  },

  subscriptions: {
    list: (params = "") =>
      request(`/platform/subscriptions${params ? `?${params}` : ""}`),
    get: (id: string) => request(`/platform/subscriptions/${id}`),
    assign: (schoolId: string, planId: string, effectiveDate?: string) =>
      request(
        "/platform/subscriptions",
        json("POST", { schoolId, planId, effectiveDate }),
      ),
    act: (id: string, action: string, extra: any = {}) =>
      request(
        `/platform/subscriptions/${id}`,
        json("PATCH", { action, ...extra }),
      ),
  },

  billing: {
    invoices: {
      list: (params = "") =>
        request(`/platform/invoices${params ? `?${params}` : ""}`),
      get: (id: string) => request(`/platform/invoices/${id}`),
      generate: (subscriptionId: string, period: any = {}) =>
        request(
          "/platform/invoices/generate",
          json("POST", { subscriptionId, ...period }),
        ),
      updateStatus: (id: string, status: string) =>
        request(`/platform/invoices/${id}`, json("PATCH", { status })),
    },
  },

  students: {
    list: (params = "") => request(`/students${params ? `?${params}` : ""}`),
    get: (id: string) => request(`/students/${id}`),
    create: (student: any) => request("/students", json("POST", student)),
    me: () => request("/students/me"),
    counsellorStats: () => request("/students/counsellor/stats"),
    completeProfile: (id: string) =>
      request(`/students/${id}/complete-profile`, { method: "POST" }),
    uploadPhoto: (file: any) => {
      const formData = new FormData();
      formData.append("photo", file);
      return request("/students/upload-photo", {
        method: "POST",
        body: formData,
      });
    },
    update: (id: string, student: any) =>
      request(`/students/${id}`, json("PUT", student)),
    remove: (id: string) => request(`/students/${id}`, { method: "DELETE" }),
    stats: () => request("/students/stats/summary"),
  },

  admissions: {
    list: (status = "") =>
      request(
        `/admissions${status ? `?status=${encodeURIComponent(status)}` : ""}`,
      ),
    create: (item: any) => request("/admissions", json("POST", item)),
    update: (id: string, item: any) =>
      request(`/admissions/${id}`, json("PUT", item)),
    remove: (id: string) => request(`/admissions/${id}`, { method: "DELETE" }),
  },

  attendance: {
    list: (params = "") => request(`/attendance${params ? `?${params}` : ""}`),
    mark: (records: any) =>
      request("/attendance/mark", json("POST", { records })),
  },

  timetable: {
    list: (params = "") => request(`/timetable${params ? `?${params}` : ""}`),
    save: (item: any) => request("/timetable", json("POST", item)),
    remove: (id: string) => request(`/timetable/${id}`, { method: "DELETE" }),
  },

  homework: {
    list: (params = "") => request(`/homework${params ? `?${params}` : ""}`),
    create: (item: any) => request("/homework", json("POST", item)),
    update: (id: string, item: any) =>
      request(`/homework/${id}`, json("PUT", item)),
    remove: (id: string) => request(`/homework/${id}`, { method: "DELETE" }),
  },

  exams: {
    list: (params = "") => request(`/exams${params ? `?${params}` : ""}`),
    create: (item: any) => request("/exams", json("POST", item)),
    update: (id: string, item: any) =>
      request(`/exams/${id}`, json("PUT", item)),
    remove: (id: string) => request(`/exams/${id}`, { method: "DELETE" }),
  },

  marks: {
    enter: (item: any) => request("/marks", json("POST", item)),
    reportCard: (params = "") =>
      request(`/marks/report-card${params ? `?${params}` : ""}`),
  },

  fees: {
    structures: {
      list: () => request("/fees/structure"),
      create: (item: any) => request("/fees/structure", json("POST", item)),
      remove: (id: string) =>
        request(`/fees/structure/${id}`, { method: "DELETE" }),
    },
    invoices: {
      list: (params = "") => request(`/fees${params ? `?${params}` : ""}`),
      create: (item: any) => request("/fees", json("POST", item)),
    },
    payments: {
      list: (params = "") => request(`/payments${params ? `?${params}` : ""}`),
      create: (item: any) => request("/payments", json("POST", item)),
    },
  },

  notices: {
    list: () => request("/notices"),
    create: (item: any) => request("/notices", json("POST", item)),
    remove: (id: string) => request(`/notices/${id}`, { method: "DELETE" }),
  },

  events: {
    list: () => request("/events"),
    create: (item: any) => request("/events", json("POST", item)),
    update: (id: string, item: any) =>
      request(`/events/${id}`, json("PUT", item)),
    remove: (id: string) => request(`/events/${id}`, { method: "DELETE" }),
  },

  staff: {
    list: () => request("/staff"),
    create: (item: any) => request("/staff", json("POST", item)),
    update: (id: string, item: any) =>
      request(`/staff/${id}`, json("PUT", item)),
    remove: (id: string) => request(`/staff/${id}`, { method: "DELETE" }),
  },

  leaves: {
    list: () => request("/leaves"),
    create: (item: any) => request("/leaves", json("POST", item)),
    updateStatus: (id: string, status: string) =>
      request(`/leaves/${id}/status`, json("PATCH", { status })),
  },

  payroll: {
    list: () => request("/payroll"),
    create: (item: any) => request("/payroll", json("POST", item)),
    markPaid: (id: string) => request(`/payroll/${id}/pay`, json("PATCH", {})),
  },

  books: {
    list: () => request("/library/books"),
    create: (item: any) => request("/library/books", json("POST", item)),
    update: (id: string, item: any) =>
      request(`/library/books/${id}`, json("PUT", item)),
    remove: (id: string) =>
      request(`/library/books/${id}`, { method: "DELETE" }),
  },

  issues: {
    list: () => request("/library/issues"),
    issue: (item: any) => request("/library/issues/issue", json("POST", item)),
    return: (id: string) =>
      request(`/library/issues/${id}/return`, json("PATCH", {})),
  },

  hostel: {
    list: () => request("/hostel"),
    create: (item: any) => request("/hostel", json("POST", item)),
    allot: (id: string, item: any) =>
      request(`/hostel/${id}/allot`, json("PATCH", item)),
    vacate: (id: string, studentId: string) =>
      request(`/hostel/${id}/vacate`, json("PATCH", { studentId })),
    remove: (id: string) => request(`/hostel/${id}`, { method: "DELETE" }),
  },

  transport: {
    list: () => request("/transport"),
    create: (item: any) => request("/transport", json("POST", item)),
    updateLocation: (id: string, item: any) =>
      request(`/transport/${id}/location`, json("PATCH", item)),
    assign: (id: string, item: any) =>
      request(`/transport/${id}/assign`, json("PATCH", item)),
  },

  inventory: {
    list: () => request("/inventory"),
    create: (item: any) => request("/inventory", json("POST", item)),
    update: (id: string, item: any) =>
      request(`/inventory/${id}`, json("PUT", item)),
    remove: (id: string) => request(`/inventory/${id}`, { method: "DELETE" }),
  },
};
