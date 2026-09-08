// // lib/api.ts
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import type { AuthResponse, RegisterPayload } from "@/types/auth";

// const API_URL =
//   process.env.EXPO_PUBLIC_API_URL ?? "http://172.19.130.82:5000/api";

// // ========== Storage helpers ==========
// const TOKEN_KEYS = {
//   access: "erp_access_token",
//   refresh: "erp_refresh_token",
//   user: "erp_user",
//   activeSchool: "erp_active_school",
// };

// async function getAccessToken() {
//   return AsyncStorage.getItem(TOKEN_KEYS.access);
// }

// async function getRefreshToken() {
//   return AsyncStorage.getItem(TOKEN_KEYS.refresh);
// }

// async function getUser() {
//   const raw = await AsyncStorage.getItem(TOKEN_KEYS.user);
//   return raw ? JSON.parse(raw) : null;
// }

// async function getActiveSchoolId() {
//   return AsyncStorage.getItem(TOKEN_KEYS.activeSchool);
// }

// export async function saveSession(data: any) {
//   if (data?.accessToken) {
//     await AsyncStorage.setItem(TOKEN_KEYS.access, data.accessToken);
//   }
//   if (data?.refreshToken) {
//     await AsyncStorage.setItem(TOKEN_KEYS.refresh, data.refreshToken);
//   }
//   if (data?.user) {
//     await AsyncStorage.setItem(TOKEN_KEYS.user, JSON.stringify(data.user));
//   }
//   if (data?.school) {
//     // optional: store school if needed
//   }
// }

// export async function clearSession() {
//   await AsyncStorage.multiRemove([
//     TOKEN_KEYS.access,
//     TOKEN_KEYS.refresh,
//     TOKEN_KEYS.user,
//     TOKEN_KEYS.activeSchool,
//   ]);
// }

// // ========== Core request ==========
// type RequestOptions = RequestInit & {
//   _retry?: boolean;
//   skipAuth?: boolean;
// };

// async function request<T = any>(
//   path: string,
//   options: RequestOptions = {}
// ): Promise<T> {
//   const isFormData = options.body instanceof FormData;

//   const token = options.skipAuth ? null : await getAccessToken();
//   const user = await getUser();
//   const activeSchoolId = await getActiveSchoolId();

//   // super_admin can impersonate a school
//   const includeSchoolHeader =
//     user?.role === "super_admin" && activeSchoolId;

//   let response: Response;

//   try {
//     response = await fetch(`${API_URL}${path}`, {
//       ...options,
//       headers: {
//         ...(isFormData ? {} : { "Content-Type": "application/json" }),
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//         ...(includeSchoolHeader
//           ? { "X-School-Id": activeSchoolId }
//           : {}),
//         ...options.headers,
//       },
//     });
//   } catch (err) {
//     throw new Error(`Cannot reach the server at ${API_URL}`);
//   }

//   // ========== Auto refresh on 401 ==========
//   if (response.status === 401 && !options._retry && !options.skipAuth) {
//     const refreshToken = await getRefreshToken();

//     if (refreshToken) {
//       try {
//         const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ refreshToken }),
//         });

//         const refreshBody = await refreshRes.json().catch(() => ({}));

//         if (refreshRes.ok && refreshBody?.data?.accessToken) {
//           await AsyncStorage.setItem(
//             TOKEN_KEYS.access,
//             refreshBody.data.accessToken
//           );
//           if (refreshBody.data.refreshToken) {
//             await AsyncStorage.setItem(
//               TOKEN_KEYS.refresh,
//               refreshBody.data.refreshToken
//             );
//           }

//           // retry original request
//           return request<T>(path, { ...options, _retry: true });
//         }
//       } catch {
//         // fall through to logout
//       }
//     }

//     // refresh failed → clear session
//     await clearSession();
//     throw new Error("Session expired. Please login again.");
//   }

//   const body = await response.json().catch(() => ({}));

//   if (!response.ok || body.success === false) {
//     throw new Error(body.message || "Request failed");
//   }

//   return body as T;
// }

// // helper for JSON body
// const json = (method: string, body?: any): RequestOptions => ({
//   method,
//   body: body !== undefined ? JSON.stringify(body) : undefined,
// });

// // ========== API ==========
// export const api = {
//   // ---------- Auth ----------
//   login: (credentials: { email: string; password: string }) =>
//     request<{ data: AuthResponse }>("/auth/login", json("POST", credentials)),

//   register: (payload: RegisterPayload) =>
//     request<{ data: AuthResponse }>("/auth/register", json("POST", payload)),

//   me: () => request("/auth/me"),

//   // ---------- Users ----------
//   users: {
//     list: (schoolId?: string) =>
//       request(`/auth/users${schoolId ? `?schoolId=${schoolId}` : ""}`),
//     create: (user: any) => request("/auth/users", json("POST", user)),
//     updateStatus: (id: string, isActive: boolean) =>
//       request(`/auth/users/${id}/status`, json("PATCH", { isActive })),
//     remove: (id: string) =>
//       request(`/auth/users/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Schools ----------
//   schools: {
//     list: () => request("/auth/schools"),
//     create: (school: any) => request("/auth/schools", json("POST", school)),
//   },

//   // ---------- Plans ----------
//   plans: {
//     list: (params = "") =>
//       request(`/platform/plans${params ? `?${params}` : ""}`),
//     get: (id: string) => request(`/platform/plans/${id}`),
//     create: (plan: any) => request("/platform/plans", json("POST", plan)),
//     update: (id: string, plan: any) =>
//       request(`/platform/plans/${id}`, json("PATCH", plan)),
//     remove: (id: string) =>
//       request(`/platform/plans/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Analytics (Dashboard uses this) ----------
//   analytics: {
//     summary: () => request("/platform/analytics"),
//   },

//   // ---------- Platform ----------
//   platform: {
//     settings: {
//       get: () => request("/platform/settings"),
//       update: (payload: any) =>
//         request("/platform/settings", {
//           method: "PATCH",
//           body: JSON.stringify(payload),
//         }),
//     },
//     reports: {
//       catalog: () => request("/platform/reports"),
//       generate: (type: string, params = "") =>
//         request(
//           `/platform/reports/${type}${params ? `?${params}` : ""}`
//         ),
//     },
//     auditLogs: (params = "") =>
//       request(`/platform/audit-logs${params ? `?${params}` : ""}`),
//     schools: {
//       list: (params = "") =>
//         request(`/platform/schools${params ? `?${params}` : ""}`),
//       get360: (id: string) => request(`/platform/schools/${id}`),
//       setStatus: (id: string, status: string, reason?: string) =>
//         request(
//           `/platform/schools/${id}/status`,
//           json("PATCH", { status, reason })
//         ),
//       updateOnboarding: (id: string, status: string, notes?: string) =>
//         request(
//           `/platform/schools/${id}/onboarding`,
//           json("PATCH", { status, notes })
//         ),
//     },
//     users: {
//       list: (params = "") =>
//         request(`/platform/users${params ? `?${params}` : ""}`),
//       get360: (id: string) => request(`/platform/users/${id}`),
//       update: (id: string, user: any) =>
//         request(`/auth/users/${id}`, json("PATCH", user)),
//       setStatus: (id: string, isActive: boolean) =>
//         request(`/auth/users/${id}/status`, json("PATCH", { isActive })),
//       remove: (id: string) =>
//         request(`/auth/users/${id}`, { method: "DELETE" }),
//       restore: (id: string) =>
//         request(`/auth/users/${id}/restore`, { method: "POST" }),
//     },
//   },

//   // ---------- Subscriptions ----------
//   subscriptions: {
//     list: (params = "") =>
//       request(`/platform/subscriptions${params ? `?${params}` : ""}`),
//     get: (id: string) => request(`/platform/subscriptions/${id}`),
//     assign: (schoolId: string, planId: string, effectiveDate?: string) =>
//       request(
//         "/platform/subscriptions",
//         json("POST", { schoolId, planId, effectiveDate })
//       ),
//     act: (id: string, action: string, extra: any = {}) =>
//       request(
//         `/platform/subscriptions/${id}`,
//         json("PATCH", { action, ...extra })
//       ),
//   },

//   // ---------- Billing ----------
//   billing: {
//     invoices: {
//       list: (params = "") =>
//         request(`/platform/invoices${params ? `?${params}` : ""}`),
//       get: (id: string) => request(`/platform/invoices/${id}`),
//       generate: (subscriptionId: string, period: any = {}) =>
//         request(
//           "/platform/invoices/generate",
//           json("POST", { subscriptionId, ...period })
//         ),
//       updateStatus: (id: string, status: string) =>
//         request(`/platform/invoices/${id}`, json("PATCH", { status })),
//     },
//   },

//   // ---------- Students ----------
//   students: {
//     list: (params = "") =>
//       request(`/students${params ? `?${params}` : ""}`),
//     get: (id: string) => request(`/students/${id}`),
//     create: (student: any) =>
//       request("/students", json("POST", student)),
//     me: () => request("/students/me"),
//     counsellorStats: () => request("/students/counsellor/stats"),
//     completeProfile: (id: string) =>
//       request(`/students/${id}/complete-profile`, { method: "POST" }),
//     uploadPhoto: async (file: any) => {
//       const formData = new FormData();
//       formData.append("photo", file);
//       return request("/students/upload-photo", {
//         method: "POST",
//         body: formData,
//       });
//     },
//     update: (id: string, student: any) =>
//       request(`/students/${id}`, json("PUT", student)),
//     remove: (id: string) =>
//       request(`/students/${id}`, { method: "DELETE" }),
//     stats: () => request("/students/stats/summary"),
//   },

//   // ---------- Admissions ----------
//   admissions: {
//     list: (status = "") =>
//       request(
//         `/admissions${status ? `?status=${encodeURIComponent(status)}` : ""}`
//       ),
//     create: (item: any) => request("/admissions", json("POST", item)),
//     update: (id: string, item: any) =>
//       request(`/admissions/${id}`, json("PUT", item)),
//     remove: (id: string) =>
//       request(`/admissions/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Attendance ----------
//   attendance: {
//     list: (params = "") =>
//       request(`/attendance${params ? `?${params}` : ""}`),
//     mark: (records: any) =>
//       request("/attendance/mark", json("POST", { records })),
//   },

//   // ---------- Timetable ----------
//   timetable: {
//     list: (params = "") =>
//       request(`/timetable${params ? `?${params}` : ""}`),
//     save: (item: any) => request("/timetable", json("POST", item)),
//     remove: (id: string) =>
//       request(`/timetable/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Homework ----------
//   homework: {
//     list: (params = "") =>
//       request(`/homework${params ? `?${params}` : ""}`),
//     create: (item: any) => request("/homework", json("POST", item)),
//     update: (id: string, item: any) =>
//       request(`/homework/${id}`, json("PUT", item)),
//     remove: (id: string) =>
//       request(`/homework/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Exams ----------
//   exams: {
//     list: (params = "") =>
//       request(`/exams${params ? `?${params}` : ""}`),
//     create: (item: any) => request("/exams", json("POST", item)),
//     update: (id: string, item: any) =>
//       request(`/exams/${id}`, json("PUT", item)),
//     remove: (id: string) =>
//       request(`/exams/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Marks ----------
//   marks: {
//     enter: (item: any) => request("/marks", json("POST", item)),
//     reportCard: (params = "") =>
//       request(`/marks/report-card${params ? `?${params}` : ""}`),
//   },

//   // ---------- Fees ----------
//   fees: {
//     structures: {
//       list: () => request("/fees/structure"),
//       create: (item: any) =>
//         request("/fees/structure", json("POST", item)),
//       remove: (id: string) =>
//         request(`/fees/structure/${id}`, { method: "DELETE" }),
//     },
//     invoices: {
//       list: (params = "") =>
//         request(`/fees${params ? `?${params}` : ""}`),
//       create: (item: any) => request("/fees", json("POST", item)),
//     },
//     payments: {
//       list: (params = "") =>
//         request(`/payments${params ? `?${params}` : ""}`),
//       create: (item: any) => request("/payments", json("POST", item)),
//     },
//   },

//   // ---------- Notices ----------
//   notices: {
//     list: () => request("/notices"),
//     create: (item: any) => request("/notices", json("POST", item)),
//     remove: (id: string) =>
//       request(`/notices/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Events ----------
//   events: {
//     list: () => request("/events"),
//     create: (item: any) => request("/events", json("POST", item)),
//     update: (id: string, item: any) =>
//       request(`/events/${id}`, json("PUT", item)),
//     remove: (id: string) =>
//       request(`/events/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Staff ----------
//   staff: {
//     list: () => request("/staff"),
//     create: (item: any) => request("/staff", json("POST", item)),
//     update: (id: string, item: any) =>
//       request(`/staff/${id}`, json("PUT", item)),
//     remove: (id: string) =>
//       request(`/staff/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Leaves ----------
//   leaves: {
//     list: () => request("/leaves"),
//     create: (item: any) => request("/leaves", json("POST", item)),
//     updateStatus: (id: string, status: string) =>
//       request(`/leaves/${id}/status`, json("PATCH", { status })),
//   },

//   // ---------- Payroll ----------
//   payroll: {
//     list: () => request("/payroll"),
//     create: (item: any) => request("/payroll", json("POST", item)),
//     markPaid: (id: string) =>
//       request(`/payroll/${id}/pay`, json("PATCH", {})),
//   },

//   // ---------- Library ----------
//   books: {
//     list: () => request("/library/books"),
//     create: (item: any) =>
//       request("/library/books", json("POST", item)),
//     update: (id: string, item: any) =>
//       request(`/library/books/${id}`, json("PUT", item)),
//     remove: (id: string) =>
//       request(`/library/books/${id}`, { method: "DELETE" }),
//   },
//   issues: {
//     list: () => request("/library/issues"),
//     issue: (item: any) =>
//       request("/library/issues/issue", json("POST", item)),
//     return: (id: string) =>
//       request(`/library/issues/${id}/return`, json("PATCH", {})),
//   },

//   // ---------- Hostel ----------
//   hostel: {
//     list: () => request("/hostel"),
//     create: (item: any) => request("/hostel", json("POST", item)),
//     allot: (id: string, item: any) =>
//       request(`/hostel/${id}/allot`, json("PATCH", item)),
//     vacate: (id: string, studentId: string) =>
//       request(`/hostel/${id}/vacate`, json("PATCH", { studentId })),
//     remove: (id: string) =>
//       request(`/hostel/${id}`, { method: "DELETE" }),
//   },

//   // ---------- Transport ----------
//   transport: {
//     list: () => request("/transport"),
//     create: (item: any) => request("/transport", json("POST", item)),
//     updateLocation: (id: string, item: any) =>
//       request(`/transport/${id}/location`, json("PATCH", item)),
//     assign: (id: string, item: any) =>
//       request(`/transport/${id}/assign`, json("PATCH", item)),
//   },

//   // ---------- Inventory ----------
//   inventory: {
//     list: () => request("/inventory"),
//     create: (item: any) => request("/inventory", json("POST", item)),
//     update: (id: string, item: any) =>
//       request(`/inventory/${id}`, json("PUT", item)),
//     remove: (id: string) =>
//       request(`/inventory/${id}`, { method: "DELETE" }),
//   },
// };

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
  me: () => request("/auth/me"),

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
