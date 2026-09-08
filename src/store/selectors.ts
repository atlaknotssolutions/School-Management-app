import { useSelector } from "react-redux";
import type { RootState } from "./index"; // aapka store file

export const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.isAuthenticated || state.auth.accessToken);

export const selectUser = (state: RootState) => state.auth.user;

export const selectRole = (state: RootState) =>
  state.auth.user?.role || null;

export const selectSchool = (state: RootState) => state.auth.school || null;

export const selectActiveSchoolId = (state: RootState) =>
  state.auth.activeSchoolId ||
  (state.auth.school ? state.auth.school.id : null);

// Custom hook
export const useRole = () => useSelector(selectRole);
export const useUser = () => useSelector(selectUser);
export const useIsAuthenticated = () => useSelector(selectIsAuthenticated);