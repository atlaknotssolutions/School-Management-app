import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PLATFORM_TABS = [
  {
    label: "School Management",
    href: "/(drawer)/platform/(tabs)/schools",
    icon: "school-outline",
  },
  {
    label: "Users & Access",
    href: "/(drawer)/platform/(tabs)/users",
    icon: "people-outline",
  },
  {
    label: "Audit Logs",
    href: "/(drawer)/platform/(tabs)/audit",
    icon: "document-text-outline",
  },
  {
    label: "Settings",
    href: "/(drawer)/platform/(tabs)/settings",
    icon: "settings-outline",
  },
] as const;

export function PlatformTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      {PLATFORM_TABS.map((tab) => {
        const active = pathname?.includes(tab.href.split("/").pop() || "");

        return (
          <Pressable
            key={tab.href}
            onPress={() => router.push(tab.href as never)}
            style={[styles.tab, active && styles.activeTab]}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={active ? "#4F46E5" : "#A1A1AA"}
            />
            <Text
              style={[styles.label, active && styles.activeLabel]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "#16213E",
    borderTopWidth: 1,
    borderTopColor: "#2A2A4A",
    paddingHorizontal: 8,
    paddingVertical: 6,
    minHeight: 62,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "rgba(79,70,229,0.15)",
  },
  label: {
    color: "#A1A1AA",
    fontSize: 10.5,
    fontWeight: "600",
    textAlign: "center",
  },
  activeLabel: {
    color: "#4F46E5",
  },
});
