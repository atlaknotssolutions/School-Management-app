import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AsyncStorage.getItem("erp_user");
        // token bhi check kar sakte ho agar aap store karte ho
        // const token = await AsyncStorage.getItem("erp_token");

        if (user) {
          router.replace("/(drawer)" as any);
        } else {
          router.replace("/login");
        }
      } catch (error) {
        router.replace("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <View className="flex-1 items-center justify-center bg-paper">
        <ActivityIndicator size="large" color="#E8A33D" />
      </View>
    );
  }

  return null;
}
