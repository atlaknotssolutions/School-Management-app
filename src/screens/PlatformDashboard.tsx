// // import { DrawerToggle } from "@/components/PlatformSidebar";
// // import { PlatformTabBar } from "@/components/PlatformTabBar";
// // import { Card, PageIntro, Pill, StatCard } from "@/components/UI";
// // import { api } from "@/lib/api";
// // import {
// //   Activity,
// //   AlertTriangle,
// //   Building2,
// //   CalendarClock,
// //   Layers,
// //   TrendingUp,
// //   Users,
// //   Wallet,
// // } from "lucide-react-native";
// // import { useEffect, useState } from "react";
// // import {
// //   ActivityIndicator,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   View,
// // } from "react-native";

// // const PIE_COLORS = ["#16213E", "#E8A33D", "#3F8F5F", "#3B6FA0", "#D65A4A"];

// // const SUB_LABELS: Record<string, string> = {
// //   trialing: "Trialing",
// //   active: "Active",
// //   past_due: "Past due",
// //   suspended: "Suspended",
// //   cancelled: "Cancelled",
// //   expired: "Expired",
// // };

// // const colors = {
// //   ink: "#16213E",
// //   amber: "#E8A33D",
// //   amberDark: "#C9832A",
// //   success: "#3F8F5F",
// //   info: "#3B6FA0",
// //   alert: "#D65A4A",
// //   paper: "#F7F5F0",
// //   slate: "#475467",
// // };

// // const inr = (value: any) =>
// //   `₹${Number(value || 0).toLocaleString("en-IN", {
// //     maximumFractionDigits: 2,
// //   })}`;

// // const fmtDate = (value?: string) =>
// //   value
// //     ? new Date(value).toLocaleDateString("en-IN", {
// //         day: "numeric",
// //         month: "short",
// //         year: "numeric",
// //       })
// //     : "—";

// // const timeAgo = (value?: string) => {
// //   if (!value) return "—";
// //   const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
// //   if (seconds < 60) return "just now";
// //   const minutes = Math.floor(seconds / 60);
// //   if (minutes < 60) return `${minutes}m ago`;
// //   const hours = Math.floor(minutes / 60);
// //   if (hours < 24) return `${hours}h ago`;
// //   const days = Math.floor(hours / 24);
// //   return `${days}d ago`;
// // };

// // export default function PlatformDashboard() {
// //   const [data, setData] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     api.analytics
// //       .summary()
// //       .then(({ data: raw }) => setData(raw))
// //       .catch((err: any) => setError(err.message))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   if (loading) {
// //     return (
// //       <View style={styles.screen}>
// //         <View style={styles.toggleRow}>
// //           <DrawerToggle />
// //         </View>
// //         <View style={styles.container}>
// //           <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
// //           <Card>
// //             <View style={styles.center}>
// //               <ActivityIndicator size="large" color={colors.amber} />
// //               <Text style={styles.loadingText}>Loading platform overview…</Text>
// //             </View>
// //           </Card>
// //         </View>
// //         <PlatformTabBar />
// //       </View>
// //     );
// //   }

// //   if (error || !data) {
// //     return (
// //       <View style={styles.screen}>
// //         <View style={styles.toggleRow}>
// //           <DrawerToggle />
// //         </View>
// //         <View style={styles.container}>
// //           <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
// //           <Card>
// //             <Text style={styles.errorText}>
// //               Unable to load platform analytics: {error || "no data"}
// //             </Text>
// //           </Card>
// //         </View>
// //         <PlatformTabBar />
// //       </View>
// //     );
// //   }

// //   const ov = data.overview || {};
// //   const schools = ov.schools || {};
// //   const subs = ov.subscriptions || {};
// //   const exp = data.expiringSubscriptions || {
// //     in7: 0,
// //     in15: 0,
// //     in30: 0,
// //     items: [],
// //   };
// //   const planBars = (data.planDistribution || [])
// //     .filter((p: any) => p.count > 0)
// //     .map((p: any) => ({
// //       name: String(p.plan).toUpperCase(),
// //       count: p.count,
// //     }));
// //   const funnel = (data.onboarding?.funnel || []).map((f: any) => ({
// //     step: f.step.charAt(0).toUpperCase() + f.step.slice(1),
// //     count: f.count,
// //   }));
// //   const revenue = data.revenue || {};
// //   const invoiceCounts = revenue.invoices || {};
// //   const alerts = data.alerts || [];
// //   const activity = data.recentActivity || [];

// //   return (
// //     <View style={styles.screen}>
// //       <View style={styles.toggleRow}>
// //         <DrawerToggle />
// //       </View>
// //       <ScrollView
// //         style={styles.scroll}
// //         contentContainerStyle={styles.content}
// //         showsVerticalScrollIndicator={false}
// //       >
// //         <PageIntro
// //           eyebrow="Platform Owner"
// //           title="Platform Dashboard"
// //           description="Live snapshot across the entire multi-tenant network: growth, subscriptions, revenue, onboarding and operator attention items."
// //         />

// //         {/* Alerts */}
// //         {alerts.length > 0 && (
// //           <View style={styles.alertsWrap}>
// //             {alerts.map((alert: any, index: number) => (
// //               <View
// //                 key={`${alert.type}-${index}`}
// //                 style={[
// //                   styles.alertBox,
// //                   alert.severity === "warning"
// //                     ? styles.alertWarning
// //                     : styles.alertInfo,
// //                 ]}
// //               >
// //                 <AlertTriangle
// //                   size={15}
// //                   color={
// //                     alert.severity === "warning" ? colors.alert : colors.info
// //                   }
// //                 />
// //                 <Text
// //                   style={[
// //                     styles.alertText,
// //                     {
// //                       color:
// //                         alert.severity === "warning"
// //                           ? colors.alert
// //                           : colors.info,
// //                     },
// //                   ]}
// //                 >
// //                   {alert.message}
// //                 </Text>
// //               </View>
// //             ))}
// //           </View>
// //         )}

// //         {/* Stat Cards */}
// //         <View style={styles.statsGrid}>
// //           <View style={styles.statHalf}>
// //             <StatCard
// //               icon={Building2}
// //               label="Schools"
// //               value={schools.total ?? data.schools ?? 0}
// //               sub={`${schools.active ?? data.activeSchools ?? 0} active`}
// //               accent="amber"
// //             />
// //           </View>
// //           <View style={styles.statHalf}>
// //             <StatCard
// //               icon={Users}
// //               label="Users"
// //               value={(ov.users?.total ?? data.users ?? 0).toLocaleString(
// //                 "en-IN",
// //               )}
// //               sub="excl. platform owner"
// //               accent="info"
// //             />
// //           </View>
// //           <View style={styles.statHalf}>
// //             <StatCard
// //               icon={Layers}
// //               label="Subscriptions"
// //               value={subs.current ?? data.subscriptions?.current ?? 0}
// //               sub={`trial ${subs.byStatus?.trialing ?? 0} · past due ${
// //                 subs.byStatus?.past_due ?? 0
// //               }`}
// //               accent="success"
// //             />
// //           </View>
// //           <View style={styles.statHalf}>
// //             <StatCard
// //               icon={TrendingUp}
// //               label="MRR"
// //               value={inr(ov.mrr ?? data.mrr ?? 0)}
// //               sub={`ARPU ${inr(ov.arpu ?? data.arpu ?? 0)}`}
// //               accent="info"
// //             />
// //           </View>
// //           <View style={styles.statFull}>
// //             <StatCard
// //               icon={Wallet}
// //               label="Revenue"
// //               value={inr(revenue.collected ?? data.revenue?.collected)}
// //               sub={`${inr(
// //                 revenue.outstanding ?? data.revenue?.outstanding,
// //               )} outstanding`}
// //               accent={
// //                 Number(revenue.outstanding || 0) > 0 ? "alert" : "success"
// //               }
// //             />
// //           </View>
// //         </View>

// //         {/* Plan Distribution */}
// //         <Card title="Plan distribution" style={styles.mb5}>
// //           {planBars.length ? (
// //             <View style={styles.gap3}>
// //               {planBars.map((plan: any, index: number) => {
// //                 const max = Math.max(...planBars.map((p: any) => p.count), 1);
// //                 const width = Math.round((plan.count / max) * 100);
// //                 return (
// //                   <View key={plan.name}>
// //                     <View style={styles.barHeader}>
// //                       <Text style={styles.barLabel}>{plan.name}</Text>
// //                       <Text style={styles.barValue}>{plan.count}</Text>
// //                     </View>
// //                     <View style={styles.barTrack}>
// //                       <View
// //                         style={[
// //                           styles.barFill,
// //                           {
// //                             width: `${width}%`,
// //                             backgroundColor:
// //                               PIE_COLORS[index % PIE_COLORS.length],
// //                           },
// //                         ]}
// //                       />
// //                     </View>
// //                   </View>
// //                 );
// //               })}
// //             </View>
// //           ) : (
// //             <Text style={styles.emptyText}>No plans assigned yet.</Text>
// //           )}
// //         </Card>

// //         {/* Onboarding Funnel */}
// //         <Card title="Onboarding funnel" style={styles.mb5}>
// //           <View style={styles.gap3}>
// //             {funnel.map((step: any, index: number) => {
// //               const max = Math.max(1, ...funnel.map((f: any) => f.count));
// //               const width = Math.round((step.count / max) * 100);
// //               return (
// //                 <View key={step.step}>
// //                   <View style={styles.barHeader}>
// //                     <Text style={styles.barLabel}>{step.step}</Text>
// //                     <Text style={styles.barValue}>{step.count}</Text>
// //                   </View>
// //                   <View style={styles.barTrack}>
// //                     <View
// //                       style={[
// //                         styles.barFill,
// //                         {
// //                           width: `${width}%`,
// //                           backgroundColor:
// //                             PIE_COLORS[index % PIE_COLORS.length],
// //                         },
// //                       ]}
// //                     />
// //                   </View>
// //                 </View>
// //               );
// //             })}
// //           </View>
// //         </Card>

// //         {/* Revenue */}
// //         <Card title="Revenue" style={styles.mb5}>
// //           <View style={styles.revenueRow}>
// //             <View style={[styles.revenueBox, styles.revenueSuccess]}>
// //               <Text style={styles.revenueLabel}>Collected</Text>
// //               <Text style={[styles.revenueValue, { color: colors.success }]}>
// //                 {inr(revenue.collected)}
// //               </Text>
// //             </View>
// //             <View style={[styles.revenueBox, styles.revenueAlert]}>
// //               <Text style={styles.revenueLabel}>Outstanding</Text>
// //               <Text style={[styles.revenueValue, { color: colors.alert }]}>
// //                 {inr(revenue.outstanding)}
// //               </Text>
// //             </View>
// //           </View>

// //           <View style={styles.pillRow}>
// //             <Pill tone="success">{invoiceCounts.paid || 0} paid</Pill>
// //             <Pill tone="amber">{invoiceCounts.issued || 0} issued</Pill>
// //             <Pill tone="alert">{invoiceCounts.overdue || 0} overdue</Pill>
// //             <Pill>{invoiceCounts.draft || 0} draft</Pill>
// //           </View>
// //         </Card>

// //         {/* Expiring Subscriptions */}
// //         <Card
// //           title="Expiring subscriptions"
// //           action={
// //             <View style={styles.pillRow}>
// //               <Pill tone={exp.in7 > 0 ? "alert" : "success"}>
// //                 {exp.in7 || 0} in 7d
// //               </Pill>
// //               <Pill tone={exp.in15 > 0 ? "amber" : "neutral"}>
// //                 {exp.in15} in 15d
// //               </Pill>
// //             </View>
// //           }
// //           style={styles.mb5}
// //           bodyStyle={{ padding: 0 }}
// //         >
// //           {exp.items?.length ? (
// //             <View>
// //               {exp.items.map((item: any) => (
// //                 <View key={item._id} style={styles.listItem}>
// //                   <View style={styles.listIcon}>
// //                     <CalendarClock size={15} color={colors.amberDark} />
// //                   </View>
// //                   <View style={{ flex: 1 }}>
// //                     <Text style={styles.listTitle} numberOfLines={1}>
// //                       {item.school?.name || "Unknown school"}
// //                     </Text>
// //                     <Text style={styles.listSub}>
// //                       {item.plan?.name || "—"} ·{" "}
// //                       {SUB_LABELS[item.status] || item.status}
// //                     </Text>
// //                   </View>
// //                   <Text style={styles.listMeta}>
// //                     {item.reference ? fmtDate(item.reference) : "—"}
// //                   </Text>
// //                 </View>
// //               ))}
// //             </View>
// //           ) : (
// //             <Text style={[styles.emptyText, { padding: 16 }]}>
// //               No expiring subscriptions.
// //             </Text>
// //           )}
// //         </Card>

// //         {/* Recent Activity */}
// //         <Card title="Recent platform activity" bodyStyle={{ padding: 0 }}>
// //           {activity.length ? (
// //             <View>
// //               {activity.map((entry: any) => (
// //                 <View key={entry._id} style={styles.listItem}>
// //                   <View style={styles.activityIcon}>
// //                     <Activity size={14} color={colors.amber} />
// //                   </View>
// //                   <View style={{ flex: 1 }}>
// //                     <Text style={styles.listTitle}>
// //                       <Text style={{ fontWeight: "700" }}>
// //                         {entry.actorEmail || "system"}
// //                       </Text>{" "}
// //                       <Text style={{ color: "rgba(71,84,103,0.7)" }}>
// //                         {entry.message || entry.action}
// //                       </Text>
// //                     </Text>
// //                     <Text style={styles.listSub}>
// //                       {entry.action} · {entry.actorRole || "—"} ·{" "}
// //                       {timeAgo(entry.createdAt)}
// //                     </Text>
// //                   </View>
// //                 </View>
// //               ))}
// //             </View>
// //           ) : (
// //             <Text style={[styles.emptyText, { padding: 16 }]}>
// //               No platform activity recorded yet.
// //             </Text>
// //           )}
// //         </Card>
// //       </ScrollView>
// //       <PlatformTabBar />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   screen: {
// //     flex: 1,
// //     backgroundColor: "#F7F5F0",
// //   },
// //   toggleRow: {
// //     backgroundColor: colors.ink,
// //     paddingHorizontal: 12,
// //     paddingVertical: 10,
// //     alignItems: "flex-start",
// //   },
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //     backgroundColor: "#F7F5F0",
// //   },
// //   scroll: {
// //     flex: 1,
// //     backgroundColor: "#F7F5F0",
// //   },
// //   content: {
// //     padding: 16,
// //     paddingBottom: 40,
// //   },
// //   center: {
// //     alignItems: "center",
// //     paddingVertical: 32,
// //   },
// //   loadingText: {
// //     fontSize: 13,
// //     color: "rgba(71,84,103,0.7)",
// //     marginTop: 12,
// //   },
// //   errorText: {
// //     fontSize: 13,
// //     color: "#D65A4A",
// //   },
// //   alertsWrap: {
// //     marginBottom: 20,
// //     gap: 8,
// //   },
// //   alertBox: {
// //     flexDirection: "row",
// //     alignItems: "flex-start",
// //     gap: 10,
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //   },
// //   alertWarning: {
// //     backgroundColor: "rgba(214,90,74,0.05)",
// //     borderColor: "rgba(214,90,74,0.2)",
// //   },
// //   alertInfo: {
// //     backgroundColor: "rgba(59,111,160,0.05)",
// //     borderColor: "rgba(59,111,160,0.2)",
// //   },
// //   alertText: {
// //     flex: 1,
// //     fontSize: 13,
// //   },
// //   statsGrid: {
// //     flexDirection: "row",
// //     flexWrap: "wrap",
// //     gap: 12,
// //     marginBottom: 20,
// //   },
// //   statHalf: {
// //     width: "48%",
// //   },
// //   statFull: {
// //     width: "100%",
// //   },
// //   mb5: {
// //     marginBottom: 20,
// //   },
// //   gap3: {
// //     gap: 12,
// //   },
// //   barHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 4,
// //   },
// //   barLabel: {
// //     fontSize: 12.5,
// //     color: "#475467",
// //   },
// //   barValue: {
// //     fontSize: 12.5,
// //     fontWeight: "600",
// //     color: "#16213E",
// //   },
// //   barTrack: {
// //     height: 8,
// //     borderRadius: 999,
// //     backgroundColor: "#F7F5F0",
// //     overflow: "hidden",
// //   },
// //   barFill: {
// //     height: "100%",
// //     borderRadius: 999,
// //   },
// //   emptyText: {
// //     fontSize: 13,
// //     color: "rgba(71,84,103,0.7)",
// //   },
// //   revenueRow: {
// //     flexDirection: "row",
// //     gap: 12,
// //     marginBottom: 16,
// //   },
// //   revenueBox: {
// //     flex: 1,
// //     borderRadius: 12,
// //     padding: 14,
// //     borderWidth: 1,
// //   },
// //   revenueSuccess: {
// //     backgroundColor: "rgba(63,143,95,0.05)",
// //     borderColor: "rgba(63,143,95,0.15)",
// //   },
// //   revenueAlert: {
// //     backgroundColor: "rgba(214,90,74,0.05)",
// //     borderColor: "rgba(214,90,74,0.15)",
// //   },
// //   revenueLabel: {
// //     fontSize: 11.5,
// //     color: "rgba(71,84,103,0.7)",
// //     fontWeight: "500",
// //   },
// //   revenueValue: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     marginTop: 4,
// //   },
// //   pillRow: {
// //     flexDirection: "row",
// //     flexWrap: "wrap",
// //     gap: 8,
// //   },
// //   listItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "rgba(0,0,0,0.05)",
// //   },
// //   listIcon: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 8,
// //     backgroundColor: "rgba(232,163,61,0.15)",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   activityIcon: {
// //     width: 32,
// //     height: 32,
// //     borderRadius: 16,
// //     backgroundColor: "#16213E",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   listTitle: {
// //     fontSize: 13,
// //     fontWeight: "600",
// //     color: "#16213E",
// //   },
// //   listSub: {
// //     fontSize: 11.5,
// //     color: "rgba(71,84,103,0.7)",
// //     marginTop: 2,
// //   },
// //   listMeta: {
// //     fontSize: 12,
// //     color: "rgba(71,84,103,0.7)",
// //   },
// // });
// import { DrawerToggle } from "@/components/PlatformSidebar";
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
// };

// const inr = (value: any) =>
//   `₹${Number(value || 0).toLocaleString("en-IN", {
//     maximumFractionDigits: 2,
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
//       <View style={styles.container}>
//         <View style={styles.toggleRow}>
//           <DrawerToggle />
//         </View>
//         <View style={styles.contentPad}>
//           <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
//           <Card>
//             <View style={styles.center}>
//               <ActivityIndicator size="large" color={colors.amber} />
//               <Text style={styles.loadingText}>Loading platform overview…</Text>
//             </View>
//           </Card>
//         </View>
//       </View>
//     );
//   }

//   if (error || !data) {
//     return (
//       <View style={styles.container}>
//         <View style={styles.toggleRow}>
//           <DrawerToggle />
//         </View>
//         <View style={styles.contentPad}>
//           <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
//           <Card>
//             <Text style={styles.errorText}>
//               Unable to load platform analytics: {error || "no data"}
//             </Text>
//           </Card>
//         </View>
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
//     <View style={styles.container}>
//       <View style={styles.toggleRow}>
//         <DrawerToggle />
//       </View>

//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <PageIntro
//           eyebrow="Platform Owner"
//           title="Platform Dashboard"
//           description="Live snapshot across the entire multi-tenant network: growth, subscriptions, revenue, onboarding and operator attention items."
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
//                   size={15}
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
//         <Card title="Plan distribution" style={styles.mb5}>
//           {planBars.length ? (
//             <View style={styles.gap3}>
//               {planBars.map((plan: any, index: number) => {
//                 const max = Math.max(...planBars.map((p: any) => p.count), 1);
//                 const width = Math.round((plan.count / max) * 100);
//                 return (
//                   <View key={plan.name}>
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
//         <Card title="Onboarding funnel" style={styles.mb5}>
//           <View style={styles.gap3}>
//             {funnel.map((step: any, index: number) => {
//               const max = Math.max(1, ...funnel.map((f: any) => f.count));
//               const width = Math.round((step.count / max) * 100);
//               return (
//                 <View key={step.step}>
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
//         <Card title="Revenue" style={styles.mb5}>
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
//             <View style={styles.pillRow}>
//               <Pill tone={exp.in7 > 0 ? "alert" : "success"}>
//                 {exp.in7 || 0} in 7d
//               </Pill>
//               <Pill tone={exp.in15 > 0 ? "amber" : "neutral"}>
//                 {exp.in15} in 15d
//               </Pill>
//             </View>
//           }
//           style={styles.mb5}
//           bodyStyle={{ padding: 0 }}
//         >
//           {exp.items?.length ? (
//             <View>
//               {exp.items.map((item: any) => (
//                 <View key={item._id} style={styles.listItem}>
//                   <View style={styles.listIcon}>
//                     <CalendarClock size={15} color={colors.amberDark} />
//                   </View>
//                   <View style={{ flex: 1 }}>
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
//             <Text style={[styles.emptyText, { padding: 16 }]}>
//               No expiring subscriptions.
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
//                       <Text style={{ color: "rgba(71,84,103,0.7)" }}>
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
//             <Text style={[styles.emptyText, { padding: 16 }]}>
//               No platform activity recorded yet.
//             </Text>
//           )}
//         </Card>
//       </ScrollView>
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
//   contentPad: {
//     padding: 16,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   center: {
//     alignItems: "center",
//     paddingVertical: 32,
//   },
//   loadingText: {
//     fontSize: 13,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 12,
//   },
//   errorText: {
//     fontSize: 13,
//     color: "#D65A4A",
//   },
//   alertsWrap: {
//     marginBottom: 20,
//     gap: 8,
//   },
//   alertBox: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 10,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//   },
//   alertWarning: {
//     backgroundColor: "rgba(214,90,74,0.05)",
//     borderColor: "rgba(214,90,74,0.2)",
//   },
//   alertInfo: {
//     backgroundColor: "rgba(59,111,160,0.05)",
//     borderColor: "rgba(59,111,160,0.2)",
//   },
//   alertText: {
//     flex: 1,
//     fontSize: 13,
//   },
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
//   mb5: {
//     marginBottom: 20,
//   },
//   gap3: {
//     gap: 12,
//   },
//   barHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 4,
//   },
//   barLabel: {
//     fontSize: 12.5,
//     color: "#475467",
//   },
//   barValue: {
//     fontSize: 12.5,
//     fontWeight: "600",
//     color: "#16213E",
//   },
//   barTrack: {
//     height: 8,
//     borderRadius: 999,
//     backgroundColor: "#F7F5F0",
//     overflow: "hidden",
//   },
//   barFill: {
//     height: "100%",
//     borderRadius: 999,
//   },
//   emptyText: {
//     fontSize: 13,
//     color: "rgba(71,84,103,0.7)",
//   },
//   revenueRow: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 16,
//   },
//   revenueBox: {
//     flex: 1,
//     borderRadius: 12,
//     padding: 14,
//     borderWidth: 1,
//   },
//   revenueSuccess: {
//     backgroundColor: "rgba(63,143,95,0.05)",
//     borderColor: "rgba(63,143,95,0.15)",
//   },
//   revenueAlert: {
//     backgroundColor: "rgba(214,90,74,0.05)",
//     borderColor: "rgba(214,90,74,0.15)",
//   },
//   revenueLabel: {
//     fontSize: 11.5,
//     color: "rgba(71,84,103,0.7)",
//     fontWeight: "500",
//   },
//   revenueValue: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginTop: 4,
//   },
//   pillRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     gap: 8,
//   },
//   listItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(0,0,0,0.05)",
//   },
//   listIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     backgroundColor: "rgba(232,163,61,0.15)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   activityIcon: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#16213E",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   listTitle: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#16213E",
//   },
//   listSub: {
//     fontSize: 11.5,
//     color: "rgba(71,84,103,0.7)",
//     marginTop: 2,
//   },
//   listMeta: {
//     fontSize: 12,
//     color: "rgba(71,84,103,0.7)",
//   },
// });

import { DrawerToggle } from "@/components/PlatformSidebar";
import { PlatformTabBar } from "@/components/PlatformTabBar";
import { Card, PageIntro, Pill, StatCard } from "@/components/UI";
import { api } from "@/lib/api";
import { logout } from "@/store/authSlice"; // adjust path
import { selectRole, selectUser } from "@/store/selectors"; // adjust path
import { useRouter } from "expo-router";
import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  CalendarClock,
  CheckCheck,
  Inbox,
  Layers,
  LogOut,
  TrendingUp,
  Users,
  Wallet,
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

const PIE_COLORS = ["#16213E", "#E8A33D", "#3F8F5F", "#3B6FA0", "#D65A4A"];

const SUB_LABELS: Record<string, string> = {
  trialing: "Trialing",
  active: "Active",
  past_due: "Past due",
  suspended: "Suspended",
  cancelled: "Cancelled",
  expired: "Expired",
};

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  amberDark: "#C9832A",
  success: "#3F8F5F",
  info: "#3B6FA0",
  alert: "#D65A4A",
  paper: "#F7F5F0",
  slate: "#475467",
};

const inr = (value: any) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const timeAgo = (value?: string) => {
  if (!value) return "—";
  const seconds = Math.floor((Date.now() - new Date(value).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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

export default function PlatformDashboard() {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    api.analytics
      .summary()
      .then(({ data: raw }) => setData(raw))
      .catch((err: any) => setError(err.message))
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

  const Topbar = () => (
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
          Platform Dashboard
        </Text>
      </View>

      <View style={styles.headerRight}>
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

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={16} color={colors.ink} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const NotifModal = () => (
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
                <Text style={styles.emptyNotifText}>No notifications yet</Text>
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
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Topbar />
        <NotifModal />
        <View style={styles.contentPad}>
          <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
          <Card>
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.amber} />
              <Text style={styles.loadingText}>Loading platform overview…</Text>
            </View>
          </Card>
        </View>
        <PlatformTabBar />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <Topbar />
        <NotifModal />
        <View style={styles.contentPad}>
          <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
          <Card>
            <Text style={styles.errorText}>
              Unable to load platform analytics: {error || "no data"}
            </Text>
          </Card>
        </View>
        <PlatformTabBar />
      </View>
    );
  }

  const ov = data.overview || {};
  const schools = ov.schools || {};
  const subs = ov.subscriptions || {};
  const exp = data.expiringSubscriptions || {
    in7: 0,
    in15: 0,
    in30: 0,
    items: [],
  };
  const planBars = (data.planDistribution || [])
    .filter((p: any) => p.count > 0)
    .map((p: any) => ({
      name: String(p.plan).toUpperCase(),
      count: p.count,
    }));
  const funnel = (data.onboarding?.funnel || []).map((f: any) => ({
    step: f.step.charAt(0).toUpperCase() + f.step.slice(1),
    count: f.count,
  }));
  const revenue = data.revenue || {};
  const invoiceCounts = revenue.invoices || {};
  const alerts = data.alerts || [];
  const activity = data.recentActivity || [];

  return (
    <View style={styles.container}>
      <Topbar />
      <NotifModal />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageIntro
          eyebrow="Platform Owner"
          title="Platform Dashboard"
          description="Live snapshot across the entire multi-tenant network: growth, subscriptions, revenue, onboarding and operator attention items."
        />

        {/* Alerts */}
        {alerts.length > 0 && (
          <View style={styles.alertsWrap}>
            {alerts.map((alert: any, index: number) => (
              <View
                key={`${alert.type}-${index}`}
                style={[
                  styles.alertBox,
                  alert.severity === "warning"
                    ? styles.alertWarning
                    : styles.alertInfo,
                ]}
              >
                <AlertTriangle
                  size={15}
                  color={
                    alert.severity === "warning" ? colors.alert : colors.info
                  }
                />
                <Text
                  style={[
                    styles.alertText,
                    {
                      color:
                        alert.severity === "warning"
                          ? colors.alert
                          : colors.info,
                    },
                  ]}
                >
                  {alert.message}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Stat Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statHalf}>
            <StatCard
              icon={Building2}
              label="Schools"
              value={schools.total ?? data.schools ?? 0}
              sub={`${schools.active ?? data.activeSchools ?? 0} active`}
              accent="amber"
            />
          </View>
          <View style={styles.statHalf}>
            <StatCard
              icon={Users}
              label="Users"
              value={(ov.users?.total ?? data.users ?? 0).toLocaleString(
                "en-IN",
              )}
              sub="excl. platform owner"
              accent="info"
            />
          </View>
          <View style={styles.statHalf}>
            <StatCard
              icon={Layers}
              label="Subscriptions"
              value={subs.current ?? data.subscriptions?.current ?? 0}
              sub={`trial ${subs.byStatus?.trialing ?? 0} · past due ${
                subs.byStatus?.past_due ?? 0
              }`}
              accent="success"
            />
          </View>
          <View style={styles.statHalf}>
            <StatCard
              icon={TrendingUp}
              label="MRR"
              value={inr(ov.mrr ?? data.mrr ?? 0)}
              sub={`ARPU ${inr(ov.arpu ?? data.arpu ?? 0)}`}
              accent="info"
            />
          </View>
          <View style={styles.statFull}>
            <StatCard
              icon={Wallet}
              label="Revenue"
              value={inr(revenue.collected ?? data.revenue?.collected)}
              sub={`${inr(
                revenue.outstanding ?? data.revenue?.outstanding,
              )} outstanding`}
              accent={
                Number(revenue.outstanding || 0) > 0 ? "alert" : "success"
              }
            />
          </View>
        </View>

        {/* Plan Distribution */}
        <Card title="Plan distribution" style={styles.mb5}>
          {planBars.length ? (
            <View style={styles.gap3}>
              {planBars.map((plan: any, index: number) => {
                const max = Math.max(...planBars.map((p: any) => p.count), 1);
                const width = Math.round((plan.count / max) * 100);
                return (
                  <View key={plan.name}>
                    <View style={styles.barHeader}>
                      <Text style={styles.barLabel}>{plan.name}</Text>
                      <Text style={styles.barValue}>{plan.count}</Text>
                    </View>
                    <View style={styles.barTrack}>
                      <View
                        style={[
                          styles.barFill,
                          {
                            width: `${width}%`,
                            backgroundColor:
                              PIE_COLORS[index % PIE_COLORS.length],
                          },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>No plans assigned yet.</Text>
          )}
        </Card>

        {/* Onboarding Funnel */}
        <Card title="Onboarding funnel" style={styles.mb5}>
          <View style={styles.gap3}>
            {funnel.map((step: any, index: number) => {
              const max = Math.max(1, ...funnel.map((f: any) => f.count));
              const width = Math.round((step.count / max) * 100);
              return (
                <View key={step.step}>
                  <View style={styles.barHeader}>
                    <Text style={styles.barLabel}>{step.step}</Text>
                    <Text style={styles.barValue}>{step.count}</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          width: `${width}%`,
                          backgroundColor:
                            PIE_COLORS[index % PIE_COLORS.length],
                        },
                      ] }
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Revenue */}
        <Card title="Revenue" style={styles.mb5}>
          <View style={styles.revenueRow}>
            <View style={[styles.revenueBox, styles.revenueSuccess]}>
              <Text style={styles.revenueLabel}>Collected</Text>
              <Text style={[styles.revenueValue, { color: colors.success }]}>
                {inr(revenue.collected)}
              </Text>
            </View>
            <View style={[styles.revenueBox, styles.revenueAlert]}>
              <Text style={styles.revenueLabel}>Outstanding</Text>
              <Text style={[styles.revenueValue, { color: colors.alert }]}>
                {inr(revenue.outstanding)}
              </Text>
            </View>
          </View>

          <View style={styles.pillRow}>
            <Pill tone="success">{invoiceCounts.paid || 0} paid</Pill>
            <Pill tone="amber">{invoiceCounts.issued || 0} issued</Pill>
            <Pill tone="alert">{invoiceCounts.overdue || 0} overdue</Pill>
            <Pill>{invoiceCounts.draft || 0} draft</Pill>
          </View>
        </Card>

        {/* Expiring Subscriptions */}
        <Card
          title="Expiring subscriptions"
          action={
            <View style={styles.pillRow}>
              <Pill tone={exp.in7 > 0 ? "alert" : "success"}>
                {exp.in7 || 0} in 7d
              </Pill>
              <Pill tone={exp.in15 > 0 ? "amber" : "neutral"}>
                {exp.in15} in 15d
              </Pill>
            </View>
          }
          style={styles.mb5}
          bodyStyle={{ padding: 0 }}
        >
          {exp.items?.length ? (
            <View>
              {exp.items.map((item: any) => (
                <View key={item._id} style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <CalendarClock size={15} color={colors.amberDark} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listTitle} numberOfLines={1}>
                      {item.school?.name || "Unknown school"}
                    </Text>
                    <Text style={styles.listSub}>
                      {item.plan?.name || "—"} ·{" "}
                      {SUB_LABELS[item.status] || item.status}
                    </Text>
                  </View>
                  <Text style={styles.listMeta}>
                    {item.reference ? fmtDate(item.reference) : "—"}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { padding: 16 }]}>
              No expiring subscriptions.
            </Text>
          )}
        </Card>

        {/* Recent Activity */}
        <Card title="Recent platform activity" bodyStyle={{ padding: 0 }}>
          {activity.length ? (
            <View>
              {activity.map((entry: any) => (
                <View key={entry._id} style={styles.listItem}>
                  <View style={styles.activityIcon}>
                    <Activity size={14} color={colors.amber} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listTitle}>
                      <Text style={{ fontWeight: "700" }}>
                        {entry.actorEmail || "system"}
                      </Text>{" "}
                      <Text style={{ color: "rgba(71,84,103,0.7)" }}>
                        {entry.message || entry.action}
                      </Text>
                    </Text>
                    <Text style={styles.listSub}>
                      {entry.action} · {entry.actorRole || "—"} ·{" "}
                      {timeAgo(entry.createdAt)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={[styles.emptyText, { padding: 16 }]}>
              No platform activity recorded yet.
            </Text>
          )}
        </Card>
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
  contentPad: {
    padding: 16,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    alignItems: "center",
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 12,
  },
  errorText: {
    fontSize: 13,
    color: "#D65A4A",
  },
  alertsWrap: {
    marginBottom: 20,
    gap: 8,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertWarning: {
    backgroundColor: "rgba(214,90,74,0.05)",
    borderColor: "rgba(214,90,74,0.2)",
  },
  alertInfo: {
    backgroundColor: "rgba(59,111,160,0.05)",
    borderColor: "rgba(59,111,160,0.2)",
  },
  alertText: {
    flex: 1,
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statHalf: {
    width: "48%",
  },
  statFull: {
    width: "100%",
  },
  mb5: {
    marginBottom: 20,
  },
  gap3: {
    gap: 12,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12.5,
    color: "#475467",
  },
  barValue: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#16213E",
  },
  barTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#F7F5F0",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },
  emptyText: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
  },
  revenueRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  revenueBox: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  revenueSuccess: {
    backgroundColor: "rgba(63,143,95,0.05)",
    borderColor: "rgba(63,143,95,0.15)",
  },
  revenueAlert: {
    backgroundColor: "rgba(214,90,74,0.05)",
    borderColor: "rgba(214,90,74,0.15)",
  },
  revenueLabel: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.7)",
    fontWeight: "500",
  },
  revenueValue: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  listIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(232,163,61,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#16213E",
    alignItems: "center",
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#16213E",
  },
  listSub: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.7)",
    marginTop: 2,
  },
  listMeta: {
    fontSize: 12,
    color: "rgba(71,84,103,0.7)",
  },
});