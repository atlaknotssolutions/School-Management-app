import { Stack } from "expo-router";

export default function PlatformLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="plans" />
      <Stack.Screen name="subscriptions" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}