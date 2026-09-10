import { DrawerToggle } from "@/components/PlatformSidebar";
import { PlatformTabBar } from "@/components/PlatformTabBar";
import { Card, PageIntro } from "@/components/UI";
import { api } from "@/lib/api";
import { logout } from "@/store/authSlice"; // adjust path
import { selectRole, selectUser } from "@/store/selectors"; // adjust path
import { useRouter } from "expo-router";
import {
  Bell,
  CheckCheck,
  Inbox,
  LogOut,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  paper: "#F7F5F0",
  alert: "#E5484D",
};

// ========== Role Label ==========
const roleLabel = (role?: string | null, designation?: string) => {
  if (role === "super_admin") return "Platform Owner";
  if (role === "school_admin" || role === "admin") return "School Admin";
  if (role === "class_teacher" || role === "teacher") return "Class Teacher";
  if (role === "staff") return designation ? `Staff · ${designation}` : "Staff";
  if (role === "student" || role === "parent") return "Student / Parent";
  return "User";
};

// ========== Initials Avatar ==========
function InitialsAvatar({ name }: { name?: string }) {
  const initials = (name || "U")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

export default function Subscriptions() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.subscriptions
      .list()
      .then(({ data }: any) => setSubscriptions(data || []))
      .finally(() => setLoading(false));
  }, []);

  // Notifications polling
  const refreshNotifications = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        api.notifications.list("limit=8"),
        api.notifications.unreadCount(),
      ]);
      setNotifItems(list.data || []);
      setUnreadCount(count.unreadCount || 0);
    } catch {
      // keep previous
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
    const timer = setInterval(refreshNotifications, 45000);
    return () => clearInterval(timer);
  }, [refreshNotifications]);

  const handleMarkAllRead = async () => {
    await api.notifications.markAllRead().catch(() => {});
    setNotifItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleOpenItem = async (item: any) => {
    if (!item.read) {
      await api.notifications.markRead(item._id).catch(() => {});
      setUnreadCount((n) => Math.max(0, n - 1));
      setNotifItems((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, read: true } : n)),
      );
    }
    setNotifOpen(false);
    router.push((item.link || "/notifications") as any);
  };

  const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/login" as any);
  };

  return (
    <View style={styles.screen}>
      {/* ========== TOPBAR ========== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.menuBtn}>
            <DrawerToggle
              size={22}
              color={colors.ink}
              backgroundColor="transparent"
            />
          </View>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Subscriptions
          </Text>
        </View>

        <View style={styles.headerRight}>
          {/* Notifications */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setNotifOpen(true)}
            activeOpacity={0.7}
          >
            <Bell size={17} color={colors.ink} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* User */}
          <View style={styles.userRow}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
            ) : (
              <InitialsAvatar name={user?.name} />
            )}
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name}
              </Text>
              <Text style={styles.userRole} numberOfLines={1}>
                {roleLabel(role, user?.designation ?? undefined)}
              </Text>
            </View>
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={16} color={colors.ink} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ========== NOTIFICATIONS MODAL ========== */}
      <Modal
        visible={notifOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setNotifOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setNotifOpen(false)}
        >
          <View style={styles.notifDropdown}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Notifications</Text>
              <View style={styles.notifActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    onPress={handleMarkAllRead}
                    style={styles.markAllBtn}
                  >
                    <CheckCheck size={13} color="rgba(71,84,103,0.7)" />
                    <Text style={styles.markAllText}>Mark all read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setNotifOpen(false);
                    router.push("/notifications" as any);
                  }}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.notifList}>
              {notifItems.length === 0 ? (
                <View style={styles.emptyNotif}>
                  <Inbox size={22} color="rgba(71,84,103,0.4)" />
                  <Text style={styles.emptyNotifText}>
                    No notifications yet
                  </Text>
                </View>
              ) : (
                notifItems.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={[styles.notifItem, item.read && { opacity: 0.6 }]}
                    onPress={() => handleOpenItem(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notifRow}>
                      {!item.read && <View style={styles.unreadDot} />}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.notifItemTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {item.message ? (
                          <Text style={styles.notifMsg} numberOfLines={2}>
                            {item.message}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.notifTime}>
                        {relativeTime(item.createdAt)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>

      {/* ========== CONTENT ========== */}
      <ScrollView contentContainerStyle={styles.content}>
        <PageIntro eyebrow="Platform Owner · Billing" title="Subscriptions" />
        {loading ? (
          <ActivityIndicator color={colors.amber} />
        ) : subscriptions.length ? (
          subscriptions.map((subscription) => (
            <Card
              key={subscription._id}
              title={subscription.school?.name || "School subscription"}
            >
              <Text style={styles.detail}>
                {subscription.plan?.name || "No plan"} ·{" "}
                {subscription.status || "unknown"}
              </Text>
            </Card>
          ))
        ) : (
          <Card>
            <Text style={styles.detail}>No subscriptions found.</Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom tabs — same as before */}
      <PlatformTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },

  // ===== Topbar =====
  header: {
    height: 64,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    zIndex: 20,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  menuBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.ink,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.alert,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.amber,
    fontWeight: "600",
    fontSize: 13,
  },
  userInfo: {
    maxWidth: 110,
  },
  userName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  userRole: {
    fontSize: 11,
    color: "rgba(71,84,103,0.7)",
  },

  // ===== Notifications Modal =====
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 12,
  },
  notifDropdown: {
    width: 340,
    maxWidth: "92%",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  notifActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  markAllText: {
    fontSize: 11,
    color: "rgba(71,84,103,0.7)",
  },
  viewAllText: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.amber,
  },
  notifList: {
    maxHeight: 320,
  },
  emptyNotif: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 8,
  },
  emptyNotifText: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
  },
  notifItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.amber,
    marginTop: 6,
  },
  notifItemTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  notifMsg: {
    fontSize: 11,
    color: "rgba(71,84,103,0.7)",
    marginTop: 2,
  },
  notifTime: {
    fontSize: 10,
    color: "rgba(71,84,103,0.5)",
    marginLeft: 4,
  },

  // ===== Content =====
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  detail: {
    color: "#475467",
    fontSize: 13,
  },
});