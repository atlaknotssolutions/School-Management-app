
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  Building2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react-native";
import { api } from "@/lib/api";
import { Card, PageIntro, Pill } from "@/components/UI";

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

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  paper: "#F7F5F0",
  slate: "#475467",
  info: "#3B6FA0",
  alert: "#D65A4A",
  success: "#3F8F5F",
  border: "rgba(0,0,0,0.06)",
};

const statusTone = (status?: string): "success" | "alert" | "neutral" =>
  status === "active" ? "success" : status === "suspended" ? "alert" : "neutral";

const onboardingTone = (
  status?: string
): "success" | "amber" | "info" | "neutral" => {
  const map: Record<string, "success" | "amber" | "info"> = {
    live: "success",
    subscribed: "success",
    configured: "amber",
    created: "info",
  };
  return map[status || ""] || "neutral";
};

const fmtDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
];

const PLAN_OPTIONS = [
  { label: "All plans", value: "" },
  { label: "Trial", value: "trial" },
  { label: "Basic", value: "basic" },
  { label: "Standard", value: "standard" },
  { label: "Premium", value: "premium" },
];

const ONBOARDING_OPTIONS = [
  { label: "All onboarding", value: "" },
  { label: "Created", value: "created" },
  { label: "Configured", value: "configured" },
  { label: "Subscribed", value: "subscribed" },
  { label: "Live", value: "live" },
];

export default function SchoolsManagement() {
  const router = useRouter();
  const pathname = usePathname();

  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [onboarding, setOnboarding] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // dropdown states
  const [openStatus, setOpenStatus] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openOnboarding, setOpenOnboarding] = useState(false);

  // reason modal for suspend/activate
  const [reasonModal, setReasonModal] = useState<{
    school: any;
    next: string;
  } | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (plan) params.set("plan", plan);
    if (onboarding) params.set("onboarding", onboarding);
    params.set("page", String(page));
    params.set("limit", "15");

    setLoading(true);
    api.platform.schools
      .list(params.toString())
      .then((result: any) => {
        setRows(result.data || []);
        setTotal(result.total || 0);
        setPages(result.pages || 0);
      })
      .catch((err: any) => {
        Alert.alert("Error", err.message);
      })
      .finally(() => setLoading(false));
  }, [q, status, plan, onboarding, page, refreshKey]);

  const openToggle = (school: any) => {
    const next = school.status === "active" ? "suspended" : "active";
    setReason("");
    setReasonModal({ school, next });
  };

  const confirmToggle = async () => {
    if (!reasonModal) return;
    const { school, next } = reasonModal;
    setBusyId(school._id);
    setReasonModal(null);
    try {
      await api.platform.schools.setStatus(school._id, next, reason);
      Alert.alert(
        "Done",
        next === "active" ? "School activated" : "School suspended"
      );
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusyId("");
    }
  };

  const renderSchool = ({ item: school }: { item: any }) => (
    <View style={styles.schoolCard}>
      <View style={styles.schoolTop}>
        <View style={styles.iconBox}>
          <Building2 size={15} color={colors.amberDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.schoolName} numberOfLines={1}>
            {school.name}
          </Text>
          <Text style={styles.schoolSub} numberOfLines={1}>
            {school.shortName || school.city || "—"}
          </Text>
        </View>
        <Pill tone={statusTone(school.status)}>{school.status}</Pill>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.code}>{school.code}</Text>
        <Pill tone="info">{school.plan}</Pill>
        <Pill tone={onboardingTone(school.onboarding?.status)}>
          {school.onboarding?.status || "created"}
        </Pill>
      </View>

      <Text style={styles.created}>Created {fmtDate(school.createdAt)}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.btn360}
          onPress={() =>
            router.push(`/(drawer)/platform/schools/${school._id}` as any)
          }
        >
          <FileText size={13} color={colors.info} />
          <Text style={styles.btn360Text}>360°</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnToggle, busyId === school._id && { opacity: 0.5 }]}
          onPress={() => openToggle(school)}
          disabled={busyId === school._id}
        >
          <Text style={styles.btnToggleText}>
            {school.status === "active" ? "Suspend" : "Activate"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Dropdown = ({
    open,
    setOpen,
    value,
    options,
    onSelect,
  }: {
    open: boolean;
    setOpen: (v: boolean) => void;
    value: string;
    options: { label: string; value: string }[];
    onSelect: (v: string) => void;
  }) => (
    <View style={styles.dropdownWrap}>
      <TouchableOpacity
        style={styles.selectBtn}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.selectText} numberOfLines={1}>
          {options.find((o) => o.value === value)?.label || options[0].label}
        </Text>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {options.map((o) => (
            <TouchableOpacity
              key={o.value}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(o.value);
                setOpen(false);
                setPage(1);
              }}
            >
              <Text style={styles.dropdownText}>{o.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ===== TOP SIDEBAR MENU (sabse upar) ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.topMenu}
        contentContainerStyle={styles.topMenuContent}
      >
        {PLATFORM_MENU.map((item) => {
          const isFocused =
            pathname === item.href ||
            (item.href === "/(drawer)/platform/(tabs)/schools" &&
              (pathname?.includes("/schools") ||
                pathname === "/(drawer)/platform/(tabs)/schools")) ||
            (item.href === "/(drawer)/platform" &&
              (pathname === "/(drawer)/platform" ||
                pathname === "/(drawer)/platform/"));

          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as any)}
              style={[styles.menuItem, isFocused && styles.menuItemFocused]}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={isFocused ? "#4F46E5" : "#A1A1AA"}
              />
              <Text
                style={[styles.menuLabel, isFocused && styles.menuLabelFocused]}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageIntro
          eyebrow="Platform Owner · School Operations"
          title="Schools Management"
          description={`${total} tenant school${
            total === 1 ? "" : "s"
          } across the platform. Search, filter, inspect a 360°, or suspend/reactivate a tenant.`}
          right={
            <TouchableOpacity
              style={styles.newBtn}
              onPress={() =>
                router.push("/(drawer)/platform/onboarding" as any)
              }
            >
              <Plus size={15} color={colors.ink} />
              <Text style={styles.newBtnText}>New school</Text>
            </TouchableOpacity>
          }
        />

        <Card bodyStyle={{ padding: 14 }}>
          {/* Search */}
          <View style={styles.searchWrap}>
            <Search size={15} color="rgba(71,84,103,0.5)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name, code, city…"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={q}
              onChangeText={(v) => {
                setQ(v);
                setPage(1);
              }}
            />
          </View>

          {/* Filters */}
          <View style={styles.filters}>
            <Dropdown
              open={openStatus}
              setOpen={setOpenStatus}
              value={status}
              options={STATUS_OPTIONS}
              onSelect={setStatus}
            />
            <Dropdown
              open={openPlan}
              setOpen={setOpenPlan}
              value={plan}
              options={PLAN_OPTIONS}
              onSelect={setPlan}
            />
            <Dropdown
              open={openOnboarding}
              setOpen={setOpenOnboarding}
              value={onboarding}
              options={ONBOARDING_OPTIONS}
              onSelect={setOnboarding}
            />
          </View>

          {/* List */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.amber} />
              <Text style={styles.muted}>Loading schools…</Text>
            </View>
          ) : rows.length === 0 ? (
            <Text style={[styles.muted, { textAlign: "center", paddingVertical: 28 }]}>
              No schools match. Adjust filters or onboard your first tenant.
            </Text>
          ) : (
            <FlatList
              data={rows}
              keyExtractor={(item) => item._id}
              renderItem={renderSchool}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.sep} />}
            />
          )}

          {/* Pagination */}
          {pages > 1 && (
            <View style={styles.pagination}>
              <Text style={styles.pageInfo}>
                Page {page} of {pages}
              </Text>
              <View style={styles.pageBtns}>
                <TouchableOpacity
                  style={[styles.pageBtn, page <= 1 && { opacity: 0.4 }]}
                  disabled={page <= 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={15} color={colors.ink} />
                  <Text style={styles.pageBtnText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.pageBtn, page >= pages && { opacity: 0.4 }]}
                  disabled={page >= pages}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <Text style={styles.pageBtnText}>Next</Text>
                  <ChevronRight size={15} color={colors.ink} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Reason Modal */}
      <Modal visible={!!reasonModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {reasonModal?.next === "suspended" ? "Suspend" : "Activate"}{" "}
              {reasonModal?.school?.name}
            </Text>
            <Text style={styles.modalDesc}>
              Please provide a reason for this action (optional but recommended).
            </Text>
            <TextInput
              style={[styles.input, { marginBottom: 16 }]}
              placeholder="Reason…"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={reason}
              onChangeText={setReason}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setReasonModal(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmToggle}>
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  // ===== Top Menu Styles =====
  topMenu: {
    backgroundColor: "#16213E",
    maxHeight: 56,
  },
  topMenuContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 4,
    gap: 8,
  },
  menuItemFocused: {
    backgroundColor: "rgba(79, 70, 229, 0.15)",
  },
  menuLabel: {
    color: "#A1A1AA",
    fontSize: 13,
    fontWeight: "500",
  },
  menuLabelFocused: {
    color: "#4F46E5",
    fontWeight: "600",
  },
  // ===== Rest of styles =====
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.amber,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  newBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.ink,
  },
  filters: {
    gap: 8,
    marginBottom: 12,
    zIndex: 10,
  },
  dropdownWrap: {
    position: "relative",
    zIndex: 20,
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  selectText: {
    fontSize: 13,
    color: colors.ink,
  },
  dropdown: {
    position: "absolute",
    top: 46,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    zIndex: 100,
    elevation: 8,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  dropdownText: {
    fontSize: 13,
    color: colors.ink,
  },
  center: {
    alignItems: "center",
    paddingVertical: 28,
  },
  muted: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 8,
  },
  schoolCard: {
    paddingVertical: 14,
  },
  schoolTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(232,163,61,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  schoolName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  schoolSub: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 1,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  code: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "rgba(71,84,103,0.7)",
  },
  created: {
    fontSize: 12,
    color: "rgba(71,84,103,0.65)",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  btn360: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59,111,160,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btn360Text: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.info,
  },
  btnToggle: {
    backgroundColor: colors.paper,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnToggleText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 14,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pageInfo: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
  },
  pageBtns: {
    flexDirection: "row",
    gap: 8,
  },
  pageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageBtnText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.ink,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  modalDesc: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 6,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 13,
    color: colors.ink,
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  confirmBtn: {
    backgroundColor: colors.amber,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  confirmBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
});