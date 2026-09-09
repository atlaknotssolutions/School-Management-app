import React, { createContext, useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SIDEBAR_WIDTH = 280;

const PLATFORM_MENU = [
  { label: "Dashboard", href: "/(drawer)/platform", icon: "grid-outline" },
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
  {
    label: "Schools Management",
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
];

// ===== Context so any screen can open/close =====
type SidebarContextType = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | null>(null);

export function usePlatformSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("usePlatformSidebar must be used inside PlatformSidebarProvider");
  }
  return ctx;
}

export function PlatformSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        open,
        openSidebar: () => setOpen(true),
        closeSidebar: () => setOpen(false),
        toggleSidebar: () => setOpen((v) => !v),
      }}
    >
      {children}
      <PlatformSidebar />
    </SidebarContext.Provider>
  );
}

// ===== Actual Sidebar UI =====
function PlatformSidebar() {
  const { open, closeSidebar } = usePlatformSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={closeSidebar}
    >
      <View style={styles.overlay}>
        {/* Backdrop - click to close */}
        <Pressable style={styles.backdrop} onPress={closeSidebar} />

        {/* Sidebar panel */}
        <View style={[styles.sidebar, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Platform</Text>
            <Pressable onPress={closeSidebar} hitSlop={12}>
              <Ionicons name="close" size={24} color="#A1A1AA" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {PLATFORM_MENU.map((item) => {
              const isFocused =
                pathname === item.href ||
                (item.href === "/(drawer)/platform" &&
                  (pathname === "/(drawer)/platform" || pathname === "/(drawer)/platform/")) ||
                (item.href.includes("/schools") && pathname?.includes("/schools"));

              return (
                <Pressable
                  key={item.href}
                  onPress={() => {
                    router.push(item.href as any);
                    closeSidebar();
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
        </View>
      </View>
    </Modal>
  );
}

// ===== Toggle Button =====
export function DrawerToggle({
  size = 24,
  color = "#fff",
  backgroundColor = "#16213E",
}: {
  size?: number;
  color?: string;
  backgroundColor?: string;
}) {
  const { openSidebar } = usePlatformSidebar();

  return (
    <Pressable
      onPress={openSidebar}
      style={[styles.toggleBtn, { backgroundColor }]}
    >
      <Ionicons name="menu" size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sidebar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#16213E",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  toggleBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});