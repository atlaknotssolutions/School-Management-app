import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const PLATFORM_TABS = [
  {
    label: "Platform",
    href: "/(drawer)/platform/(tabs)/platform",
    icon: "grid-outline",
  },
  {
    label: "Schools",
    href: "/(drawer)/platform/(tabs)/schools",
    icon: "school-outline",
  },
  {
    label: "Users",
    href: "/(drawer)/platform/(tabs)/users",
    icon: "people-outline",
  },
  {
    label: "Audit",
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

  return (
    <View style={styles.bar}>
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
              color={active ? "#E8A33D" : "#A1A1AA"}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>
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
    backgroundColor: "rgba(232,163,61,0.14)",
  },
  label: {
    color: "#A1A1AA",
    fontSize: 11,
    fontWeight: "600",
  },
  activeLabel: {
    color: "#E8A33D",
  },
});
