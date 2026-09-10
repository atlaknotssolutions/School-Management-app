import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function PlatformTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          paddingTop: 10,
          backgroundColor: "#F7F5F0",
        },
        tabBarActiveTintColor: "#E8A33D",
        tabBarInactiveTintColor: "#AAB2C0",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          letterSpacing: 0.1,
        },
        tabBarStyle: {
          backgroundColor: "#16213E",
          borderTopColor: "rgba(232,163,61,0.22)",
          display: "none",
        },
      }}
      initialRouteName="schools"
      backBehavior="history"
    >
      <Tabs.Screen
        name="schools"
        options={{
          title: "School Management",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="school-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users & Access",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="audit"
        options={{
          title: "Audit Logs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
