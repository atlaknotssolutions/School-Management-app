import { api } from "@/lib/api";
import { logout } from "@/store/authSlice";
import { selectRole, selectUser } from "@/store/selectors";
import { useRouter } from "expo-router";
import {
  Bell,
  CheckCheck,
  Inbox,
  LogOut,
  Menu,
  Search,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  paper: "#F7F5F0",
  alert: "#D65A4A",
  slate: "#475467",
  border: "rgba(0,0,0,0.07)",
  white: "#FFFFFF",
};

const roleLabel = (role?: string, designation?: string) => {
  if (role === "super_admin") return "Platform Owner";
  if (role === "school_admin" || role === "admin") return "School Admin";
  if (role === "class_teacher" || role === "teacher") return "Class Teacher";
  if (role === "staff") return designation ? `Staff · ${designation}` : "Staff";
  if (role === "student" || role === "parent") return "Student / Parent";
  return "User";
};

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

type TopbarProps = {
  onMenuClick?: () => void;
  title?: string;
};

export default function Topbar({ onMenuClick, title }: TopbarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refresh = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        api.notifications.list("limit=8"),
        api.notifications.unreadCount(),
      ]);
      setItems(list.data || []);
      setUnreadCount(count.unreadCount || 0);
    } catch {
      // keep previous state
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 45000);
    return () => clearInterval(timer);
  }, [refresh]);

  const handleMarkAllRead = async () => {
    await api.notifications.markAllRead().catch(() => {});
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleOpenItem = async (item: any) => {
    if (!item.read) {
      await api.notifications.markRead(item._id).catch(() => {});
      setUnreadCount((n) => Math.max(0, n - 1));
      setItems((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, read: true } : n)),
      );
    }
    setOpen(false);
    router.push((item.link || "/notifications") as any);
  };

  const relativeTime = (iso?: string) => {
    if (!iso) return "";
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
    <View style={styles.header}>
      {/* Left */}
      <View style={styles.left}>
        {onMenuClick ? (
          <TouchableOpacity
            onPress={onMenuClick}
            style={styles.menuBtn}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Menu size={22} color={colors.ink} />
          </TouchableOpacity>
        ) : (
          <View style={styles.menuBtn}>
            <DrawerToggle />
          </View>
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title || "Dashboard"}
        </Text>
      </View>

      {/* Right */}
      <View style={styles.right}>
        {/* Notifications */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setOpen(true)}
          activeOpacity={0.7}
        >
          <Bell size={18} color={colors.ink} />
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
            <Image source={{ uri: user.avatar }} style={styles.userImage} />
          ) : (
            <InitialsAvatar name={user?.name} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name}
            </Text>
            <Text style={styles.userRole} numberOfLines={1}>
              {roleLabel(role, user?.designation)}
            </Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={17} color={colors.ink} />
        </TouchableOpacity>
      </View>

      {/* Notifications Dropdown */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              <View style={styles.dropdownActions}>
                {unreadCount > 0 && (
                  <TouchableOpacity
                    onPress={handleMarkAllRead}
                    style={styles.markAllBtn}
                  >
                    <CheckCheck size={13} color={colors.slate} />
                    <Text style={styles.markAllText}>Mark all</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => {
                    setOpen(false);
                    router.push("/notifications" as any);
                  }}
                >
                  <Text style={styles.viewAllText}>View all</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.dropdownList} bounces={false}>
              {items.length === 0 ? (
                <View style={styles.emptyState}>
                  <Inbox size={24} color="rgba(71,84,103,0.35)" />
                  <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
              ) : (
                items.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={[
                      styles.notifItem,
                      item.read && styles.notifItemRead,
                    ]}
                    onPress={() => handleOpenItem(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notifRow}>
                      {!item.read && <View style={styles.unreadDot} />}
                      <View style={styles.notifContent}>
                        <Text style={styles.notifTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {!!item.message && (
                          <Text style={styles.notifMessage} numberOfLines={2}>
                            {item.message}
                          </Text>
                        )}
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
    </View>
  );
}

// Note: You need to import DrawerToggle if you use the fallback
import { DrawerToggle } from "@/components/PlatformSidebar";

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    zIndex: 30,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
  menuBtn: {
    padding: 4,
    marginLeft: -2,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.ink,
    maxWidth: SCREEN_WIDTH * 0.42,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.alert,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 6,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.07)",
  },
  userImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.amber,
    fontSize: 12.5,
    fontWeight: "600",
  },
  userInfo: {
    maxWidth: 88,
  },
  userName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  userRole: {
    fontSize: 11,
    color: "rgba(71,84,103,0.65)",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 66,
    paddingRight: 12,
  },
  dropdown: {
    width: Math.min(340, SCREEN_WIDTH - 24),
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
    maxHeight: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  dropdownActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  markAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  markAllText: {
    fontSize: 12,
    color: "rgba(71,84,103,0.7)",
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.amber,
  },
  dropdownList: {
    maxHeight: 340,
  },
  emptyState: {
    paddingVertical: 44,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "rgba(71,84,103,0.55)",
  },
  notifItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  notifItemRead: {
    opacity: 0.6,
  },
  notifRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.amber,
    marginTop: 5,
  },
  notifContent: {
    flex: 1,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  notifMessage: {
    fontSize: 12,
    color: "rgba(71,84,103,0.7)",
    marginTop: 2,
    lineHeight: 16,
  },
  notifTime: {
    fontSize: 11,
    color: "rgba(71,84,103,0.5)",
    marginLeft: 4,
  },
});