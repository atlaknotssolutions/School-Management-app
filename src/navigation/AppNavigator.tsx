import { Drawer } from "expo-router/drawer";
import Sidebar from "../components/Sidebar";

export default function AppNavigator() {
  return (
    <Drawer
      drawerContent={() => <Sidebar />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: { width: 288 },
        overlayColor: "rgba(0,0,0,0.4)",
      }}
    />
  );
}
