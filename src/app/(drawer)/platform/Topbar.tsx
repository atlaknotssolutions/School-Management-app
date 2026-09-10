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
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  paper: "#F7F5F0",
  slate: "#475467",
  alert: "#E5484D",
  border: "rgba(0,0,0,0.06)",
};

const roleLabel = (role?: string | null, designation?: string) => {
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

export default function Topbar({
  onMenuClick,
  title = "Platform Settings",
}: TopbarProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const { width } = useWindowDimensions();
  const isCompact = width < 480;

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
    <View style={styles.header}>
      {/* Left */}
      <View style={styles.left}>
        <TouchableOpacity onPress={onMenuClick} style={styles.menuBtn}>
          <Menu size={22} color={colors.ink} />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Right */}
      <View style={styles.right}>
        {/* Search (optional on larger screens) */}
        <View style={styles.searchBox}>
          <Search size={16} color="rgba(71,84,103,0.6)" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="rgba(71,84,103,0.5)"
            style={styles.searchInput}
          />
        </View>

        {/* Notifications */}
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => setOpen(true)}
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
          {!isCompact && (
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>
                {user?.name}
              </Text>
              <Text style={styles.userRole} numberOfLines={1}>
                {roleLabel(role, user?.designation)}
              </Text>
            </View>
          )}
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

      {/* Notifications Modal */}
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
                    <CheckCheck size={13} color="rgba(71,84,103,0.7)" />
                    <Text style={styles.markAllText}>Mark all read</Text>
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

            <ScrollView style={styles.dropdownList}>
              {items.length === 0 ? (
                <View style={styles.empty}>
                  <Inbox size={22} color="rgba(71,84,103,0.4)" />
                  <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
              ) : (
                items.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={[styles.notifItem, item.read && { opacity: 0.6 }]}
                    onPress={() => handleOpenItem(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notifRow}>
                      {!item.read && <View style={styles.unreadDot} />}
                      <View style={{ flex: 1 }}>
                        <Text style={styles.notifTitle} numberOfLines={1}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 68,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#16213E",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 20,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  menuBtn: {
    padding: 4,
    marginLeft: -4,
  },
  title: {
    flexShrink: 1,
    fontSize: 17,
    fontWeight: "600",
    color: colors.ink,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchBox: {
    display: "none", // show on larger screens if needed
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: 180,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.ink,
    padding: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    gap: 6,
    paddingLeft: 0,
  },
  userAvatar: {
    width: 34,
    height: 34,
    borderRadius: 11,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 11,
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
    maxWidth: 100,
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

  // Modal / Dropdown
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 12,
  },
  dropdown: {
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
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  dropdownTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  dropdownActions: {
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
  dropdownList: {
    maxHeight: 320,
  },
  empty: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
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
  notifTitle: {
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
});
