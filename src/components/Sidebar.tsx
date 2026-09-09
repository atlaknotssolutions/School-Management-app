import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PLATFORM_MENU = [
  {
    label: "Plans & Pricing",
    href: "/(drawer)/platform/plans",
    icon: "pricetag-outline",
  },
  {
    label: "Subscriptions",
    href: "/(drawer)/platform/subscriptions",
    icon: "card-outline",
  },
  {
    label: "Reports",
    href: "/(drawer)/platform/reports",
    icon: "bar-chart-outline",
  },
];

type SidebarProps = {
  navigation?: {
    closeDrawer: () => void;
  };
};

export default function Sidebar({ navigation }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Platform</Text>
      </View>

      {PLATFORM_MENU.map((item) => {
        const isFocused = pathname === item.href;

        return (
          <Pressable
            key={item.href}
            onPress={() => {
              router.push(item.href as any);
              navigation?.closeDrawer();
            }}
            style={[styles.item, isFocused && styles.itemFocused]}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color={isFocused ? "#4F46E5" : "#A1A1AA"}
              style={styles.icon}
            />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16213E",
  },
  content: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A4A",
    marginBottom: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 10,
  },
  itemFocused: {
    backgroundColor: "rgba(79, 70, 229, 0.15)",
  },
  icon: {
    marginRight: 14,
  },
  label: {
    color: "#A1A1AA",
    fontSize: 15,
    fontWeight: "500",
  },
  labelFocused: {
    color: "#4F46E5",
    fontWeight: "600",
  },
});
