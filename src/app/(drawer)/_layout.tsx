import Sidebar from "@/components/Sidebar";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <Sidebar {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: "front",
          drawerStyle: {
            width: 288,
            backgroundColor: "#16213E",
          },
          overlayColor: "rgba(0,0,0,0.4)",
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen name="index" options={{ title: "Dashboard" }} />
        <Drawer.Screen name="platform" options={{ title: "Platform" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
