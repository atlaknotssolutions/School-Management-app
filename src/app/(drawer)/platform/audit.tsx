// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   StyleSheet,
//   FlatList,
// } from "react-native";
// import { ShieldCheck, Search } from "lucide-react-native";
// import { api } from "@/lib/api";
// import { Card, PageIntro, Pill } from "@/components/UI";

// const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
//   login: { bg: "#DBEAFE", text: "#1E40AF" },
//   logout: { bg: "#F1F5F9", text: "#475569" },
//   "user.created": { bg: "#D1FAE5", text: "#065F46" },
//   "user.updated": { bg: "#CCFBF1", text: "#0F766E" },
//   "user.deactivated": { bg: "#FEF3C7", text: "#92400E" },
//   "user.soft_deleted": { bg: "#FEE2E2", text: "#991B1B" },
//   "user.restored": { bg: "#D1FAE5", text: "#065F46" },
//   "school.created": { bg: "#D1FAE5", text: "#065F46" },
//   "school.updated": { bg: "#CCFBF1", text: "#0F766E" },
//   "school.suspended": { bg: "#FEE2E2", text: "#991B1B" },
//   "school.activated": { bg: "#D1FAE5", text: "#065F46" },
//   "school.deactivated": { bg: "#FEF3C7", text: "#92400E" },
//   "school.reactivated": { bg: "#D1FAE5", text: "#065F46" },
//   "plan.created": { bg: "#E0E7FF", text: "#3730A3" },
//   "plan.updated": { bg: "#E0E7FF", text: "#3730A3" },
//   "plan.deactivated": { bg: "#FEF3C7", text: "#92400E" },
//   "plan.archived": { bg: "#F1F5F9", text: "#475569" },
//   "subscription.created": { bg: "#E0E7FF", text: "#3730A3" },
//   "subscription.changed": { bg: "#E0E7FF", text: "#3730A3" },
//   "subscription.suspended": { bg: "#FEE2E2", text: "#991B1B" },
//   "subscription.reactivated": { bg: "#D1FAE5", text: "#065F46" },
//   "subscription.cancelled": { bg: "#FEF3C7", text: "#92400E" },
//   "invoice.generated": { bg: "#F3E8FF", text: "#6B21A8" },
//   "invoice.updated": { bg: "#F3E8FF", text: "#6B21A8" },
//   "report.generated": { bg: "#CFFAFE", text: "#155E75" },
//   "settings.changed": { bg: "#F1F5F9", text: "#334155" },
// };

// const ACTIONS = Object.keys(ACTION_COLORS);

// const TARGET_TYPES = [
//   { label: "All targets", value: "" },
//   { label: "School", value: "school" },
//   { label: "User", value: "user" },
//   { label: "Plan", value: "plan" },
//   { label: "Subscription", value: "subscription" },
//   { label: "Invoice", value: "invoice" },
//   { label: "Report", value: "report" },
//   { label: "Setting", value: "setting" },
// ];

// const RESULTS = [
//   { label: "All results", value: "" },
//   { label: "Success", value: "success" },
//   { label: "Failure", value: "failure" },
// ];

// const fmtDate = (value?: string) => {
//   if (!value) return "—";
//   return new Date(value).toLocaleString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   });
// };

// type AuditRow = {
//   _id: string;
//   createdAt?: string;
//   actorEmail?: string;
//   actorRole?: string;
//   action?: string;
//   targetType?: string;
//   targetId?: string;
//   result?: string;
//   message?: string;
//   reason?: string;
//   context?: { ip?: string };
// };

// type Filters = {
//   actorEmail: string;
//   action: string;
//   targetType: string;
//   result: string;
// };

// export default function AuditLogs() {
//   const [rows, setRows] = useState<AuditRow[]>([]);
//   const [total, setTotal] = useState(0);
//   const [pages, setPages] = useState(0);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState<Filters>({
//     actorEmail: "",
//     action: "",
//     targetType: "",
//     result: "",
//   });

//   // Simple dropdown open state
//   const [openDropdown, setOpenDropdown] = useState<
//     "action" | "targetType" | "result" | null
//   >(null);

//   useEffect(() => {
//     const params = new URLSearchParams();
//     if (filters.actorEmail) params.set("actorEmail", filters.actorEmail);
//     if (filters.action) params.set("action", filters.action);
//     if (filters.targetType) params.set("targetType", filters.targetType);
//     if (filters.result) params.set("result", filters.result);
//     params.set("page", String(page));

//     setLoading(true);
//     api.platform
//       .auditLogs(params.toString())
//       .then((res: any) => {
//         setRows(res.data || []);
//         setTotal(res.total ?? 0);
//         setPages(res.pages ?? 0);
//       })
//       .catch((err: any) => {
//         console.warn(err.message);
//       })
//       .finally(() => setLoading(false));
//   }, [filters, page]);

//   const updateFilter = (key: keyof Filters, value: string) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//     setPage(1);
//     setOpenDropdown(null);
//   };

//   const renderItem = ({ item }: { item: AuditRow }) => {
//     const actionColor =
//       ACTION_COLORS[item.action || ""] || {
//         bg: "#F1F5F9",
//         text: "#475569",
//       };
//     const isFailure = item.result === "failure";

//     return (
//       <View style={styles.row}>
//         {/* When */}
//         <Text style={styles.when}>{fmtDate(item.createdAt)}</Text>

//         {/* Actor */}
//         <View style={styles.actor}>
//           <Text style={styles.actorEmail} numberOfLines={1}>
//             {item.actorEmail || "system"}
//           </Text>
//           {item.actorRole ? (
//             <Text style={styles.actorRole}>{item.actorRole}</Text>
//           ) : null}
//         </View>

//         {/* Action */}
//         <View style={[styles.pill, { backgroundColor: actionColor.bg }]}>
//           <Text style={[styles.pillText, { color: actionColor.text }]}>
//             {item.action || "—"}
//           </Text>
//         </View>

//         {/* Target */}
//         <View style={styles.target}>
//           <Text style={styles.targetType}>{item.targetType || "—"}</Text>
//           {item.targetId ? (
//             <Text style={styles.targetId}>
//               {String(item.targetId).slice(0, 8)}
//             </Text>
//           ) : null}
//         </View>

//         {/* Result */}
//         <View
//           style={[
//             styles.pill,
//             {
//               backgroundColor: isFailure ? "#FEE2E2" : "#D1FAE5",
//             },
//           ]}
//         >
//           <Text
//             style={[
//               styles.pillText,
//               { color: isFailure ? "#991B1B" : "#065F46" },
//             ]}
//           >
//             {item.result || "—"}
//           </Text>
//         </View>

//         {/* Detail */}
//         <View style={styles.detail}>
//           <Text style={styles.detailMsg}>{item.message || "—"}</Text>
//           {item.reason ? (
//             <Text style={styles.detailReason}>Reason: {item.reason}</Text>
//           ) : null}
//           {item.context?.ip ? (
//             <Text style={styles.detailIp}>IP {item.context.ip}</Text>
//           ) : null}
//         </View>
//       </View>
//     );
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.content}
//       showsVerticalScrollIndicator={false}
//       keyboardShouldPersistTaps="handled"
//     >
//       <PageIntro
//         eyebrow="Platform Owner · System"
//         title="Audit Logs"
//         description="Immutable, append-only trail of sensitive platform actions. Every entry records who did what, to which entity, and the outcome. Secrets are never stored."
//       />

//       {/* Filters */}
//       <Card style={styles.filterCard} bodyStyle={{ padding: 14 }}>
//         {/* Actor email search */}
//         <View style={styles.searchWrap}>
//           <Search
//             size={14}
//             color="rgba(71,84,103,0.5)"
//             style={styles.searchIcon}
//           />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Filter by actor email…"
//             placeholderTextColor="rgba(71,84,103,0.5)"
//             value={filters.actorEmail}
//             onChangeText={(v) => updateFilter("actorEmail", v)}
//             autoCapitalize="none"
//             autoCorrect={false}
//           />
//         </View>

//         {/* Dropdowns */}
//         <View style={styles.filterRow}>
//           {/* Action */}
//           <View style={styles.dropdownWrap}>
//             <TouchableOpacity
//               style={styles.dropdownBtn}
//               onPress={() =>
//                 setOpenDropdown(openDropdown === "action" ? null : "action")
//               }
//             >
//               <Text style={styles.dropdownText} numberOfLines={1}>
//                 {filters.action || "All actions"}
//               </Text>
//             </TouchableOpacity>
//             {openDropdown === "action" && (
//               <View style={styles.dropdownList}>
//                 <TouchableOpacity
//                   style={styles.dropdownItem}
//                   onPress={() => updateFilter("action", "")}
//                 >
//                   <Text style={styles.dropdownItemText}>All actions</Text>
//                 </TouchableOpacity>
//                 {ACTIONS.map((a) => (
//                   <TouchableOpacity
//                     key={a}
//                     style={styles.dropdownItem}
//                     onPress={() => updateFilter("action", a)}
//                   >
//                     <Text style={styles.dropdownItemText}>{a}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>

//           {/* Target Type */}
//           <View style={styles.dropdownWrap}>
//             <TouchableOpacity
//               style={styles.dropdownBtn}
//               onPress={() =>
//                 setOpenDropdown(
//                   openDropdown === "targetType" ? null : "targetType"
//                 )
//               }
//             >
//               <Text style={styles.dropdownText} numberOfLines={1}>
//                 {TARGET_TYPES.find((t) => t.value === filters.targetType)
//                   ?.label || "All targets"}
//               </Text>
//             </TouchableOpacity>
//             {openDropdown === "targetType" && (
//               <View style={styles.dropdownList}>
//                 {TARGET_TYPES.map((t) => (
//                   <TouchableOpacity
//                     key={t.value}
//                     style={styles.dropdownItem}
//                     onPress={() => updateFilter("targetType", t.value)}
//                   >
//                     <Text style={styles.dropdownItemText}>{t.label}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>

//           {/* Result */}
//           <View style={styles.dropdownWrap}>
//             <TouchableOpacity
//               style={styles.dropdownBtn}
//               onPress={() =>
//                 setOpenDropdown(openDropdown === "result" ? null : "result")
//               }
//             >
//               <Text style={styles.dropdownText} numberOfLines={1}>
//                 {RESULTS.find((r) => r.value === filters.result)?.label ||
//                   "All results"}
//               </Text>
//             </TouchableOpacity>
//             {openDropdown === "result" && (
//               <View style={styles.dropdownList}>
//                 {RESULTS.map((r) => (
//                   <TouchableOpacity
//                     key={r.value}
//                     style={styles.dropdownItem}
//                     onPress={() => updateFilter("result", r.value)}
//                   >
//                     <Text style={styles.dropdownItemText}>{r.label}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         </View>

//         <Text style={styles.totalText}>{total} entries</Text>
//       </Card>

//       {/* Table / List */}
//       <Card bodyStyle={{ padding: 0 }}>
//         {loading ? (
//           <View style={styles.center}>
//             <ActivityIndicator size="large" color="#E8A33D" />
//             <Text style={styles.emptyText}>Loading audit trail…</Text>
//           </View>
//         ) : rows.length === 0 ? (
//           <View style={styles.center}>
//             <ShieldCheck size={18} color="rgba(71,84,103,0.5)" />
//             <Text style={[styles.emptyText, { marginTop: 8 }]}>
//               No audit entries match these filters.
//             </Text>
//           </View>
//         ) : (
//           <FlatList
//             data={rows}
//             keyExtractor={(item) => item._id}
//             renderItem={renderItem}
//             scrollEnabled={false}
//             ItemSeparatorComponent={() => <View style={styles.separator} />}
//           />
//         )}

//         {/* Pagination */}
//         {pages > 1 && (
//           <View style={styles.pagination}>
//             <TouchableOpacity
//               disabled={page <= 1}
//               onPress={() => setPage((p) => Math.max(1, p - 1))}
//               style={{ opacity: page <= 1 ? 0.4 : 1 }}
//             >
//               <Text style={styles.pageBtn}>← Previous</Text>
//             </TouchableOpacity>

//             <Text style={styles.pageInfo}>
//               Page {page} of {pages}
//             </Text>

//             <TouchableOpacity
//               disabled={page >= pages}
//               onPress={() => setPage((p) => Math.min(pages, p + 1))}
//               style={{ opacity: page >= pages ? 0.4 : 1 }}
//             >
//               <Text style={styles.pageBtn}>Next →</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </Card>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F7F5F0",
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   filterCard: {
//     marginBottom: 16,
//     zIndex: 10,
//   },
//   searchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     marginBottom: 12,
//   },
//   searchIcon: {
//     marginLeft: 12,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 10,
//     fontSize: 13,
//     color: "#16213E",
//   },
//   filterRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//     marginBottom: 10,
//   },
//   dropdownWrap: {
//     position: "relative",
//     minWidth: 120,
//     flex: 1,
//   },
//   dropdownBtn: {
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//   },
//   dropdownText: {
//     fontSize: 13,
//     color: "#16213E",
//   },
//   dropdownList: {
//     position: "absolute",
//     top: 46,
//     left: 0,
//     right: 0,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     maxHeight: 200,
//     zIndex: 100,
//     elevation: 8,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   dropdownItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.04)",
//   },
//   dropdownItemText: {
//     fontSize: 13,
//     color: "#16213E",
//   },
//   totalText: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.6)",
//     textAlign: "right",
//   },
//   center: {
//     alignItems: "center",
//     paddingVertical: 32,
//   },
//   emptyText: {
//     fontSize: 13,
//     color: "rgba(71,84,103,0.7)",
//   },
//   row: {
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//   },
//   when: {
//     fontSize: 12,
//     color: "#475467",
//     marginBottom: 6,
//   },
//   actor: {
//     marginBottom: 6,
//   },
//   actorEmail: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#16213E",
//   },
//   actorRole: {
//     fontSize: 11,
//     color: "rgba(71,84,103,0.6)",
//     marginTop: 1,
//   },
//   pill: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 999,
//     marginBottom: 6,
//   },
//   pillText: {
//     fontSize: 11.5,
//     fontWeight: "600",
//   },
//   target: {
//     marginBottom: 6,
//   },
//   targetType: {
//     fontSize: 12.5,
//     color: "#475467",
//   },
//   targetId: {
//     fontSize: 11,
//     color: "rgba(71,84,103,0.5)",
//   },
//   detail: {
//     marginTop: 2,
//   },
//   detailMsg: {
//     fontSize: 12.5,
//     color: "#475467",
//   },
//   detailReason: {
//     fontSize: 11.5,
//     color: "rgba(71,84,103,0.6)",
//     marginTop: 2,
//   },
//   detailIp: {
//     fontSize: 10.5,
//     color: "rgba(71,84,103,0.5)",
//     marginTop: 2,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: "rgba(0,0,0,0.04)",
//   },
//   pagination: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: "rgba(0,0,0,0.06)",
//   },
//   pageBtn: {
//     fontSize: 12.5,
//     fontWeight: "600",
//     color: "#475467",
//   },
//   pageInfo: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.6)",
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { ShieldCheck, Search } from "lucide-react-native";
import { DrawerToggle } from "@/components/PlatformSidebar";
import { api } from "@/lib/api";
import { Card, PageIntro, Pill } from "@/components/UI";

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
  login: { bg: "#DBEAFE", text: "#1E40AF" },
  logout: { bg: "#F1F5F9", text: "#475569" },
  "user.created": { bg: "#D1FAE5", text: "#065F46" },
  "user.updated": { bg: "#CCFBF1", text: "#0F766E" },
  "user.deactivated": { bg: "#FEF3C7", text: "#92400E" },
  "user.soft_deleted": { bg: "#FEE2E2", text: "#991B1B" },
  "user.restored": { bg: "#D1FAE5", text: "#065F46" },
  "school.created": { bg: "#D1FAE5", text: "#065F46" },
  "school.updated": { bg: "#CCFBF1", text: "#0F766E" },
  "school.suspended": { bg: "#FEE2E2", text: "#991B1B" },
  "school.activated": { bg: "#D1FAE5", text: "#065F46" },
  "school.deactivated": { bg: "#FEF3C7", text: "#92400E" },
  "school.reactivated": { bg: "#D1FAE5", text: "#065F46" },
  "plan.created": { bg: "#E0E7FF", text: "#3730A3" },
  "plan.updated": { bg: "#E0E7FF", text: "#3730A3" },
  "plan.deactivated": { bg: "#FEF3C7", text: "#92400E" },
  "plan.archived": { bg: "#F1F5F9", text: "#475569" },
  "subscription.created": { bg: "#E0E7FF", text: "#3730A3" },
  "subscription.changed": { bg: "#E0E7FF", text: "#3730A3" },
  "subscription.suspended": { bg: "#FEE2E2", text: "#991B1B" },
  "subscription.reactivated": { bg: "#D1FAE5", text: "#065F46" },
  "subscription.cancelled": { bg: "#FEF3C7", text: "#92400E" },
  "invoice.generated": { bg: "#F3E8FF", text: "#6B21A8" },
  "invoice.updated": { bg: "#F3E8FF", text: "#6B21A8" },
  "report.generated": { bg: "#CFFAFE", text: "#155E75" },
  "settings.changed": { bg: "#F1F5F9", text: "#334155" },
};

const ACTIONS = Object.keys(ACTION_COLORS);

const TARGET_TYPES = [
  { label: "All targets", value: "" },
  { label: "School", value: "school" },
  { label: "User", value: "user" },
  { label: "Plan", value: "plan" },
  { label: "Subscription", value: "subscription" },
  { label: "Invoice", value: "invoice" },
  { label: "Report", value: "report" },
  { label: "Setting", value: "setting" },
];

const RESULTS = [
  { label: "All results", value: "" },
  { label: "Success", value: "success" },
  { label: "Failure", value: "failure" },
];

const fmtDate = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

type AuditRow = {
  _id: string;
  createdAt?: string;
  actorEmail?: string;
  actorRole?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  result?: string;
  message?: string;
  reason?: string;
  context?: { ip?: string };
};

type Filters = {
  actorEmail: string;
  action: string;
  targetType: string;
  result: string;
};

export default function AuditLogs() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    actorEmail: "",
    action: "",
    targetType: "",
    result: "",
  });

  // Simple dropdown open state
  const [openDropdown, setOpenDropdown] = useState<
    "action" | "targetType" | "result" | null
  >(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.actorEmail) params.set("actorEmail", filters.actorEmail);
    if (filters.action) params.set("action", filters.action);
    if (filters.targetType) params.set("targetType", filters.targetType);
    if (filters.result) params.set("result", filters.result);
    params.set("page", String(page));

    setLoading(true);
    api.platform
      .auditLogs(params.toString())
      .then((res: any) => {
        setRows(res.data || []);
        setTotal(res.total ?? 0);
        setPages(res.pages ?? 0);
      })
      .catch((err: any) => {
        console.warn(err.message);
      })
      .finally(() => setLoading(false));
  }, [filters, page]);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setOpenDropdown(null);
  };

  const renderItem = ({ item }: { item: AuditRow }) => {
    const actionColor =
      ACTION_COLORS[item.action || ""] || {
        bg: "#F1F5F9",
        text: "#475569",
      };
    const isFailure = item.result === "failure";

    return (
      <View style={styles.row}>
        {/* When */}
        <Text style={styles.when}>{fmtDate(item.createdAt)}</Text>

        {/* Actor */}
        <View style={styles.actor}>
          <Text style={styles.actorEmail} numberOfLines={1}>
            {item.actorEmail || "system"}
          </Text>
          {item.actorRole ? (
            <Text style={styles.actorRole}>{item.actorRole}</Text>
          ) : null}
        </View>

        {/* Action */}
        <View style={[styles.pill, { backgroundColor: actionColor.bg }]}>
          <Text style={[styles.pillText, { color: actionColor.text }]}>
            {item.action || "—"}
          </Text>
        </View>

        {/* Target */}
        <View style={styles.target}>
          <Text style={styles.targetType}>{item.targetType || "—"}</Text>
          {item.targetId ? (
            <Text style={styles.targetId}>
              {String(item.targetId).slice(0, 8)}
            </Text>
          ) : null}
        </View>

        {/* Result */}
        <View
          style={[
            styles.pill,
            {
              backgroundColor: isFailure ? "#FEE2E2" : "#D1FAE5",
            },
          ]}
        >
          <Text
            style={[
              styles.pillText,
              { color: isFailure ? "#991B1B" : "#065F46" },
            ]}
          >
            {item.result || "—"}
          </Text>
        </View>

        {/* Detail */}
        <View style={styles.detail}>
          <Text style={styles.detailMsg}>{item.message || "—"}</Text>
          {item.reason ? (
            <Text style={styles.detailReason}>Reason: {item.reason}</Text>
          ) : null}
          {item.context?.ip ? (
            <Text style={styles.detailIp}>IP {item.context.ip}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <DrawerToggle />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageIntro
          eyebrow="Platform Owner · System"
          title="Audit Logs"
          description="Immutable, append-only trail of sensitive platform actions. Every entry records who did what, to which entity, and the outcome. Secrets are never stored."
        />

        {/* Filters */}
        <Card style={styles.filterCard} bodyStyle={{ padding: 14 }}>
          {/* Actor email search */}
          <View style={styles.searchWrap}>
            <Search
              size={14}
              color="rgba(71,84,103,0.5)"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Filter by actor email…"
              placeholderTextColor="rgba(71,84,103,0.5)"
              value={filters.actorEmail}
              onChangeText={(v) => updateFilter("actorEmail", v)}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Dropdowns */}
          <View style={styles.filterRow}>
            {/* Action */}
            <View style={styles.dropdownWrap}>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() =>
                  setOpenDropdown(openDropdown === "action" ? null : "action")
                }
              >
                <Text style={styles.dropdownText} numberOfLines={1}>
                  {filters.action || "All actions"}
                </Text>
              </TouchableOpacity>
              {openDropdown === "action" && (
                <View style={styles.dropdownList}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => updateFilter("action", "")}
                  >
                    <Text style={styles.dropdownItemText}>All actions</Text>
                  </TouchableOpacity>
                  {ACTIONS.map((a) => (
                    <TouchableOpacity
                      key={a}
                      style={styles.dropdownItem}
                      onPress={() => updateFilter("action", a)}
                    >
                      <Text style={styles.dropdownItemText}>{a}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Target Type */}
            <View style={styles.dropdownWrap}>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() =>
                  setOpenDropdown(
                    openDropdown === "targetType" ? null : "targetType"
                  )
                }
              >
                <Text style={styles.dropdownText} numberOfLines={1}>
                  {TARGET_TYPES.find((t) => t.value === filters.targetType)
                    ?.label || "All targets"}
                </Text>
              </TouchableOpacity>
              {openDropdown === "targetType" && (
                <View style={styles.dropdownList}>
                  {TARGET_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={styles.dropdownItem}
                      onPress={() => updateFilter("targetType", t.value)}
                    >
                      <Text style={styles.dropdownItemText}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Result */}
            <View style={styles.dropdownWrap}>
              <TouchableOpacity
                style={styles.dropdownBtn}
                onPress={() =>
                  setOpenDropdown(openDropdown === "result" ? null : "result")
                }
              >
                <Text style={styles.dropdownText} numberOfLines={1}>
                  {RESULTS.find((r) => r.value === filters.result)?.label ||
                    "All results"}
                </Text>
              </TouchableOpacity>
              {openDropdown === "result" && (
                <View style={styles.dropdownList}>
                  {RESULTS.map((r) => (
                    <TouchableOpacity
                      key={r.value}
                      style={styles.dropdownItem}
                      onPress={() => updateFilter("result", r.value)}
                    >
                      <Text style={styles.dropdownItemText}>{r.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          <Text style={styles.totalText}>{total} entries</Text>
        </Card>

        {/* Table / List */}
        <Card bodyStyle={{ padding: 0 }}>
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#E8A33D" />
              <Text style={styles.emptyText}>Loading audit trail…</Text>
            </View>
          ) : rows.length === 0 ? (
            <View style={styles.center}>
              <ShieldCheck size={18} color="rgba(71,84,103,0.5)" />
              <Text style={[styles.emptyText, { marginTop: 8 }]}>
                No audit entries match these filters.
              </Text>
            </View>
          ) : (
            <FlatList
              data={rows}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}

          {/* Pagination */}
          {pages > 1 && (
            <View style={styles.pagination}>
              <TouchableOpacity
                disabled={page <= 1}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                style={{ opacity: page <= 1 ? 0.4 : 1 }}
              >
                <Text style={styles.pageBtn}>← Previous</Text>
              </TouchableOpacity>

              <Text style={styles.pageInfo}>
                Page {page} of {pages}
              </Text>

              <TouchableOpacity
                disabled={page >= pages}
                onPress={() => setPage((p) => Math.min(pages, p + 1))}
                style={{ opacity: page >= pages ? 0.4 : 1 }}
              >
                <Text style={styles.pageBtn}>Next →</Text>
              </TouchableOpacity>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F5F0",
  },
  toggleRow: {
    backgroundColor: "#16213E",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  filterCard: {
    marginBottom: 16,
    zIndex: 10,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 13,
    color: "#16213E",
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  dropdownWrap: {
    position: "relative",
    minWidth: 120,
    flex: 1,
  },
  dropdownBtn: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dropdownText: {
    fontSize: 13,
    color: "#16213E",
  },
  dropdownList: {
    position: "absolute",
    top: 46,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    maxHeight: 200,
    zIndex: 100,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  dropdownItemText: {
    fontSize: 13,
    color: "#16213E",
  },
  totalText: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    textAlign: "right",
  },
  center: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  when: {
    fontSize: 12,
    color: "#475467",
    marginBottom: 6,
  },
  actor: {
    marginBottom: 6,
  },
  actorEmail: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16213E",
  },
  actorRole: {
    fontSize: 11,
    color: "rgba(71,84,103,0.6)",
    marginTop: 1,
  },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginBottom: 6,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: "600",
  },
  target: {
    marginBottom: 6,
  },
  targetType: {
    fontSize: 12.5,
    color: "#475467",
  },
  targetId: {
    fontSize: 11,
    color: "rgba(71,84,103,0.5)",
  },
  detail: {
    marginTop: 2,
  },
  detailMsg: {
    fontSize: 12.5,
    color: "#475467",
  },
  detailReason: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 2,
  },
  detailIp: {
    fontSize: 10.5,
    color: "rgba(71,84,103,0.5)",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  pageBtn: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#475467",
  },
  pageInfo: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
  },
});