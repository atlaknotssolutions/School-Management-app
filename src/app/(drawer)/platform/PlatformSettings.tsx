// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
// } from "react-native";
// import { Info, Lock, RotateCcw, Save } from "lucide-react-native";
// import { api } from "@/lib/api";
// import { Card, PageIntro } from "@/components/UI";

// const colors = {
//   ink: "#16213E",
//   amber: "#E8A33D",
//   amberDark: "#C9832A",
//   paper: "#F7F5F0",
//   slate: "#475467",
//   border: "rgba(0,0,0,0.06)",
// };

// const SECTION_ORDER = [
//   {
//     id: "general",
//     title: "General",
//     blurb: "Public-facing identity of the platform.",
//   },
//   {
//     id: "security",
//     title: "Security",
//     blurb: "Login and account hardening.",
//   },
//   {
//     id: "billing",
//     title: "Billing",
//     blurb: "Currency and invoice behaviour.",
//   },
//   {
//     id: "notifications",
//     title: "Notifications",
//     blurb: "Automated reminders and alerts.",
//   },
// ];

// type Setting = {
//   key: string;
//   label: string;
//   help?: string;
//   section: string;
//   type: "boolean" | "number" | "string" | string;
//   value: any;
//   default: any;
//   options?: string[];
//   min?: number;
//   max?: number;
// };

// // ========== Toggle ==========
// function Toggle({
//   checked,
//   onChange,
// }: {
//   checked: boolean;
//   onChange: (next: boolean) => void;
// }) {
//   return (
//     <TouchableOpacity
//       activeOpacity={0.8}
//       onPress={() => onChange(!checked)}
//       style={[
//         styles.toggleTrack,
//         { backgroundColor: checked ? colors.amber : "rgba(0,0,0,0.15)" },
//       ]}
//     >
//       <View
//         style={[
//           styles.toggleThumb,
//           { transform: [{ translateX: checked ? 18 : 2 }] },
//         ]}
//       />
//     </TouchableOpacity>
//   );
// }

// // ========== Setting Row ==========
// function SettingRow({
//   setting,
//   value,
//   onChange,
//   onReset,
// }: {
//   setting: Setting;
//   value: any;
//   onChange: (value: any) => void;
//   onReset: () => void;
// }) {
//   const isChanged = setting.value !== setting.default;
//   const [openOptions, setOpenOptions] = useState(false);

//   return (
//     <View style={styles.settingRow}>
//       <View style={styles.settingLeft}>
//         <View style={styles.labelRow}>
//           <Text style={styles.settingLabel}>{setting.label}</Text>
//           {isChanged ? (
//             <View style={styles.changedBadge}>
//               <Text style={styles.changedText}>changed</Text>
//             </View>
//           ) : null}
//         </View>
//         {setting.help ? (
//           <Text style={styles.settingHelp}>{setting.help}</Text>
//         ) : null}
//       </View>

//       <View style={styles.settingRight}>
//         {setting.type === "boolean" ? (
//           <Toggle checked={Boolean(value)} onChange={onChange} />
//         ) : setting.options ? (
//           <View style={{ position: "relative" }}>
//             <TouchableOpacity
//               style={styles.selectBtn}
//               onPress={() => setOpenOptions(!openOptions)}
//             >
//               <Text style={styles.selectText} numberOfLines={1}>
//                 {String(value)}
//               </Text>
//             </TouchableOpacity>
//             {openOptions && (
//               <View style={styles.dropdown}>
//                 {setting.options.map((option) => (
//                   <TouchableOpacity
//                     key={option}
//                     style={styles.dropdownItem}
//                     onPress={() => {
//                       onChange(option);
//                       setOpenOptions(false);
//                     }}
//                   >
//                     <Text style={styles.dropdownText}>{option}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         ) : (
//           <TextInput
//             style={styles.input}
//             value={String(value ?? "")}
//             keyboardType={setting.type === "number" ? "numeric" : "default"}
//             onChangeText={(text) =>
//               onChange(setting.type === "number" ? Number(text) : text)
//             }
//           />
//         )}

//         <TouchableOpacity onPress={onReset} style={styles.resetBtn}>
//           <RotateCcw size={14} color="rgba(71,84,103,0.5)" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// // ========== Main Screen ==========
// export default function PlatformSettings() {
//   const [settings, setSettings] = useState<Setting[]>([]);
//   const [dirty, setDirty] = useState<Set<string>>(new Set());
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     api.platform.settings
//       .get()
//       .then(({ data }: any) => setSettings(data || []))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const byKey = (key: string) => settings.find((s) => s.key === key);

//   const change = (key: string, value: any) => {
//     setSettings((prev) =>
//       prev.map((s) => (s.key === key ? { ...s, value } : s))
//     );
//     setDirty((prev) => new Set(prev).add(key));
//   };

//   const reset = (key: string) => {
//     const setting = byKey(key);
//     setSettings((prev) =>
//       prev.map((s) => (s.key === key ? { ...s, value: s.default } : s))
//     );
//     setDirty((prev) => {
//       const next = new Set(prev);
//       if (setting && setting.value === setting.default) {
//         next.delete(key);
//       } else {
//         // after reset, if it matches default remove from dirty
//         next.delete(key);
//       }
//       return next;
//     });
//   };

//   const save = async () => {
//     if (dirty.size === 0) return;
//     setSaving(true);

//     const payload: Record<string, any> = {};
//     for (const key of dirty) {
//       const setting = byKey(key);
//       if (!setting) continue;
//       if (setting.type === "number") {
//         const n = Number(setting.value);
//         if (Number.isFinite(n)) payload[key] = n;
//       } else {
//         payload[key] = setting.value;
//       }
//     }

//     try {
//       const { data } = await api.platform.settings.update(payload);
//       if (data) setSettings(data);
//       setDirty(new Set());
//       Alert.alert(
//         "Saved",
//         `Saved ${Object.keys(payload).length} setting${
//           Object.keys(payload).length > 1 ? "s" : ""
//         }`
//       );
//     } catch (err: any) {
//       Alert.alert("Error", err.message || "Failed to save settings");
//     } finally {
//       setSaving(false);
//     }
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
//         title="Platform Settings"
//         description="Secrets-free configuration for the whole platform. Environment credentials (database URI, JWT secret, provider keys) are intentionally never exposed here."
//         right={
//           <TouchableOpacity
//             style={[
//               styles.saveBtn,
//               (saving || dirty.size === 0) && { opacity: 0.55 },
//             ]}
//             onPress={save}
//             disabled={saving || dirty.size === 0}
//             activeOpacity={0.8}
//           >
//             {saving ? (
//               <ActivityIndicator size="small" color={colors.ink} />
//             ) : (
//               <Save size={15} color={colors.ink} />
//             )}
//             <Text style={styles.saveBtnText}>
//               {saving
//                 ? "Saving…"
//                 : dirty.size
//                 ? `Save ${dirty.size} change${dirty.size > 1 ? "s" : ""}`
//                 : "No changes"}
//             </Text>
//           </TouchableOpacity>
//         }
//       />

//       {loading ? (
//         <Card>
//           <View style={styles.center}>
//             <ActivityIndicator color={colors.amber} />
//             <Text style={styles.muted}>Loading settings…</Text>
//           </View>
//         </Card>
//       ) : (
//         <View style={styles.sections}>
//           {SECTION_ORDER.map((section) => {
//             const items = settings.filter((s) => s.section === section.id);
//             if (items.length === 0) return null;

//             return (
//               <Card key={section.id} style={styles.sectionCard}>
//                 <Text style={styles.sectionTitle}>{section.title}</Text>
//                 <Text style={styles.sectionBlurb}>{section.blurb}</Text>

//                 {items.map((setting) => (
//                   <SettingRow
//                     key={setting.key}
//                     setting={setting}
//                     value={byKey(setting.key)?.value}
//                     onChange={(value) => change(setting.key, value)}
//                     onReset={() => reset(setting.key)}
//                   />
//                 ))}
//               </Card>
//             );
//           })}

//           {/* Lock note */}
//           <Card style={styles.noteCard} bodyStyle={styles.noteBody}>
//             <Lock size={15} color="rgba(71,84,103,0.5)" />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.noteTitle}>
//                 Why can't I change keys, URIs or secrets here?
//               </Text>
//               <Text style={styles.noteText}>
//                 JWT signing keys, MongoDB connection strings and third-party
//                 provider credentials are environment configuration, not runtime
//                 settings. They live in gitignored environment files and fail
//                 closed when absent, so they can never leak through the admin UI,
//                 API responses, or exported reports.
//               </Text>
//             </View>
//           </Card>

//           {/* Info note */}
//           <Card style={styles.noteCard} bodyStyle={styles.noteBody}>
//             <Info size={15} color="rgba(71,84,103,0.5)" />
//             <View style={{ flex: 1 }}>
//               <Text style={styles.noteText}>
//                 Every saved change is written to the immutable audit trail
//                 (settings.changed) with the acting admin's identity, so the
//                 audit log answers exactly who changed what platform-wide.
//               </Text>
//             </View>
//           </Card>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.paper,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   center: {
//     alignItems: "center",
//     paddingVertical: 24,
//   },
//   muted: {
//     fontSize: 13,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 8,
//   },
//   saveBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: colors.amber,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   saveBtnText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   sections: {
//     gap: 16,
//   },
//   sectionCard: {
//     // Card already has padding via bodyStyle default
//   },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: colors.ink,
//     marginBottom: 2,
//   },
//   sectionBlurb: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.6)",
//     marginBottom: 8,
//   },
//   settingRow: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.04)",
//   },
//   settingLeft: {
//     marginBottom: 10,
//   },
//   labelRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     flexWrap: "wrap",
//   },
//   settingLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   changedBadge: {
//     backgroundColor: "rgba(232,163,61,0.15)",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   changedText: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: colors.amberDark,
//     textTransform: "uppercase",
//     letterSpacing: 0.4,
//   },
//   settingHelp: {
//     fontSize: 11.5,
//     color: "rgba(71,84,103,0.6)",
//     marginTop: 3,
//   },
//   settingRight: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   toggleTrack: {
//     width: 40,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: "center",
//   },
//   toggleThumb: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.15,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   selectBtn: {
//     minWidth: 110,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//   },
//   selectText: {
//     fontSize: 13,
//     color: colors.ink,
//   },
//   dropdown: {
//     position: "absolute",
//     top: 40,
//     right: 0,
//     minWidth: 120,
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     zIndex: 50,
//     elevation: 6,
//   },
//   dropdownItem: {
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.04)",
//   },
//   dropdownText: {
//     fontSize: 13,
//     color: colors.ink,
//   },
//   input: {
//     minWidth: 110,
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.1)",
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     fontSize: 13,
//     color: colors.ink,
//   },
//   resetBtn: {
//     padding: 6,
//   },
//   noteCard: {
//     backgroundColor: "rgba(247,245,240,0.7)",
//   },
//   noteBody: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 12,
//     padding: 14,
//   },
//   noteTitle: {
//     fontSize: 12.5,
//     fontWeight: "600",
//     color: colors.slate,
//     marginBottom: 4,
//   },
//   noteText: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.6)",
//     lineHeight: 18,
//   },
// });

// import { DrawerToggle } from "@/components/PlatformSidebar";
// import { PlatformTabBar } from "@/components/PlatformTabBar";
// import { Card, PageIntro, Pill, StatCard } from "@/components/UI";
// import { api } from "@/lib/api";
// import {
//   Activity,
//   AlertTriangle,
//   Building2,
//   CalendarClock,
//   Layers,
//   TrendingUp,
//   Users,
//   Wallet,
// } from "lucide-react-native";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";

// const PIE_COLORS = ["#16213E", "#E8A33D", "#3F8F5F", "#3B6FA0", "#D65A4A"];

// const SUB_LABELS: Record<string, string> = {
//   trialing: "Trialing",
//   active: "Active",
//   past_due: "Past due",
//   suspended: "Suspended",
//   cancelled: "Cancelled",
//   expired: "Expired",
// };

// const colors = {
//   ink: "#16213E",
//   amber: "#E8A33D",
//   amberDark: "#C9832A",
//   success: "#3F8F5F",
//   info: "#3B6FA0",
//   alert: "#D65A4A",
//   paper: "#F7F5F0",
//   slate: "#475467",
//   border: "rgba(0,0,0,0.07)",
//   white: "#FFFFFF",
// };

// const inr = (value: any) =>
//   `₹${Number(value || 0).toLocaleString("en-IN", {
//     maximumFractionDigits: 0,
//   })}`;

// const fmtDate = (value?: string) =>
//   value
//     ? new Date(value).toLocaleDateString("en-IN", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// const timeAgo = (value?: string) => {
//   if (!value) return "—";
//   const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
//   if (seconds < 60) return "just now";
//   const minutes = Math.floor(seconds / 60);
//   if (minutes < 60) return `${minutes}m ago`;
//   const hours = Math.floor(minutes / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   return `${days}d ago`;
// };

// export default function PlatformDashboard() {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     api.analytics
//       .summary()
//       .then(({ data: raw }) => setData(raw))
//       .catch((err: any) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.screen}>
//         <View style={styles.toggleRow}>
//           <DrawerToggle />
//         </View>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color={colors.amber} />
//           <Text style={styles.loadingText}>Loading platform overview…</Text>
//         </View>
//         <PlatformTabBar />
//       </View>
//     );
//   }

//   if (error || !data) {
//     return (
//       <View style={styles.screen}>
//         <View style={styles.toggleRow}>
//           <DrawerToggle />
//         </View>
//         <View style={styles.loadingContainer}>
//           <AlertTriangle size={28} color={colors.alert} />
//           <Text style={styles.errorTitle}>Unable to load analytics</Text>
//           <Text style={styles.errorText}>{error || "No data available"}</Text>
//         </View>
//         <PlatformTabBar />
//       </View>
//     );
//   }

//   const ov = data.overview || {};
//   const schools = ov.schools || {};
//   const subs = ov.subscriptions || {};
//   const exp = data.expiringSubscriptions || {
//     in7: 0,
//     in15: 0,
//     in30: 0,
//     items: [],
//   };
//   const planBars = (data.planDistribution || [])
//     .filter((p: any) => p.count > 0)
//     .map((p: any) => ({
//       name: String(p.plan).toUpperCase(),
//       count: p.count,
//     }));
//   const funnel = (data.onboarding?.funnel || []).map((f: any) => ({
//     step: f.step.charAt(0).toUpperCase() + f.step.slice(1),
//     count: f.count,
//   }));
//   const revenue = data.revenue || {};
//   const invoiceCounts = revenue.invoices || {};
//   const alerts = data.alerts || [];
//   const activity = data.recentActivity || [];

//   return (
//     <View style={styles.screen}>
//       {/* Top bar with drawer toggle */}
//       <View style={styles.toggleRow}>
//         <DrawerToggle />
//       </View>

//       <ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <PageIntro
//           eyebrow="Platform Owner"
//           title="Platform Dashboard"
//           description="Live snapshot across the entire multi-tenant network — growth, subscriptions, revenue, onboarding and operator attention items."
//         />

//         {/* Alerts */}
//         {alerts.length > 0 && (
//           <View style={styles.alertsWrap}>
//             {alerts.map((alert: any, index: number) => (
//               <View
//                 key={`${alert.type}-${index}`}
//                 style={[
//                   styles.alertBox,
//                   alert.severity === "warning"
//                     ? styles.alertWarning
//                     : styles.alertInfo,
//                 ]}
//               >
//                 <AlertTriangle
//                   size={16}
//                   color={
//                     alert.severity === "warning" ? colors.alert : colors.info
//                   }
//                 />
//                 <Text
//                   style={[
//                     styles.alertText,
//                     {
//                       color:
//                         alert.severity === "warning"
//                           ? colors.alert
//                           : colors.info,
//                     },
//                   ]}
//                 >
//                   {alert.message}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         )}

//         {/* Stat Cards */}
//         <View style={styles.statsGrid}>
//           <View style={styles.statHalf}>
//             <StatCard
//               icon={Building2}
//               label="Schools"
//               value={schools.total ?? data.schools ?? 0}
//               sub={`${schools.active ?? data.activeSchools ?? 0} active`}
//               accent="amber"
//             />
//           </View>
//           <View style={styles.statHalf}>
//             <StatCard
//               icon={Users}
//               label="Users"
//               value={(ov.users?.total ?? data.users ?? 0).toLocaleString(
//                 "en-IN",
//               )}
//               sub="excl. platform owner"
//               accent="info"
//             />
//           </View>
//           <View style={styles.statHalf}>
//             <StatCard
//               icon={Layers}
//               label="Subscriptions"
//               value={subs.current ?? data.subscriptions?.current ?? 0}
//               sub={`trial ${subs.byStatus?.trialing ?? 0} · past due ${
//                 subs.byStatus?.past_due ?? 0
//               }`}
//               accent="success"
//             />
//           </View>
//           <View style={styles.statHalf}>
//             <StatCard
//               icon={TrendingUp}
//               label="MRR"
//               value={inr(ov.mrr ?? data.mrr ?? 0)}
//               sub={`ARPU ${inr(ov.arpu ?? data.arpu ?? 0)}`}
//               accent="info"
//             />
//           </View>
//           <View style={styles.statFull}>
//             <StatCard
//               icon={Wallet}
//               label="Revenue"
//               value={inr(revenue.collected ?? data.revenue?.collected)}
//               sub={`${inr(
//                 revenue.outstanding ?? data.revenue?.outstanding,
//               )} outstanding`}
//               accent={
//                 Number(revenue.outstanding || 0) > 0 ? "alert" : "success"
//               }
//             />
//           </View>
//         </View>

//         {/* Plan Distribution */}
//         <Card title="Plan distribution" style={styles.section}>
//           {planBars.length ? (
//             <View style={styles.bars}>
//               {planBars.map((plan: any, index: number) => {
//                 const max = Math.max(...planBars.map((p: any) => p.count), 1);
//                 const width = Math.round((plan.count / max) * 100);
//                 return (
//                   <View key={plan.name} style={styles.barRow}>
//                     <View style={styles.barHeader}>
//                       <Text style={styles.barLabel}>{plan.name}</Text>
//                       <Text style={styles.barValue}>{plan.count}</Text>
//                     </View>
//                     <View style={styles.barTrack}>
//                       <View
//                         style={[
//                           styles.barFill,
//                           {
//                             width: `${width}%`,
//                             backgroundColor:
//                               PIE_COLORS[index % PIE_COLORS.length],
//                           },
//                         ]}
//                       />
//                     </View>
//                   </View>
//                 );
//               })}
//             </View>
//           ) : (
//             <Text style={styles.emptyText}>No plans assigned yet.</Text>
//           )}
//         </Card>

//         {/* Onboarding Funnel */}
//         <Card title="Onboarding funnel" style={styles.section}>
//           <View style={styles.bars}>
//             {funnel.map((step: any, index: number) => {
//               const max = Math.max(1, ...funnel.map((f: any) => f.count));
//               const width = Math.round((step.count / max) * 100);
//               return (
//                 <View key={step.step} style={styles.barRow}>
//                   <View style={styles.barHeader}>
//                     <Text style={styles.barLabel}>{step.step}</Text>
//                     <Text style={styles.barValue}>{step.count}</Text>
//                   </View>
//                   <View style={styles.barTrack}>
//                     <View
//                       style={[
//                         styles.barFill,
//                         {
//                           width: `${width}%`,
//                           backgroundColor:
//                             PIE_COLORS[index % PIE_COLORS.length],
//                         },
//                       ]}
//                     />
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         </Card>

//         {/* Revenue */}
//         <Card title="Revenue" style={styles.section}>
//           <View style={styles.revenueRow}>
//             <View style={[styles.revenueBox, styles.revenueSuccess]}>
//               <Text style={styles.revenueLabel}>Collected</Text>
//               <Text style={[styles.revenueValue, { color: colors.success }]}>
//                 {inr(revenue.collected)}
//               </Text>
//             </View>
//             <View style={[styles.revenueBox, styles.revenueAlert]}>
//               <Text style={styles.revenueLabel}>Outstanding</Text>
//               <Text style={[styles.revenueValue, { color: colors.alert }]}>
//                 {inr(revenue.outstanding)}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.pillRow}>
//             <Pill tone="success">{invoiceCounts.paid || 0} paid</Pill>
//             <Pill tone="amber">{invoiceCounts.issued || 0} issued</Pill>
//             <Pill tone="alert">{invoiceCounts.overdue || 0} overdue</Pill>
//             <Pill>{invoiceCounts.draft || 0} draft</Pill>
//           </View>
//         </Card>

//         {/* Expiring Subscriptions */}
//         <Card
//           title="Expiring subscriptions"
//           action={
//             <View style={styles.pillRowCompact}>
//               <Pill tone={exp.in7 > 0 ? "alert" : "success"}>
//                 {exp.in7 || 0} in 7d
//               </Pill>
//               <Pill tone={exp.in15 > 0 ? "amber" : "neutral"}>
//                 {exp.in15} in 15d
//               </Pill>
//             </View>
//           }
//           style={styles.section}
//           bodyStyle={{ padding: 0 }}
//         >
//           {exp.items?.length ? (
//             <View>
//               {exp.items.map((item: any) => (
//                 <View key={item._id} style={styles.listItem}>
//                   <View style={styles.listIcon}>
//                     <CalendarClock size={15} color={colors.amberDark} />
//                   </View>
//                   <View style={{ flex: 1, minWidth: 0 }}>
//                     <Text style={styles.listTitle} numberOfLines={1}>
//                       {item.school?.name || "Unknown school"}
//                     </Text>
//                     <Text style={styles.listSub}>
//                       {item.plan?.name || "—"} ·{" "}
//                       {SUB_LABELS[item.status] || item.status}
//                     </Text>
//                   </View>
//                   <Text style={styles.listMeta}>
//                     {item.reference ? fmtDate(item.reference) : "—"}
//                   </Text>
//                 </View>
//               ))}
//             </View>
//           ) : (
//             <Text style={[styles.emptyText, { padding: 18 }]}>
//               No expiring subscriptions in the next 30 days.
//             </Text>
//           )}
//         </Card>

//         {/* Recent Activity */}
//         <Card title="Recent platform activity" bodyStyle={{ padding: 0 }}>
//           {activity.length ? (
//             <View>
//               {activity.map((entry: any) => (
//                 <View key={entry._id} style={styles.listItem}>
//                   <View style={styles.activityIcon}>
//                     <Activity size={14} color={colors.amber} />
//                   </View>
//                   <View style={{ flex: 1 }}>
//                     <Text style={styles.listTitle}>
//                       <Text style={{ fontWeight: "700" }}>
//                         {entry.actorEmail || "system"}
//                       </Text>{" "}
//                       <Text style={{ color: "rgba(71,84,103,0.75)" }}>
//                         {entry.message || entry.action}
//                       </Text>
//                     </Text>
//                     <Text style={styles.listSub}>
//                       {entry.action} · {entry.actorRole || "—"} ·{" "}
//                       {timeAgo(entry.createdAt)}
//                     </Text>
//                   </View>
//                 </View>
//               ))}
//             </View>
//           ) : (
//             <Text style={[styles.emptyText, { padding: 18 }]}>
//               No platform activity recorded yet.
//             </Text>
//           )}
//         </Card>
//       </ScrollView>

//       {/* Bottom Tabs - kept fixed */}
//       <PlatformTabBar />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: colors.paper,
//   },
//   toggleRow: {
//     backgroundColor: colors.ink,
//     paddingHorizontal: 14,
//     paddingVertical: 11,
//     alignItems: "flex-start",
//   },
//   scroll: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 28,
//   },
//   loadingContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 12,
//     padding: 24,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: "rgba(71,84,103,0.7)",
//   },
//   errorTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: colors.ink,
//     marginTop: 8,
//   },
//   errorText: {
//     fontSize: 13.5,
//     color: colors.alert,
//     textAlign: "center",
//   },

//   // Alerts
//   alertsWrap: {
//     marginBottom: 18,
//     gap: 8,
//   },
//   alertBox: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//   },
//   alertWarning: {
//     backgroundColor: "rgba(214,90,74,0.06)",
//     borderColor: "rgba(214,90,74,0.22)",
//   },
//   alertInfo: {
//     backgroundColor: "rgba(59,111,160,0.06)",
//     borderColor: "rgba(59,111,160,0.22)",
//   },
//   alertText: {
//     flex: 1,
//     fontSize: 13.5,
//     lineHeight: 19,
//   },

//   // Stats
//   statsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 12,
//     marginBottom: 20,
//   },
//   statHalf: {
//     width: "48%",
//   },
//   statFull: {
//     width: "100%",
//   },

//   section: {
//     marginBottom: 18,
//   },

//   // Bars
//   bars: {
//     gap: 14,
//   },
//   barRow: {
//     gap: 5,
//   },
//   barHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   barLabel: {
//     fontSize: 13,
//     color: colors.slate,
//     fontWeight: "500",
//   },
//   barValue: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: colors.ink,
//   },
//   barTrack: {
//     height: 9,
//     borderRadius: 999,
//     backgroundColor: "rgba(0,0,0,0.06)",
//     overflow: "hidden",
//   },
//   barFill: {
//     height: "100%",
//     borderRadius: 999,
//   },

//   emptyText: {
//     fontSize: 13.5,
//     color: "rgba(71,84,103,0.65)",
//   },

//   // Revenue
//   revenueRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 16,
//   },
//   revenueBox: {
//     flex: 1,
//     borderRadius: 14,
//     padding: 14,
//     borderWidth: 1,
//   },
//   revenueSuccess: {
//     backgroundColor: "rgba(63,143,95,0.06)",
//     borderColor: "rgba(63,143,95,0.18)",
//   },
//   revenueAlert: {
//     backgroundColor: "rgba(214,90,74,0.06)",
//     borderColor: "rgba(214,90,74,0.18)",
//   },
//   revenueLabel: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.7)",
//     fontWeight: "500",
//   },
//   revenueValue: {
//     fontSize: 19,
//     fontWeight: "700",
//     marginTop: 4,
//   },
//   pillRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   pillRowCompact: {
//     flexDirection: "row",
//     gap: 6,
//   },

//   // Lists
//   listItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 13,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.05)",
//   },
//   listIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 10,
//     backgroundColor: "rgba(232,163,61,0.14)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   activityIcon: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: colors.ink,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   listTitle: {
//     fontSize: 13.5,
//     fontWeight: "600",
//     color: colors.ink,
//   },
//   listSub: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 2,
//   },
//   listMeta: {
//     fontSize: 12.5,
//     color: "rgba(71,84,103,0.65)",
//     fontWeight: "500",
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
  Alert,
} from "react-native";
import { Info, Lock, RotateCcw, Save } from "lucide-react-native";
import { DrawerToggle } from "@/components/PlatformSidebar";
import { api } from "@/lib/api";
import { Card, PageIntro } from "@/components/UI";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  paper: "#F7F5F0",
  slate: "#475467",
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
  const [settings, setSettings] = useState<Setting[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.platform.settings
      .get()
      .then(({ data }: any) => setSettings(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const byKey = (key: string) => settings.find((s) => s.key === key);

  const change = (key: string, value: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
    setDirty((prev) => new Set(prev).add(key));
  };

  const reset = (key: string) => {
    const setting = byKey(key);
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: s.default } : s))
    );
    setDirty((prev) => {
      const next = new Set(prev);
      if (setting && setting.value === setting.default) {
        next.delete(key);
      } else {
        // after reset, if it matches default remove from dirty
        next.delete(key);
      }
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
        }`
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
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
                  provider credentials are environment configuration, not runtime
                  settings. They live in gitignored environment files and fail
                  closed when absent, so they can never leak through the admin UI,
                  API responses, or exported reports.
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  toggleRow: {
    backgroundColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
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
  sectionCard: {
    // Card already has padding via bodyStyle default
  },
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