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
              size={19}
              color={active ? "#E8A33D" : "#AAB2C0"}
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
    borderTopColor: "rgba(232,163,61,0.22)",
    paddingHorizontal: 8,
    paddingTop: 7,
    minHeight: 68,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 5,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: "rgba(232,163,61,0.16)",
  },
  label: {
    color: "#AAB2C0",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.1,
    textAlign: "center",
  },
  activeLabel: {
    color: "#E8A33D",
  },
});
