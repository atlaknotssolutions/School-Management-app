import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthResponse } from "@/types/auth";

export async function saveSession(session: AuthResponse) {
  await AsyncStorage.multiSet([
    ["erp_access_token", session.accessToken],
    ["erp_refresh_token", session.refreshToken],
    ["erp_user", JSON.stringify(session.user)],
  ]);
}
