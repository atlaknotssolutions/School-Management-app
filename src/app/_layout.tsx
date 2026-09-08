// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import "../global.css";

// export default function RootLayout() {
//   return (
//     <>
//       <StatusBar style="dark" />
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="index" />
//         <Stack.Screen name="login" />
//         <Stack.Screen name="(drawer)" />
//       </Stack>
//     </>
//   );
// }
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { Stack } from "expo-router";
import { store } from "@/store";
import { setCredentials, loadAuthFromStorage } from "@/store/authSlice";
import "../global.css";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    loadAuthFromStorage().then((data) => {
      if (data.accessToken) {
        dispatch(setCredentials(data));
      }
    });
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthLoader>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(drawer)" />
        </Stack>
      </AuthLoader>
    </Provider>
  );
}