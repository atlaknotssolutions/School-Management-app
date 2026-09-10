

// import { DrawerToggle } from "@/components/PlatformSidebar";
// import { Card, PageIntro, Pill } from "@/components/UI";
// import { api } from "@/lib/api";
// import { useRouter } from "expo-router";
// import {
//   Building2,
//   ChevronLeft,
//   ChevronRight,
//   FileText,
//   Plus,
//   Search,
//   X,
// } from "lucide-react-native";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   FlatList,
//   Modal,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const colors = {
//   ink: "#16213E",
//   amber: "#E8A33D",
//   amberDark: "#C9832A",
//   paper: "#F7F5F0",
//   slate: "#475467",
//   info: "#3B6FA0",
//   alert: "#D65A4A",
//   success: "#3F8F5F",
//   border: "rgba(0,0,0,0.07)",
//   white: "#FFFFFF",
// };

// const statusTone = (status?: string): "success" | "alert" | "neutral" =>
//   status === "active"
//     ? "success"
//     : status === "suspended"
//       ? "alert"
//       : "neutral";

// const onboardingTone = (
//   status?: string,
// ): "success" | "amber" | "info" | "neutral" => {
//   const map: Record<string, "success" | "amber" | "info"> = {
//     live: "success",
//     subscribed: "success",
//     configured: "amber",
//     created: "info",
//   };
//   return map[status || ""] || "neutral";
// };

// const fmtDate = (value?: string) =>
//   value
//     ? new Date(value).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// const STATUS_OPTIONS = [
//   { label: "All statuses", value: "" },
//   { label: "Active", value: "active" },
//   { label: "Suspended", value: "suspended" },
// ];

// const PLAN_OPTIONS = [
//   { label: "All plans", value: "" },
//   { label: "Trial", value: "trial" },
//   { label: "Basic", value: "basic" },
//   { label: "Standard", value: "standard" },
//   { label: "Premium", value: "premium" },
// ];

// const ONBOARDING_OPTIONS = [
//   { label: "All onboarding", value: "" },
//   { label: "Created", value: "created" },
//   { label: "Configured", value: "configured" },
//   { label: "Subscribed", value: "subscribed" },
//   { label: "Live", value: "live" },
// ];

// export default function SchoolsManagement() {
//   const router = useRouter();

//   const [rows, setRows] = useState<any[]>([]);
//   const [total, setTotal] = useState(0);
//   const [pages, setPages] = useState(0);
//   const [page, setPage] = useState(1);
//   const [q, setQ] = useState("");
//   const [status, setStatus] = useState("");
//   const [plan, setPlan] = useState("");
//   const [onboarding, setOnboarding] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [busyId, setBusyId] = useState("");
//   const [refreshKey, setRefreshKey] = useState(0);

//   const [openStatus, setOpenStatus] = useState(false);
//   const [openPlan, setOpenPlan] = useState(false);
//   const [openOnboarding, setOpenOnboarding] = useState(false);

//   const [reasonModal, setReasonModal] = useState<{
//     school: any;
//     next: string;
//   } | null>(null);
//   const [reason, setReason] = useState("");

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (q.trim()) params.set("q", q.trim());
//     if (status) params.set("status", status);
//     if (plan) params.set("plan", plan);
//     if (onboarding) params.set("onboarding", onboarding);
//     params.set("page", String(page));
//     params.set("limit", "15");

//     setLoading(true);
//     api.platform.schools
//       .list(params.toString())
//       .then((result: any) => {
//         setRows(result.data || []);
//         setTotal(result.total || 0);
//         setPages(result.pages || 0);
//       })
//       .catch((err: any) => {
//         Alert.alert("Error", err.message);
//       })
//       .finally(() => setLoading(false));
//   }, [q, status, plan, onboarding, page, refreshKey]);

//   const openToggle = (school: any) => {
//     const next = school.status === "active" ? "suspended" : "active";
//     setReason("");
//     setReasonModal({ school, next });
//   };

//   const confirmToggle = async () => {
//     if (!reasonModal) return;
//     const { school, next } = reasonModal;
//     setBusyId(school._id);
//     setReasonModal(null);
//     try {
//       await api.platform.schools.setStatus(school._id, next, reason);
//       Alert.alert(
//         "Done",
//         next === "active" ? "School activated" : "School suspended",
//       );
//       setRefreshKey((k) => k + 1);
//     } catch (err: any) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setBusyId("");
//     }
//   };

//   const closeAllDropdowns = () => {
//     setOpenStatus(false);
//     setOpenPlan(false);
//     setOpenOnboarding(false);
//   };

//   const renderSchool = ({ item: school }: { item: any }) => (
//     <View style={styles.schoolCard}>
//       <View style={styles.schoolTop}>
//         <View style={styles.iconBox}>
//           <Building2 size={16} color={colors.amberDark} />
//         </View>
//         <View style={{ flex: 1, minWidth: 0 }}>
//           <Text style={styles.schoolName} numberOfLines={1}>
//             {school.name}
//           </Text>
//           <Text style={styles.schoolSub} numberOfLines={1}>
//             {school.shortName || school.city || "—"}
//           </Text>
//         </View>
//         <Pill tone={statusTone(school.status)}>{school.status}</Pill>
//       </View>

//       <View style={styles.metaRow}>
//         <Text style={styles.code}>{school.code}</Text>
//         <Pill tone="info">{school.plan}</Pill>
//         <Pill tone={onboardingTone(school.onboarding?.status)}>
//           {school.onboarding?.status || "created"}
//         </Pill>
//       </View>

//       <Text style={styles.created}>Created {fmtDate(school.createdAt)}</Text>

//       <View style={styles.actions}>
//         <TouchableOpacity
//           style={styles.btn360}
//           activeOpacity={0.75}
//           onPress={() =>
//             router.push(`/(drawer)/platform/schools/${school._id}` as any)
//           }
//         >
//           <FileText size={13} color={colors.info} />
//           <Text style={styles.btn360Text}>360° View</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.btnToggle,
//             school.status === "active" ? styles.btnSuspend : styles.btnActivate,
//             busyId === school._id && { opacity: 0.55 },
//           ]}
//           activeOpacity={0.75}
//           onPress={() => openToggle(school)}
//           disabled={busyId === school._id}
//         >
//           <Text
//             style={[
//               styles.btnToggleText,
//               school.status === "active"
//                 ? { color: colors.alert }
//                 : { color: colors.success },
//             ]}
//           >
//             {school.status === "active" ? "Suspend" : "Activate"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const Dropdown = ({
//     open,
//     setOpen,
//     value,
//     options,
//     onSelect,
//     label,
//   }: {
//     open: boolean;
//     setOpen: (v: boolean) => void;
//     value: string;
//     options: { label: string; value: string }[];
//     onSelect: (v: string) => void;
//     label: string;
//   }) => (
//     <View style={styles.dropdownWrap}>
//       <TouchableOpacity
//         style={[styles.selectBtn, open && styles.selectBtnOpen]}
//         activeOpacity={0.8}
//         onPress={() => {
//           closeAllDropdowns();
//           setOpen(!open);
//         }}
//       >
//         <Text style={styles.selectLabel}>{label}</Text>
//         <Text style={styles.selectText} numberOfLines={1}>
//           {options.find((o) => o.value === value)?.label || options[0].label}
//         </Text>
//       </TouchableOpacity>

//       {open && (
//         <View style={styles.dropdown}>
//           {options.map((o) => (
//             <TouchableOpacity
//               key={o.value}
//               style={[
//                 styles.dropdownItem,
//                 o.value === value && styles.dropdownItemActive,
//               ]}
//               onPress={() => {
//                 onSelect(o.value);
//                 setOpen(false);
//                 setPage(1);
//               }}
//             >
//               <Text
//                 style={[
//                   styles.dropdownText,
//                   o.value === value && styles.dropdownTextActive,
//                 ]}
//               >
//                 {o.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleRow}>
//         <DrawerToggle />
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//         onScrollBeginDrag={closeAllDropdowns}
//       >
//         <PageIntro
//           eyebrow="Platform Owner · School Operations"
//           title="Schools Management"
//           description={`${total} tenant school${
//             total === 1 ? "" : "s"
//           } across the platform. Search, filter, inspect 360°, or suspend/reactivate.`}
//           right={
//             <TouchableOpacity
//               style={styles.newBtn}
//               activeOpacity={0.85}
//               onPress={() =>
//                 router.push("/(drawer)/platform/onboarding" as any)
//               }
//             >
//               <Plus size={16} color={colors.ink} />
//               <Text style={styles.newBtnText}>New school</Text>
//             </TouchableOpacity>
//           }
//         />

//         <Card bodyStyle={{ padding: 16 }}>
//           {/* Search */}
//           <View style={styles.searchWrap}>
//             <Search size={16} color="rgba(71,84,103,0.5)" />
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search name, code, city…"
//               placeholderTextColor="rgba(71,84,103,0.45)"
//               value={q}
//               onChangeText={(v) => {
//                 setQ(v);
//                 setPage(1);
//               }}
//               returnKeyType="search"
//             />
//             {q.length > 0 && (
//               <TouchableOpacity onPress={() => setQ("")} hitSlop={8}>
//                 <X size={15} color="rgba(71,84,103,0.5)" />
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Filters */}
//           <View style={styles.filters}>
//             <Dropdown
//               open={openStatus}
//               setOpen={setOpenStatus}
//               value={status}
//               options={STATUS_OPTIONS}
//               onSelect={setStatus}
//               label="Status"
//             />
//             <Dropdown
//               open={openPlan}
//               setOpen={setOpenPlan}
//               value={plan}
//               options={PLAN_OPTIONS}
//               onSelect={setPlan}
//               label="Plan"
//             />
//             <Dropdown
//               open={openOnboarding}
//               setOpen={setOpenOnboarding}
//               value={onboarding}
//               options={ONBOARDING_OPTIONS}
//               onSelect={setOnboarding}
//               label="Onboarding"
//             />
//           </View>

//           {/* List */}
//           {loading ? (
//             <View style={styles.center}>
//               <ActivityIndicator size="large" color={colors.amber} />
//               <Text style={styles.muted}>Loading schools…</Text>
//             </View>
//           ) : rows.length === 0 ? (
//             <View style={styles.emptyState}>
//               <Building2 size={28} color="rgba(71,84,103,0.35)" />
//               <Text style={styles.emptyTitle}>No schools found</Text>
//               <Text style={styles.emptyDesc}>
//                 Adjust filters or onboard your first tenant school.
//               </Text>
//             </View>
//           ) : (
//             <FlatList
//               data={rows}
//               keyExtractor={(item) => item._id}
//               renderItem={renderSchool}
//               scrollEnabled={false}
//               ItemSeparatorComponent={() => <View style={styles.sep} />}
//             />
//           )}

//           {/* Pagination */}
//           {pages > 1 && (
//             <View style={styles.pagination}>
//               <Text style={styles.pageInfo}>
//                 Page {page} of {pages} · {total} total
//               </Text>
//               <View style={styles.pageBtns}>
//                 <TouchableOpacity
//                   style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
//                   disabled={page <= 1}
//                   onPress={() => setPage((p) => Math.max(1, p - 1))}
//                 >
//                   <ChevronLeft size={16} color={colors.ink} />
//                   <Text style={styles.pageBtnText}>Prev</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={[
//                     styles.pageBtn,
//                     page >= pages && styles.pageBtnDisabled,
//                   ]}
//                   disabled={page >= pages}
//                   onPress={() => setPage((p) => p + 1)}
//                 >
//                   <Text style={styles.pageBtnText}>Next</Text>
//                   <ChevronRight size={16} color={colors.ink} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </Card>
//       </ScrollView>

//       {/* Reason Modal */}
//       <Modal visible={!!reasonModal} transparent animationType="fade">
//         <Pressable
//           style={styles.modalOverlay}
//           onPress={() => setReasonModal(null)}
//         >
//           <Pressable
//             style={styles.modalBox}
//             onPress={(e) => e.stopPropagation()}
//           >
//             <Text style={styles.modalTitle}>
//               {reasonModal?.next === "suspended" ? "Suspend" : "Activate"}{" "}
//               {reasonModal?.school?.name}
//             </Text>
//             <Text style={styles.modalDesc}>
//               Please provide a reason for this action (optional but
//               recommended).
//             </Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Reason…"
//               placeholderTextColor="rgba(71,84,103,0.45)"
//               value={reason}
//               onChangeText={setReason}
//               multiline
//               textAlignVertical="top"
//             />
//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.cancelBtn}
//                 onPress={() => setReasonModal(null)}
//               >
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={styles.confirmBtn}
//                 onPress={confirmToggle}
//               >
//                 <Text style={styles.confirmBtnText}>Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </Pressable>
//         </Pressable>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.paper,
//   },
//   toggleRow: {
//     backgroundColor: colors.ink,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     alignItems: "flex-start",
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 48,
//   },
//   newBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: colors.amber,
//     paddingHorizontal: 14,
//     paddingVertical: 11,
//     borderRadius: 12,
//   },
//   newBtnText: {
//     fontSize: 13.5,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     backgroundColor: colors.white,
//     paddingHorizontal: 14,
//     marginBottom: 14,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: colors.ink,
//   },
//   filters: {
//     gap: 10,
//     marginBottom: 16,
//     zIndex: 20,
//   },
//   dropdownWrap: {
//     position: "relative",
//     zIndex: 30,
//   },
//   selectBtn: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     backgroundColor: colors.white,
//     paddingHorizontal: 14,
//     paddingVertical: 11,
//   },
//   selectBtnOpen: {
//     borderColor: colors.amber,
//   },
//   selectLabel: {
//     fontSize: 11,
//     color: "rgba(71,84,103,0.55)",
//     marginBottom: 2,
//     fontWeight: "500",
//   },
//   selectText: {
//     fontSize: 13.5,
//     color: colors.ink,
//     fontWeight: "500",
//   },
//   dropdown: {
//     position: "absolute",
//     top: 58,
//     left: 0,
//     right: 0,
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.border,
//     zIndex: 100,
//     elevation: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     overflow: "hidden",
//   },
//   dropdownItem: {
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//   },
//   dropdownItemActive: {
//     backgroundColor: "rgba(232,163,61,0.12)",
//   },
//   dropdownText: {
//     fontSize: 13.5,
//     color: colors.ink,
//   },
//   dropdownTextActive: {
//     fontWeight: "600",
//     color: colors.amberDark,
//   },
//   center: {
//     alignItems: "center",
//     paddingVertical: 40,
//     gap: 12,
//   },
//   muted: {
//     fontSize: 13.5,
//     color: "rgba(71,84,103,0.65)",
//   },
//   emptyState: {
//     alignItems: "center",
//     paddingVertical: 48,
//     gap: 8,
//   },
//   emptyTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: colors.ink,
//     marginTop: 4,
//   },
//   emptyDesc: {
//     fontSize: 13,
//     color: "rgba(71,84,103,0.6)",
//     textAlign: "center",
//     paddingHorizontal: 20,
//   },
//   schoolCard: {
//     paddingVertical: 16,
//   },
//   schoolTop: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//   },
//   iconBox: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "rgba(232,163,61,0.14)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   schoolName: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   schoolSub: {
//     fontSize: 12.5,
//     color: "rgba(71,84,103,0.6)",
//     marginTop: 2,
//   },
//   metaRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 12,
//   },
//   code: {
//     fontSize: 12.5,
//     fontFamily: "monospace",
//     color: "rgba(71,84,103,0.7)",
//     backgroundColor: "rgba(0,0,0,0.04)",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 6,
//   },
//   created: {
//     fontSize: 12.5,
//     color: "rgba(71,84,103,0.55)",
//     marginTop: 10,
//   },
//   actions: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 14,
//   },
//   btn360: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     backgroundColor: "rgba(59,111,160,0.1)",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },
//   btn360Text: {
//     fontSize: 12.5,
//     fontWeight: "600",
//     color: colors.info,
//   },
//   btnToggle: {
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   btnSuspend: {
//     backgroundColor: "rgba(214,90,74,0.08)",
//     borderColor: "rgba(214,90,74,0.25)",
//   },
//   btnActivate: {
//     backgroundColor: "rgba(63,143,95,0.08)",
//     borderColor: "rgba(63,143,95,0.25)",
//   },
//   btnToggleText: {
//     fontSize: 12.5,
//     fontWeight: "600",
//   },
//   sep: {
//     height: 1,
//     backgroundColor: "rgba(0,0,0,0.05)",
//   },
//   pagination: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 16,
//     marginTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: colors.border,
//   },
//   pageInfo: {
//     fontSize: 12.5,
//     color: "rgba(71,84,103,0.6)",
//   },
//   pageBtns: {
//     flexDirection: "row",
//     gap: 8,
//   },
//   pageBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     borderWidth: 1,
//     borderColor: colors.border,
//     backgroundColor: colors.white,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 10,
//   },
//   pageBtnDisabled: {
//     opacity: 0.4,
//   },
//   pageBtnText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "center",
//     padding: 20,
//   },
//   modalBox: {
//     backgroundColor: colors.white,
//     borderRadius: 18,
//     padding: 22,
//   },
//   modalTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: colors.ink,
//   },
//   modalDesc: {
//     fontSize: 13.5,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 6,
//     marginBottom: 14,
//     lineHeight: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     backgroundColor: colors.white,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: colors.ink,
//     minHeight: 90,
//     marginBottom: 18,
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     gap: 10,
//   },
//   cancelBtn: {
//     borderWidth: 1,
//     borderColor: colors.border,
//     backgroundColor: colors.white,
//     paddingHorizontal: 16,
//     paddingVertical: 11,
//     borderRadius: 12,
//   },
//   cancelBtnText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   confirmBtn: {
//     backgroundColor: colors.amber,
//     paddingHorizontal: 18,
//     paddingVertical: 11,
//     borderRadius: 12,
//   },
//   confirmBtnText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: colors.ink,
//   },
// });


import { DrawerToggle } from "@/components/PlatformSidebar";
import { Card, PageIntro, Pill } from "@/components/UI";
import { api } from "@/lib/api";
import { logout } from "@/store/authSlice"; // adjust path
import { selectRole, selectUser } from "@/store/selectors"; // adjust path
import { useRouter } from "expo-router";
import {
  Bell,
  Building2,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox,
  LogOut,
  Plus,
  Search,
  X,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
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
  info: "#3B6FA0",
  alert: "#D65A4A",
  success: "#3F8F5F",
  border: "rgba(0,0,0,0.07)",
  white: "#FFFFFF",
};

const statusTone = (status?: string): "success" | "alert" | "neutral" =>
  status === "active"
    ? "success"
    : status === "suspended"
      ? "alert"
      : "neutral";

const onboardingTone = (
  status?: string,
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
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

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

  const [openStatus, setOpenStatus] = useState(false);
  const [openPlan, setOpenPlan] = useState(false);
  const [openOnboarding, setOpenOnboarding] = useState(false);

  const [reasonModal, setReasonModal] = useState<{
    school: any;
    next: string;
  } | null>(null);
  const [reason, setReason] = useState("");

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

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
        next === "active" ? "School activated" : "School suspended",
      );
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusyId("");
    }
  };

  const closeAllDropdowns = () => {
    setOpenStatus(false);
    setOpenPlan(false);
    setOpenOnboarding(false);
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

  const renderSchool = ({ item: school }: { item: any }) => (
    <View style={styles.schoolCard}>
      <View style={styles.schoolTop}>
        <View style={styles.iconBox}>
          <Building2 size={16} color={colors.amberDark} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
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
          activeOpacity={0.75}
          onPress={() =>
            router.push(`/(drawer)/platform/schools/${school._id}` as any)
          }
        >
          <FileText size={13} color={colors.info} />
          <Text style={styles.btn360Text}>360° View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnToggle,
            school.status === "active" ? styles.btnSuspend : styles.btnActivate,
            busyId === school._id && { opacity: 0.55 },
          ]}
          activeOpacity={0.75}
          onPress={() => openToggle(school)}
          disabled={busyId === school._id}
        >
          <Text
            style={[
              styles.btnToggleText,
              school.status === "active"
                ? { color: colors.alert }
                : { color: colors.success },
            ]}
          >
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
    label,
  }: {
    open: boolean;
    setOpen: (v: boolean) => void;
    value: string;
    options: { label: string; value: string }[];
    onSelect: (v: string) => void;
    label: string;
  }) => (
    <View style={styles.dropdownWrap}>
      <TouchableOpacity
        style={[styles.selectBtn, open && styles.selectBtnOpen]}
        activeOpacity={0.8}
        onPress={() => {
          closeAllDropdowns();
          setOpen(!open);
        }}
      >
        <Text style={styles.selectLabel}>{label}</Text>
        <Text style={styles.selectText} numberOfLines={1}>
          {options.find((o) => o.value === value)?.label || options[0].label}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {options.map((o) => (
            <TouchableOpacity
              key={o.value}
              style={[
                styles.dropdownItem,
                o.value === value && styles.dropdownItemActive,
              ]}
              onPress={() => {
                onSelect(o.value);
                setOpen(false);
                setPage(1);
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  o.value === value && styles.dropdownTextActive,
                ]}
              >
                {o.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

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
            Schools Management
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
          style={styles.modalOverlayNotif}
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
        onScrollBeginDrag={closeAllDropdowns}
      >
        <PageIntro
          eyebrow="Platform Owner · School Operations"
          title="Schools Management"
          description={`${total} tenant school${
            total === 1 ? "" : "s"
          } across the platform. Search, filter, inspect 360°, or suspend/reactivate.`}
          right={
            <TouchableOpacity
              style={styles.newBtn}
              activeOpacity={0.85}
              onPress={() =>
                router.push("/(drawer)/platform/onboarding" as any)
              }
            >
              <Plus size={16} color={colors.ink} />
              <Text style={styles.newBtnText}>New school</Text>
            </TouchableOpacity>
          }
        />

        <Card bodyStyle={{ padding: 16 }}>
          {/* Search */}
          <View style={styles.searchWrap}>
            <Search size={16} color="rgba(71,84,103,0.5)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name, code, city…"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={q}
              onChangeText={(v) => {
                setQ(v);
                setPage(1);
              }}
              returnKeyType="search"
            />
            {q.length > 0 && (
              <TouchableOpacity onPress={() => setQ("")} hitSlop={8}>
                <X size={15} color="rgba(71,84,103,0.5)" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filters */}
          <View style={styles.filters}>
            <Dropdown
              open={openStatus}
              setOpen={setOpenStatus}
              value={status}
              options={STATUS_OPTIONS}
              onSelect={setStatus}
              label="Status"
            />
            <Dropdown
              open={openPlan}
              setOpen={setOpenPlan}
              value={plan}
              options={PLAN_OPTIONS}
              onSelect={setPlan}
              label="Plan"
            />
            <Dropdown
              open={openOnboarding}
              setOpen={setOpenOnboarding}
              value={onboarding}
              options={ONBOARDING_OPTIONS}
              onSelect={setOnboarding}
              label="Onboarding"
            />
          </View>

          {/* List */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.amber} />
              <Text style={styles.muted}>Loading schools…</Text>
            </View>
          ) : rows.length === 0 ? (
            <View style={styles.emptyState}>
              <Building2 size={28} color="rgba(71,84,103,0.35)" />
              <Text style={styles.emptyTitle}>No schools found</Text>
              <Text style={styles.emptyDesc}>
                Adjust filters or onboard your first tenant school.
              </Text>
            </View>
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
                Page {page} of {pages} · {total} total
              </Text>
              <View style={styles.pageBtns}>
                <TouchableOpacity
                  style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
                  disabled={page <= 1}
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={16} color={colors.ink} />
                  <Text style={styles.pageBtnText}>Prev</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.pageBtn,
                    page >= pages && styles.pageBtnDisabled,
                  ]}
                  disabled={page >= pages}
                  onPress={() => setPage((p) => p + 1)}
                >
                  <Text style={styles.pageBtnText}>Next</Text>
                  <ChevronRight size={16} color={colors.ink} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Card>
      </ScrollView>

      {/* Reason Modal */}
      <Modal visible={!!reasonModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setReasonModal(null)}
        >
          <Pressable
            style={styles.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              {reasonModal?.next === "suspended" ? "Suspend" : "Activate"}{" "}
              {reasonModal?.school?.name}
            </Text>
            <Text style={styles.modalDesc}>
              Please provide a reason for this action (optional but
              recommended).
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Reason…"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={reason}
              onChangeText={setReason}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setReasonModal(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={confirmToggle}
              >
                <Text style={styles.confirmBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
  modalOverlayNotif: {
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
    paddingBottom: 48,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.amber,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
  },
  newBtnText: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.ink,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink,
  },
  filters: {
    gap: 10,
    marginBottom: 16,
    zIndex: 20,
  },
  dropdownWrap: {
    position: "relative",
    zIndex: 30,
  },
  selectBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  selectBtnOpen: {
    borderColor: colors.amber,
  },
  selectLabel: {
    fontSize: 11,
    color: "rgba(71,84,103,0.55)",
    marginBottom: 2,
    fontWeight: "500",
  },
  selectText: {
    fontSize: 13.5,
    color: colors.ink,
    fontWeight: "500",
  },
  dropdown: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 100,
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemActive: {
    backgroundColor: "rgba(232,163,61,0.12)",
  },
  dropdownText: {
    fontSize: 13.5,
    color: colors.ink,
  },
  dropdownTextActive: {
    fontWeight: "600",
    color: colors.amberDark,
  },
  center: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 12,
  },
  muted: {
    fontSize: 13.5,
    color: "rgba(71,84,103,0.65)",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
    marginTop: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: "rgba(71,84,103,0.6)",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  schoolCard: {
    paddingVertical: 16,
  },
  schoolTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(232,163,61,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  schoolName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
  },
  schoolSub: {
    fontSize: 12.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  code: {
    fontSize: 12.5,
    fontFamily: "monospace",
    color: "rgba(71,84,103,0.7)",
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  created: {
    fontSize: 12.5,
    color: "rgba(71,84,103,0.55)",
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  btn360: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(59,111,160,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  btn360Text: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.info,
  },
  btnToggle: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  btnSuspend: {
    backgroundColor: "rgba(214,90,74,0.08)",
    borderColor: "rgba(214,90,74,0.25)",
  },
  btnActivate: {
    backgroundColor: "rgba(63,143,95,0.08)",
    borderColor: "rgba(63,143,95,0.25)",
  },
  btnToggleText: {
    fontSize: 12.5,
    fontWeight: "600",
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  pageInfo: {
    fontSize: 12.5,
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
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 22,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
  modalDesc: {
    fontSize: 13.5,
    color: "rgba(71,84,103,0.7)",
    marginTop: 6,
    marginBottom: 14,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.ink,
    minHeight: 90,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  confirmBtn: {
    backgroundColor: colors.amber,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
});