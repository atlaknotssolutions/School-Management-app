// import { DrawerToggle } from "@/components/PlatformSidebar";
// import { PlatformTabBar } from "@/components/PlatformTabBar";
// import { Card, PageIntro } from "@/components/UI";
// import { api } from "@/lib/api";
// import * as FileSystem from "expo-file-system/legacy";
// import * as Sharing from "expo-sharing";
// import {
//   ArrowDown,
//   ArrowUp,
//   CalendarDays,
//   Download,
//   FileBarChart,
// } from "lucide-react-native";
// import { useEffect, useMemo, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
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
//   border: "rgba(0,0,0,0.06)",
// };

// const fmtValue = (value: any) => {
//   if (value === null || value === undefined || value === "") return "—";
//   if (value instanceof Date) return value.toLocaleDateString("en-IN");
//   const date = new Date(value);
//   if (
//     !Number.isNaN(date.getTime()) &&
//     typeof value === "string" &&
//     value.includes("T")
//   ) {
//     return date.toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   }
//   return String(value);
// };

// const toCsv = (rows: any[]) => {
//   if (!rows.length) return "";
//   const headers = Object.keys(rows[0]);
//   const escape = (value: any) => {
//     const text = value === null || value === undefined ? "" : String(value);
//     return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
//   };
//   const lines = [headers.join(",")];
//   for (const row of rows) {
//     lines.push(headers.map((h) => escape(row[h])).join(","));
//   }
//   return lines.join("\n");
// };

// type CatalogItem = {
//   id: string;
//   title: string;
//   category?: string;
// };

// type ReportData = {
//   meta: {
//     type?: string;
//     title?: string;
//     rowCount?: number;
//     generatedAt?: string;
//   };
//   columns: string[];
//   rows: any[];
// };

// export default function PlatformReports() {
//   const [catalog, setCatalog] = useState<CatalogItem[]>([]);
//   const [type, setType] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [report, setReport] = useState<ReportData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [generating, setGenerating] = useState(false);
//   const [query, setQuery] = useState("");
//   const [sortKey, setSortKey] = useState("");
//   const [sortDir, setSortDir] = useState<1 | -1>(1);
//   const [maxRows, setMaxRows] = useState(100);
//   const [openCatalog, setOpenCatalog] = useState(false);
//   const [openMaxRows, setOpenMaxRows] = useState(false);

//   useEffect(() => {
//     api.platform.reports
//       .catalog()
//       .then(({ data }: any) => {
//         setCatalog(data || []);
//         if (data?.length) setType(data[0].id);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const run = async (nextType = type) => {
//     if (!nextType) return;
//     setGenerating(true);
//     const params = new URLSearchParams();
//     if (from) params.set("from", from);
//     if (to) params.set("to", to);

//     try {
//       const { data } = await api.platform.reports.generate(
//         nextType,
//         params.toString(),
//       );
//       setReport(data);
//       setSortKey("");
//       setSortDir(1);
//     } catch (err: any) {
//       Alert.alert("Error", err.message || "Failed to generate report");
//     } finally {
//       setGenerating(false);
//     }
//   };

//   const rows = useMemo(() => {
//     let result = (report?.rows || []).slice();

//     if (query.trim()) {
//       const needle = query.trim().toLowerCase();
//       result = result.filter((row) =>
//         Object.values(row).some((v) =>
//           String(v ?? "")
//             .toLowerCase()
//             .includes(needle),
//         ),
//       );
//     }

//     if (sortKey) {
//       result = [...result].sort((a, b) => {
//         const av = a[sortKey];
//         const bv = b[sortKey];
//         if (
//           av instanceof Date ||
//           (typeof av === "string" && !Number.isNaN(new Date(av).getTime()))
//         ) {
//           return (new Date(av).getTime() - new Date(bv).getTime()) * sortDir;
//         }
//         return String(av ?? "").localeCompare(String(bv ?? "")) * sortDir;
//       });
//     }

//     return result;
//   }, [report, query, sortKey, sortDir]);

//   const limitedRows = rows.slice(0, maxRows);
//   const columns = report?.columns || [];

//   const toggleSort = (key: string) => {
//     if (sortKey === key) {
//       setSortDir((d) => (d === 1 ? -1 : 1));
//     } else {
//       setSortKey(key);
//       setSortDir(1);
//     }
//   };

//   const download = async () => {
//     const csv = toCsv(limitedRows);
//     if (!csv) {
//       Alert.alert("No data", "Nothing to export");
//       return;
//     }

//     try {
//       const fileName = `${report?.meta?.type || "report"}.csv`;
//       const fileUri = FileSystem.cacheDirectory + fileName;

//       await FileSystem.writeAsStringAsync(fileUri, csv, {
//         encoding: FileSystem.EncodingType.UTF8,
//       });

//       if (await Sharing.isAvailableAsync()) {
//         await Sharing.shareAsync(fileUri, {
//           mimeType: "text/csv",
//           dialogTitle: "Export Report CSV",
//         });
//       } else {
//         Alert.alert("Saved", `CSV saved to ${fileUri}`);
//       }
//     } catch (e: any) {
//       Alert.alert("Export failed", e.message || "Could not export CSV");
//     }
//   };

//   const selectedTitle =
//     catalog.find((c) => c.id === type)?.title || "Select report";

//   return (
//     <View style={styles.container}>
//       <View style={styles.toggleRow}>
//         <DrawerToggle />
//       </View>
//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <PageIntro
//           eyebrow="Platform Owner · Insights"
//           title="Reports"
//           description="Generate reports on demand from live platform data. No fabricated figures — every row comes from schools, users, subscriptions or invoices."
//         />

//         {/* Catalog */}
//         <Card
//           title="Report catalog"
//           style={styles.mb4}
//           bodyStyle={{ padding: 8 }}
//         >
//           {loading ? (
//             <View style={styles.center}>
//               <ActivityIndicator color={colors.amber} />
//               <Text style={styles.muted}>Loading catalog…</Text>
//             </View>
//           ) : (
//             <View>
//               {catalog.map((item) => {
//                 const active = type === item.id;
//                 return (
//                   <TouchableOpacity
//                     key={item.id}
//                     onPress={() => {
//                       setType(item.id);
//                       setReport(null);
//                     }}
//                     style={[
//                       styles.catalogItem,
//                       active && styles.catalogItemActive,
//                     ]}
//                     activeOpacity={0.7}
//                   >
//                     <View style={styles.catalogRow}>
//                       <FileBarChart
//                         size={14}
//                         color={
//                           active ? colors.amberDark : "rgba(71,84,103,0.6)"
//                         }
//                       />
//                       <Text
//                         style={[
//                           styles.catalogTitle,
//                           active && { color: colors.ink },
//                         ]}
//                       >
//                         {item.title}
//                       </Text>
//                     </View>
//                     {item.category ? (
//                       <Text style={styles.catalogCat}>{item.category}</Text>
//                     ) : null}
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           )}
//         </Card>

//         {/* Generate */}
//         <Card title="Generate" style={styles.mb4}>
//           {/* Type selector */}
//           <Text style={styles.label}>Report type</Text>
//           <TouchableOpacity
//             style={styles.selectBtn}
//             onPress={() => setOpenCatalog(!openCatalog)}
//           >
//             <Text style={styles.selectText}>{selectedTitle}</Text>
//           </TouchableOpacity>
//           {openCatalog && (
//             <View style={styles.dropdown}>
//               {catalog.map((item) => (
//                 <TouchableOpacity
//                   key={item.id}
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     setType(item.id);
//                     setReport(null);
//                     setOpenCatalog(false);
//                   }}
//                 >
//                   <Text style={styles.dropdownText}>{item.title}</Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           {/* Date range */}
//           <View style={styles.dateRow}>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.label}>From (YYYY-MM-DD)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={from}
//                 onChangeText={setFrom}
//                 placeholder="2025-01-01"
//                 placeholderTextColor="rgba(71,84,103,0.45)"
//               />
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text style={styles.label}>To (YYYY-MM-DD)</Text>
//               <TextInput
//                 style={styles.input}
//                 value={to}
//                 onChangeText={setTo}
//                 placeholder="2025-12-31"
//                 placeholderTextColor="rgba(71,84,103,0.45)"
//               />
//             </View>
//           </View>

//           {/* Actions */}
//           <View style={styles.actionRow}>
//             <TouchableOpacity
//               style={[styles.genBtn, (generating || !type) && { opacity: 0.6 }]}
//               onPress={() => run()}
//               disabled={generating || !type}
//               activeOpacity={0.8}
//             >
//               {generating ? (
//                 <ActivityIndicator color={colors.ink} size="small" />
//               ) : (
//                 <CalendarDays size={15} color={colors.ink} />
//               )}
//               <Text style={styles.genBtnText}>
//                 {generating ? "Generating…" : "Generate"}
//               </Text>
//             </TouchableOpacity>

//             {report ? (
//               <TouchableOpacity
//                 style={styles.csvBtn}
//                 onPress={download}
//                 activeOpacity={0.8}
//               >
//                 <Download size={15} color={colors.ink} />
//                 <Text style={styles.csvBtnText}>CSV</Text>
//               </TouchableOpacity>
//             ) : null}
//           </View>

//           {report?.meta ? (
//             <Text style={styles.metaText}>
//               {report.meta.title} · {report.meta.rowCount} rows · generated{" "}
//               {report.meta.generatedAt
//                 ? new Date(report.meta.generatedAt).toLocaleString("en-IN")
//                 : "—"}
//             </Text>
//           ) : null}
//         </Card>

//         {/* Results */}
//         {report ? (
//           <Card>
//             {/* Filter + limit */}
//             <View style={styles.resultTools}>
//               <TextInput
//                 style={[styles.input, { flex: 1 }]}
//                 placeholder="Filter rows…"
//                 placeholderTextColor="rgba(71,84,103,0.45)"
//                 value={query}
//                 onChangeText={setQuery}
//               />

//               <TouchableOpacity
//                 style={[styles.selectBtn, { width: 100 }]}
//                 onPress={() => setOpenMaxRows(!openMaxRows)}
//               >
//                 <Text style={styles.selectText}>{maxRows} rows</Text>
//               </TouchableOpacity>
//             </View>

//             {openMaxRows && (
//               <View style={[styles.dropdown, { marginBottom: 12 }]}>
//                 {[50, 100, 500, 100000].map((n) => (
//                   <TouchableOpacity
//                     key={n}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       setMaxRows(n);
//                       setOpenMaxRows(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownText}>
//                       {n === 100000 ? "All" : `${n} rows`}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             <Text style={styles.showing}>
//               showing {limitedRows.length} of {rows.length}
//             </Text>

//             {limitedRows.length === 0 ? (
//               <Text
//                 style={[
//                   styles.muted,
//                   { textAlign: "center", paddingVertical: 24 },
//                 ]}
//               >
//                 No rows to display.
//               </Text>
//             ) : (
//               <ScrollView horizontal showsHorizontalScrollIndicator>
//                 <View>
//                   {/* Header */}
//                   <View style={styles.tableHeader}>
//                     {columns.map((column) => (
//                       <TouchableOpacity
//                         key={column}
//                         style={styles.th}
//                         onPress={() => toggleSort(column)}
//                       >
//                         <Text style={styles.thText}>{column}</Text>
//                         {sortKey === column ? (
//                           sortDir === 1 ? (
//                             <ArrowDown size={11} color={colors.slate} />
//                           ) : (
//                             <ArrowUp size={11} color={colors.slate} />
//                           )
//                         ) : null}
//                       </TouchableOpacity>
//                     ))}
//                   </View>

//                   {/* Rows */}
//                   {limitedRows.map((row, index) => (
//                     <View
//                       key={index}
//                       style={[
//                         styles.tableRow,
//                         index % 2 === 1 && {
//                           backgroundColor: "rgba(247,245,240,0.5)",
//                         },
//                       ]}
//                     >
//                       {columns.map((column) => (
//                         <View key={column} style={styles.td}>
//                           <Text style={styles.tdText} numberOfLines={2}>
//                             {fmtValue(row[column])}
//                           </Text>
//                         </View>
//                       ))}
//                     </View>
//                   ))}
//                 </View>
//               </ScrollView>
//             )}
//           </Card>
//         ) : (
//           <Card>
//             <Text style={styles.muted}>
//               Choose a report from the catalog and press Generate. Results
//               appear here and can be exported to CSV.
//             </Text>
//           </Card>
//         )}
//       </ScrollView>
//       <PlatformTabBar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.paper,
//   },
//   toggleRow: {
//     backgroundColor: "#16213E",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     alignItems: "flex-start",
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   mb4: {
//     marginBottom: 16,
//   },
//   center: {
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   muted: {
//     fontSize: 13,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 8,
//   },
//   catalogItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   catalogItemActive: {
//     backgroundColor: "rgba(232,163,61,0.1)",
//   },
//   catalogRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//   },
//   catalogTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: colors.slate,
//   },
//   catalogCat: {
//     fontSize: 11,
//     color: "rgba(71,84,103,0.6)",
//     marginTop: 2,
//     marginLeft: 22,
//   },
//   label: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "rgba(71,84,103,0.7)",
//     marginBottom: 6,
//     marginTop: 8,
//   },
//   selectBtn: {
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//   },
//   selectText: {
//     fontSize: 13,
//     color: colors.ink,
//   },
//   dropdown: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     marginTop: 4,
//     overflow: "hidden",
//   },
//   dropdownItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.04)",
//   },
//   dropdownText: {
//     fontSize: 13,
//     color: colors.ink,
//   },
//   dateRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginTop: 4,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     paddingHorizontal: 12,
//     paddingVertical: 11,
//     fontSize: 13,
//     color: colors.ink,
//   },
//   actionRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginTop: 16,
//   },
//   genBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: colors.amber,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },
//   genBtnText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   csvBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "#fff",
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 10,
//   },
//   csvBtnText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   metaText: {
//     fontSize: 11.5,
//     color: "rgba(71,84,103,0.6)",
//     marginTop: 12,
//   },
//   resultTools: {
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 8,
//   },
//   showing: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.6)",
//     marginBottom: 12,
//     textAlign: "right",
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: colors.paper,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   th: {
//     minWidth: 120,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//   },
//   thText: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: colors.slate,
//     textTransform: "uppercase",
//   },
//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.04)",
//   },
//   td: {
//     minWidth: 120,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   tdText: {
//     fontSize: 12.5,
//     color: colors.slate,
//   },
// });

import { DrawerToggle } from "@/components/PlatformSidebar";
import { PlatformTabBar } from "@/components/PlatformTabBar";
import { Card, PageIntro } from "@/components/UI";
import { api } from "@/lib/api";
import { logout } from "@/store/authSlice"; // adjust path
import { selectRole, selectUser } from "@/store/selectors"; // adjust path
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import {
  ArrowDown,
  ArrowUp,
  Bell,
  CalendarDays,
  CheckCheck,
  Download,
  FileBarChart,
  Inbox,
  LogOut,
} from "lucide-react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
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

const fmtValue = (value: any) => {
  if (value === null || value === undefined || value === "") return "—";
  if (value instanceof Date) return value.toLocaleDateString("en-IN");
  const date = new Date(value);
  if (
    !Number.isNaN(date.getTime()) &&
    typeof value === "string" &&
    value.includes("T")
  ) {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return String(value);
};

const toCsv = (rows: any[]) => {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const escape = (value: any) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
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

type CatalogItem = {
  id: string;
  title: string;
  category?: string;
};

type ReportData = {
  meta: {
    type?: string;
    title?: string;
    rowCount?: number;
    generatedAt?: string;
  };
  columns: string[];
  rows: any[];
};

export default function PlatformReports() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [catalog, setCatalog] = useState<CatalogItem[]>([]);
  const [type, setType] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const [maxRows, setMaxRows] = useState(100);
  const [openCatalog, setOpenCatalog] = useState(false);
  const [openMaxRows, setOpenMaxRows] = useState(false);

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.platform.reports
      .catalog()
      .then(({ data }: any) => {
        setCatalog(data || []);
        if (data?.length) setType(data[0].id);
      })
      .catch(() => {})
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

  const run = async (nextType = type) => {
    if (!nextType) return;
    setGenerating(true);
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);

    try {
      const { data } = await api.platform.reports.generate(
        nextType,
        params.toString(),
      );
      setReport(data);
      setSortKey("");
      setSortDir(1);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const rows = useMemo(() => {
    let result = (report?.rows || []).slice();

    if (query.trim()) {
      const needle = query.trim().toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(needle),
        ),
      );
    }

    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (
          av instanceof Date ||
          (typeof av === "string" && !Number.isNaN(new Date(av).getTime()))
        ) {
          return (new Date(av).getTime() - new Date(bv).getTime()) * sortDir;
        }
        return String(av ?? "").localeCompare(String(bv ?? "")) * sortDir;
      });
    }

    return result;
  }, [report, query, sortKey, sortDir]);

  const limitedRows = rows.slice(0, maxRows);
  const columns = report?.columns || [];

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const download = async () => {
    const csv = toCsv(limitedRows);
    if (!csv) {
      Alert.alert("No data", "Nothing to export");
      return;
    }

    try {
      const fileName = `${report?.meta?.type || "report"}.csv`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/csv",
          dialogTitle: "Export Report CSV",
        });
      } else {
        Alert.alert("Saved", `CSV saved to ${fileUri}`);
      }
    } catch (e: any) {
      Alert.alert("Export failed", e.message || "Could not export CSV");
    }
  };

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

  const selectedTitle =
    catalog.find((c) => c.id === type)?.title || "Select report";

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
            Reports
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
          eyebrow="Platform Owner · Insights"
          title="Reports"
          description="Generate reports on demand from live platform data. No fabricated figures — every row comes from schools, users, subscriptions or invoices."
        />

        {/* Catalog */}
        <Card
          title="Report catalog"
          style={styles.mb4}
          bodyStyle={{ padding: 8 }}
        >
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator color={colors.amber} />
              <Text style={styles.muted}>Loading catalog…</Text>
            </View>
          ) : (
            <View>
              {catalog.map((item) => {
                const active = type === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      setType(item.id);
                      setReport(null);
                    }}
                    style={[
                      styles.catalogItem,
                      active && styles.catalogItemActive,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.catalogRow}>
                      <FileBarChart
                        size={14}
                        color={
                          active ? colors.amberDark : "rgba(71,84,103,0.6)"
                        }
                      />
                      <Text
                        style={[
                          styles.catalogTitle,
                          active && { color: colors.ink },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                    {item.category ? (
                      <Text style={styles.catalogCat}>{item.category}</Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </Card>

        {/* Generate */}
        <Card title="Generate" style={styles.mb4}>
          {/* Type selector */}
          <Text style={styles.label}>Report type</Text>
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={() => setOpenCatalog(!openCatalog)}
          >
            <Text style={styles.selectText}>{selectedTitle}</Text>
          </TouchableOpacity>
          {openCatalog && (
            <View style={styles.dropdown}>
              {catalog.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setType(item.id);
                    setReport(null);
                    setOpenCatalog(false);
                  }}
                >
                  <Text style={styles.dropdownText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Date range */}
          <View style={styles.dateRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>From (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={from}
                onChangeText={setFrom}
                placeholder="2025-01-01"
                placeholderTextColor="rgba(71,84,103,0.45)"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>To (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={to}
                onChangeText={setTo}
                placeholder="2025-12-31"
                placeholderTextColor="rgba(71,84,103,0.45)"
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.genBtn, (generating || !type) && { opacity: 0.6 }]}
              onPress={() => run()}
              disabled={generating || !type}
              activeOpacity={0.8}
            >
              {generating ? (
                <ActivityIndicator color={colors.ink} size="small" />
              ) : (
                <CalendarDays size={15} color={colors.ink} />
              )}
              <Text style={styles.genBtnText}>
                {generating ? "Generating…" : "Generate"}
              </Text>
            </TouchableOpacity>

            {report ? (
              <TouchableOpacity
                style={styles.csvBtn}
                onPress={download}
                activeOpacity={0.8}
              >
                <Download size={15} color={colors.ink} />
                <Text style={styles.csvBtnText}>CSV</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {report?.meta ? (
            <Text style={styles.metaText}>
              {report.meta.title} · {report.meta.rowCount} rows · generated{" "}
              {report.meta.generatedAt
                ? new Date(report.meta.generatedAt).toLocaleString("en-IN")
                : "—"}
            </Text>
          ) : null}
        </Card>

        {/* Results */}
        {report ? (
          <Card>
            {/* Filter + limit */}
            <View style={styles.resultTools}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Filter rows…"
                placeholderTextColor="rgba(71,84,103,0.45)"
                value={query}
                onChangeText={setQuery}
              />

              <TouchableOpacity
                style={[styles.selectBtn, { width: 100 }]}
                onPress={() => setOpenMaxRows(!openMaxRows)}
              >
                <Text style={styles.selectText}>{maxRows} rows</Text>
              </TouchableOpacity>
            </View>

            {openMaxRows && (
              <View style={[styles.dropdown, { marginBottom: 12 }]}>
                {[50, 100, 500, 100000].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setMaxRows(n);
                      setOpenMaxRows(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>
                      {n === 100000 ? "All" : `${n} rows`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.showing}>
              showing {limitedRows.length} of {rows.length}
            </Text>

            {limitedRows.length === 0 ? (
              <Text
                style={[
                  styles.muted,
                  { textAlign: "center", paddingVertical: 24 },
                ]}
              >
                No rows to display.
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View>
                  {/* Header */}
                  <View style={styles.tableHeader}>
                    {columns.map((column) => (
                      <TouchableOpacity
                        key={column}
                        style={styles.th}
                        onPress={() => toggleSort(column)}
                      >
                        <Text style={styles.thText}>{column}</Text>
                        {sortKey === column ? (
                          sortDir === 1 ? (
                            <ArrowDown size={11} color={colors.slate} />
                          ) : (
                            <ArrowUp size={11} color={colors.slate} />
                          )
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Rows */}
                  {limitedRows.map((row, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tableRow,
                        index % 2 === 1 && {
                          backgroundColor: "rgba(247,245,240,0.5)",
                        },
                      ]}
                    >
                      {columns.map((column) => (
                        <View key={column} style={styles.td}>
                          <Text style={styles.tdText} numberOfLines={2}>
                            {fmtValue(row[column])}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </Card>
        ) : (
          <Card>
            <Text style={styles.muted}>
              Choose a report from the catalog and press Generate. Results
              appear here and can be exported to CSV.
            </Text>
          </Card>
        )}
      </ScrollView>

      {/* Bottom tabs */}
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
  mb4: {
    marginBottom: 16,
  },
  center: {
    alignItems: "center",
    paddingVertical: 20,
  },
  muted: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 8,
  },
  catalogItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  catalogItemActive: {
    backgroundColor: "rgba(232,163,61,0.1)",
  },
  catalogRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  catalogTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.slate,
  },
  catalogCat: {
    fontSize: 11,
    color: "rgba(71,84,103,0.6)",
    marginTop: 2,
    marginLeft: 22,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(71,84,103,0.7)",
    marginBottom: 6,
    marginTop: 8,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginTop: 4,
    overflow: "hidden",
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
  dateRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
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
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  genBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.amber,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  genBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  csvBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  csvBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  metaText: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 12,
  },
  resultTools: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  showing: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
    marginBottom: 12,
    textAlign: "right",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  th: {
    minWidth: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  thText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.slate,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.04)",
  },
  td: {
    minWidth: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  tdText: {
    fontSize: 12.5,
    color: colors.slate,
  },
});