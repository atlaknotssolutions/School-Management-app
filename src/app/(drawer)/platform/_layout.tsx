import { PlatformSidebarProvider } from "@/components/PlatformSidebar";
import { Stack } from "expo-router";

export default function PlatformLayout() {
  return (
    <PlatformSidebarProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="plans" />
        <Stack.Screen name="subscriptions" />
        <Stack.Screen name="reports" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </PlatformSidebarProvider>
  );
}
