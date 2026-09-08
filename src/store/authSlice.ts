import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  designation?: string;
  avatar?: string;
  [key: string]: any;
}

export interface School {
  id?: string;
  name?: string;
  [key: string]: any;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  school: School | null;
  activeSchoolId: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  school: null,
  activeSchoolId: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        accessToken?: string | null;
        refreshToken?: string | null;
        user?: User | null;
        school?: School | null;
      }>
    ) {
      const { accessToken, refreshToken, user, school } = action.payload;

      if (accessToken !== undefined) state.accessToken = accessToken;
      if (refreshToken !== undefined) state.refreshToken = refreshToken;
      if (user !== undefined) state.user = user;
      if (school !== undefined) state.school = school;

      state.isAuthenticated = Boolean(state.accessToken);
    },

    setTokens(
      state,
      action: PayloadAction<{
        accessToken?: string | null;
        refreshToken?: string | null;
      }>
    ) {
      state.accessToken = action.payload.accessToken ?? state.accessToken;
      state.refreshToken = action.payload.refreshToken ?? state.refreshToken;
      state.isAuthenticated = Boolean(state.accessToken);
    },

    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },

    setSchool(state, action: PayloadAction<School | null>) {
      state.school = action.payload;
    },

    setActiveSchoolId(state, action: PayloadAction<string | null>) {
      state.activeSchoolId = action.payload || null;
    },

    logout() {
      return { ...initialState };
    },
  },
});

export const {
  setCredentials,
  setTokens,
  setUser,
  setSchool,
  setActiveSchoolId,
  logout,
} = authSlice.actions;

export default authSlice.reducer;

// ========== Helper functions (AsyncStorage) ==========

export const persistAuth = async (data: {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: User | null;
  school?: School | null;
  activeSchoolId?: string | null;
}) => {
  try {
    if (data.accessToken !== undefined) {
      if (data.accessToken) {
        await AsyncStorage.setItem("erp_access_token", data.accessToken);
      } else {
        await AsyncStorage.removeItem("erp_access_token");
      }
    }
    if (data.refreshToken !== undefined) {
      if (data.refreshToken) {
        await AsyncStorage.setItem("erp_refresh_token", data.refreshToken);
      } else {
        await AsyncStorage.removeItem("erp_refresh_token");
      }
    }
    if (data.user !== undefined) {
      if (data.user) {
        await AsyncStorage.setItem("erp_user", JSON.stringify(data.user));
      } else {
        await AsyncStorage.removeItem("erp_user");
      }
    }
    if (data.school !== undefined) {
      if (data.school) {
        await AsyncStorage.setItem("erp_school", JSON.stringify(data.school));
      } else {
        await AsyncStorage.removeItem("erp_school");
      }
    }
    if (data.activeSchoolId !== undefined) {
      if (data.activeSchoolId) {
        await AsyncStorage.setItem("erp_active_school", data.activeSchoolId);
      } else {
        await AsyncStorage.removeItem("erp_active_school");
      }
    }
  } catch (e) {
    console.warn("Failed to persist auth", e);
  }
};

export const loadAuthFromStorage = async (): Promise<Partial<AuthState>> => {
  try {
    const [accessToken, refreshToken, userRaw, schoolRaw, activeSchoolId] =
      await Promise.all([
        AsyncStorage.getItem("erp_access_token"),
        AsyncStorage.getItem("erp_refresh_token"),
        AsyncStorage.getItem("erp_user"),
        AsyncStorage.getItem("erp_school"),
        AsyncStorage.getItem("erp_active_school"),
      ]);

    return {
      accessToken,
      refreshToken,
      user: userRaw ? JSON.parse(userRaw) : null,
      school: schoolRaw ? JSON.parse(schoolRaw) : null,
      activeSchoolId,
      isAuthenticated: Boolean(accessToken),
    };
  } catch {
    return {};
  }
};

export const clearAuthStorage = async () => {
  await Promise.all([
    AsyncStorage.removeItem("erp_access_token"),
    AsyncStorage.removeItem("erp_refresh_token"),
    AsyncStorage.removeItem("erp_user"),
    AsyncStorage.removeItem("erp_school"),
    AsyncStorage.removeItem("erp_active_school"),
  ]);
};