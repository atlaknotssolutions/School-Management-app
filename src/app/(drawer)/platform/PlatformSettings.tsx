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
  Info,
  Lock,
  LogOut,
  RotateCcw,
  Save,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  paper: "#F7F5F0",
  slate: "#475467",
  alert: "#E5484D",
  border: "rgba(0,0,0,0.06)",
};

const SECTION_ORDER = [
  {
    id: "general",
    title: "General",
    blurb: "Public-facing identity of the platform.",
  },
  {
    id: "security",
    title: "Security",
    blurb: "Login and account hardening.",
  },
  {
    id: "billing",
    title: "Billing",
    blurb: "Currency and invoice behaviour.",
  },
  {
    id: "notifications",
    title: "Notifications",
    blurb: "Automated reminders and alerts.",
  },
];

type Setting = {
  key: string;
  label: string;
  help?: string;
  section: string;
  type: "boolean" | "number" | "string" | string;
  value: any;
  default: any;
  options?: string[];
  min?: number;
  max?: number;
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

// ========== Toggle ==========
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onChange(!checked)}
      style={[
        styles.toggleTrack,
        { backgroundColor: checked ? colors.amber : "rgba(0,0,0,0.15)" },
      ]}
    >
      <View
        style={[
          styles.toggleThumb,
          { transform: [{ translateX: checked ? 18 : 2 }] },
        ]}
      />
    </TouchableOpacity>
  );
}

// ========== Setting Row ==========
function SettingRow({
  setting,
  value,
  onChange,
  onReset,
}: {
  setting: Setting;
  value: any;
  onChange: (value: any) => void;
  onReset: () => void;
}) {
  const isChanged = setting.value !== setting.default;
  const [openOptions, setOpenOptions] = useState(false);

  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <View style={styles.labelRow}>
          <Text style={styles.settingLabel}>{setting.label}</Text>
          {isChanged ? (
            <View style={styles.changedBadge}>
              <Text style={styles.changedText}>changed</Text>
            </View>
          ) : null}
        </View>
        {setting.help ? (
          <Text style={styles.settingHelp}>{setting.help}</Text>
        ) : null}
      </View>

      <View style={styles.settingRight}>
        {setting.type === "boolean" ? (
          <Toggle checked={Boolean(value)} onChange={onChange} />
        ) : setting.options ? (
          <View style={{ position: "relative" }}>
            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => setOpenOptions(!openOptions)}
            >
              <Text style={styles.selectText} numberOfLines={1}>
                {String(value)}
              </Text>
            </TouchableOpacity>
            {openOptions && (
              <View style={styles.dropdown}>
                {setting.options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownItem}
                    onPress={() => {
                      onChange(option);
                      setOpenOptions(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ) : (
          <TextInput
            style={styles.input}
            value={String(value ?? "")}
            keyboardType={setting.type === "number" ? "numeric" : "default"}
            onChangeText={(text) =>
              onChange(setting.type === "number" ? Number(text) : text)
            }
          />
        )}

        <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
          <RotateCcw size={14} color="rgba(71,84,103,0.5)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ========== Main Screen ==========
export default function PlatformSettings() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [settings, setSettings] = useState<Setting[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load settings
  useEffect(() => {
    api.platform.settings
      .get()
      .then(({ data }: any) => setSettings(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Load notifications
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

  const byKey = (key: string) => settings.find((s) => s.key === key);

  const change = (key: string, value: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s)),
    );
    setDirty((prev) => new Set(prev).add(key));
  };

  const reset = (key: string) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: s.default } : s)),
    );
    setDirty((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const save = async () => {
    if (dirty.size === 0) return;
    setSaving(true);

    const payload: Record<string, any> = {};
    for (const key of dirty) {
      const setting = byKey(key);
      if (!setting) continue;
      if (setting.type === "number") {
        const n = Number(setting.value);
        if (Number.isFinite(n)) payload[key] = n;
      } else {
        payload[key] = setting.value;
      }
    }

    try {
      const { data } = await api.platform.settings.update(payload);
      if (data) setSettings(data);
      setDirty(new Set());
      Alert.alert(
        "Saved",
        `Saved ${Object.keys(payload).length} setting${
          Object.keys(payload).length > 1 ? "s" : ""
        }`,
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Notification handlers
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
    <View style={styles.container}>
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
            Platform Settings
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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageIntro
          eyebrow="Platform Owner · System"
          title="Platform Settings"
          description="Secrets-free configuration for the whole platform. Environment credentials (database URI, JWT secret, provider keys) are intentionally never exposed here."
          right={
            <TouchableOpacity
              style={[
                styles.saveBtn,
                (saving || dirty.size === 0) && { opacity: 0.55 },
              ]}
              onPress={save}
              disabled={saving || dirty.size === 0}
              activeOpacity={0.8}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.ink} />
              ) : (
                <Save size={15} color={colors.ink} />
              )}
              <Text style={styles.saveBtnText}>
                {saving
                  ? "Saving…"
                  : dirty.size
                    ? `Save ${dirty.size} change${dirty.size > 1 ? "s" : ""}`
                    : "No changes"}
              </Text>
            </TouchableOpacity>
          }
        />

        {loading ? (
          <Card>
            <View style={styles.center}>
              <ActivityIndicator color={colors.amber} />
              <Text style={styles.muted}>Loading settings…</Text>
            </View>
          </Card>
        ) : (
          <View style={styles.sections}>
            {SECTION_ORDER.map((section) => {
              const items = settings.filter((s) => s.section === section.id);
              if (items.length === 0) return null;

              return (
                <Card key={section.id} style={styles.sectionCard}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <Text style={styles.sectionBlurb}>{section.blurb}</Text>

                  {items.map((setting) => (
                    <SettingRow
                      key={setting.key}
                      setting={setting}
                      value={byKey(setting.key)?.value}
                      onChange={(value) => change(setting.key, value)}
                      onReset={() => reset(setting.key)}
                    />
                  ))}
                </Card>
              );
            })}

            {/* Lock note */}
            <Card style={styles.noteCard} bodyStyle={styles.noteBody}>
              <Lock size={15} color="rgba(71,84,103,0.5)" />
              <View style={{ flex: 1 }}>
                <Text style={styles.noteTitle}>
                  Why can't I change keys, URIs or secrets here?
                </Text>
                <Text style={styles.noteText}>
                  JWT signing keys, MongoDB connection strings and third-party
                  provider credentials are environment configuration, not
                  runtime settings. They live in gitignored environment files
                  and fail closed when absent, so they can never leak through
                  the admin UI, API responses, or exported reports.
                </Text>
              </View>
            </Card>

            {/* Info note */}
            <Card style={styles.noteCard} bodyStyle={styles.noteBody}>
              <Info size={15} color="rgba(71,84,103,0.5)" />
              <View style={{ flex: 1 }}>
                <Text style={styles.noteText}>
                  Every saved change is written to the immutable audit trail
                  (settings.changed) with the acting admin's identity, so the
                  audit log answers exactly who changed what platform-wide.
                </Text>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
      <PlatformTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  center: {
    alignItems: "center",
    paddingVertical: 24,
  },
  muted: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 8,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.amber,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  sections: {
    gap: 16,
  },
  sectionCard: {},
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    marginBottom: 2,
  },
  sectionBlurb: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    marginBottom: 8,
  },
  settingRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  settingLeft: {
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  changedBadge: {
    backgroundColor: "rgba(232,163,61,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  changedText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.amberDark,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  settingHelp: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 3,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggleTrack: {
    width: 40,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  selectBtn: {
    minWidth: 110,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  selectText: {
    fontSize: 13,
    color: colors.ink,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    minWidth: 120,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    zIndex: 50,
    elevation: 6,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  dropdownText: {
    fontSize: 13,
    color: colors.ink,
  },
  input: {
    minWidth: 110,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: colors.ink,
  },
  resetBtn: {
    padding: 6,
  },
  noteCard: {
    backgroundColor: "rgba(247,245,240,0.7)",
  },
  noteBody: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
  },
  noteTitle: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.slate,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    lineHeight: 18,
  },
});
