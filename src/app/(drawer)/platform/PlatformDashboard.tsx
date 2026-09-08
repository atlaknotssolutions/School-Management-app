// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import {
//   Building2,
//   Users,
//   Wallet,
//   TrendingUp,
//   AlertTriangle,
//   Activity,
//   CalendarClock,
//   Layers,
// } from "lucide-react-native";
// import { api } from "@/lib/api";
// import { Card, PageIntro, Pill, StatCard } from "@/components/UI";

// const PIE_COLORS = ["#16213E", "#E8A33D", "#3F8F5F", "#3B6FA0", "#D65A4A"];

// const SUB_LABELS: Record<string, string> = {
//   trialing: "Trialing",
//   active: "Active",
//   past_due: "Past due",
//   suspended: "Suspended",
//   cancelled: "Cancelled",
//   expired: "Expired",
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
//       <View className="flex-1 p-4">
//         <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
//         <Card>
//           <View className="items-center py-8">
//             <ActivityIndicator size="large" color="#E8A33D" />
//             <Text className="text-[13px] text-slate-text/70 mt-3">
//               Loading platform overview…
//             </Text>
//           </View>
//         </Card>
//       </View>
//     );
//   }

//   if (error || !data) {
//     return (
//       <View className="flex-1 p-4">
//         <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
//         <Card>
//           <Text className="text-[13px] text-alert">
//             Unable to load platform analytics: {error || "no data"}
//           </Text>
//         </Card>
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
//     <ScrollView
//       className="flex-1 bg-paper"
//       contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
//       showsVerticalScrollIndicator={false}
//     >
//       <PageIntro
//         eyebrow="Platform Owner"
//         title="Platform Dashboard"
//         description="Live snapshot across the entire multi-tenant network: growth, subscriptions, revenue, onboarding and operator attention items."
//       />

//       {/* Alerts */}
//       {alerts.length > 0 && (
//         <View className="mb-5 gap-2">
//           {alerts.map((alert: any, index: number) => (
//             <View
//               key={`${alert.type}-${index}`}
//               className={`flex-row items-start gap-2.5 px-4 py-3 rounded-xl border ${
//                 alert.severity === "warning"
//                   ? "bg-alert/5 border-alert/20"
//                   : "bg-info/5 border-info/20"
//               }`}
//             >
//               <AlertTriangle
//                 size={15}
//                 color={alert.severity === "warning" ? "#D65A4A" : "#3B6FA0"}
//               />
//               <Text
//                 className={`flex-1 text-[13px] ${
//                   alert.severity === "warning" ? "text-alert" : "text-info"
//                 }`}
//               >
//                 {alert.message}
//               </Text>
//             </View>
//           ))}
//         </View>
//       )}

//       {/* Stat Cards */}
//       <View className="flex-row flex-wrap gap-3 mb-5">
//         <View className="w-[48%]">
//           <StatCard
//             icon={Building2}
//             label="Schools"
//             value={schools.total ?? data.schools ?? 0}
//             sub={`${schools.active ?? data.activeSchools ?? 0} active`}
//             accent="amber"
//           />
//         </View>
//         <View className="w-[48%]">
//           <StatCard
//             icon={Users}
//             label="Users"
//             value={(ov.users?.total ?? data.users ?? 0).toLocaleString("en-IN")}
//             sub="excl. platform owner"
//             accent="info"
//           />
//         </View>
//         <View className="w-[48%]">
//           <StatCard
//             icon={Layers}
//             label="Subscriptions"
//             value={subs.current ?? data.subscriptions?.current ?? 0}
//             sub={`trial ${subs.byStatus?.trialing ?? 0} · past due ${
//               subs.byStatus?.past_due ?? 0
//             }`}
//             accent="success"
//           />
//         </View>
//         <View className="w-[48%]">
//           <StatCard
//             icon={TrendingUp}
//             label="MRR"
//             value={inr(ov.mrr ?? data.mrr ?? 0)}
//             sub={`ARPU ${inr(ov.arpu ?? data.arpu ?? 0)}`}
//             accent="info"
//           />
//         </View>
//         <View className="w-full">
//           <StatCard
//             icon={Wallet}
//             label="Revenue"
//             value={inr(revenue.collected ?? data.revenue?.collected)}
//             sub={`${inr(
//               revenue.outstanding ?? data.revenue?.outstanding
//             )} outstanding`}
//             accent={
//               Number(revenue.outstanding || 0) > 0 ? "alert" : "success"
//             }
//           />
//         </View>
//       </View>

//       {/* Plan Distribution (simple bars) */}
//       <Card title="Plan distribution" className="mb-5">
//         {planBars.length ? (
//           <View className="gap-3">
//             {planBars.map((plan: any, index: number) => {
//               const max = Math.max(...planBars.map((p: any) => p.count), 1);
//               const width = Math.round((plan.count / max) * 100);
//               return (
//                 <View key={plan.name}>
//                   <View className="flex-row justify-between mb-1">
//                     <Text className="text-[12.5px] text-slate-text">
//                       {plan.name}
//                     </Text>
//                     <Text className="text-[12.5px] font-semibold text-ink">
//                       {plan.count}
//                     </Text>
//                   </View>
//                   <View className="h-2 rounded-full bg-paper overflow-hidden">
//                     <View
//                       className="h-full rounded-full"
//                       style={{
//                         width: `${width}%`,
//                         backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
//                       }}
//                     />
//                   </View>
//                 </View>
//               );
//             })}
//           </View>
//         ) : (
//           <Text className="text-[13px] text-slate-text/70">
//             No plans assigned yet.
//           </Text>
//         )}
//       </Card>

//       {/* Onboarding Funnel */}
//       <Card title="Onboarding funnel" className="mb-5">
//         <View className="gap-3">
//           {funnel.map((step: any, index: number) => {
//             const max = Math.max(1, ...funnel.map((f: any) => f.count));
//             const width = Math.round((step.count / max) * 100);
//             return (
//               <View key={step.step}>
//                 <View className="flex-row justify-between mb-1">
//                   <Text className="text-[12.5px] text-slate-text">
//                     {step.step}
//                   </Text>
//                   <Text className="text-[12.5px] font-semibold text-ink">
//                     {step.count}
//                   </Text>
//                 </View>
//                 <View className="h-2 rounded-full bg-paper overflow-hidden">
//                   <View
//                     className="h-full rounded-full"
//                     style={{
//                       width: `${width}%`,
//                       backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
//                     }}
//                   />
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </Card>

//       {/* Revenue Summary */}
//       <Card title="Revenue" className="mb-5">
//         <View className="flex-row gap-3 mb-4">
//           <View className="flex-1 rounded-xl bg-success/5 border border-success/15 p-3.5">
//             <Text className="text-[11.5px] text-slate-text/70 font-medium">
//               Collected
//             </Text>
//             <Text className="text-[18px] font-bold text-success mt-1">
//               {inr(revenue.collected)}
//             </Text>
//           </View>
//           <View className="flex-1 rounded-xl bg-alert/5 border border-alert/15 p-3.5">
//             <Text className="text-[11.5px] text-slate-text/70 font-medium">
//               Outstanding
//             </Text>
//             <Text className="text-[18px] font-bold text-alert mt-1">
//               {inr(revenue.outstanding)}
//             </Text>
//           </View>
//         </View>

//         <View className="flex-row flex-wrap gap-2">
//           <Pill tone="success">{invoiceCounts.paid || 0} paid</Pill>
//           <Pill tone="amber">{invoiceCounts.issued || 0} issued</Pill>
//           <Pill tone="alert">{invoiceCounts.overdue || 0} overdue</Pill>
//           <Pill>{invoiceCounts.draft || 0} draft</Pill>
//         </View>
//       </Card>

//       {/* Expiring Subscriptions */}
//       <Card
//         title="Expiring subscriptions"
//         action={
//           <View className="flex-row gap-1.5">
//             <Pill tone={exp.in7 > 0 ? "alert" : "success"}>
//               {exp.in7 || 0} in 7d
//             </Pill>
//             <Pill tone={exp.in15 > 0 ? "amber" : "neutral"}>
//               {exp.in15} in 15d
//             </Pill>
//           </View>
//         }
//         className="mb-5"
//         bodyClassName="p-0"
//       >
//         {exp.items?.length ? (
//           <View>
//             {exp.items.map((item: any) => (
//               <View
//                 key={item._id}
//                 className="px-4 py-3 flex-row items-center gap-3 border-b border-black/5"
//               >
//                 <View className="w-8 h-8 rounded-lg bg-amber/15 items-center justify-center">
//                   <CalendarClock size={15} color="#C9832A" />
//                 </View>
//                 <View className="flex-1">
//                   <Text className="text-[13px] font-semibold text-ink" numberOfLines={1}>
//                     {item.school?.name || "Unknown school"}
//                   </Text>
//                   <Text className="text-[11.5px] text-slate-text/70">
//                     {item.plan?.name || "—"} ·{" "}
//                     {SUB_LABELS[item.status] || item.status}
//                   </Text>
//                 </View>
//                 <Text className="text-[12px] text-slate-text/70">
//                   {item.reference ? fmtDate(item.reference) : "—"}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         ) : (
//           <Text className="p-4 text-[13px] text-slate-text/70">
//             No expiring subscriptions.
//           </Text>
//         )}
//       </Card>

//       {/* Recent Activity */}
//       <Card title="Recent platform activity" bodyClassName="p-0">
//         {activity.length ? (
//           <View>
//             {activity.map((entry: any) => (
//               <View
//                 key={entry._id}
//                 className="px-4 py-3 flex-row items-start gap-3 border-b border-black/5"
//               >
//                 <View className="w-8 h-8 rounded-full bg-ink items-center justify-center mt-0.5">
//                   <Activity size={14} color="#E8A33D" />
//                 </View>
//                 <View className="flex-1">
//                   <Text className="text-[13px] text-ink">
//                     <Text className="font-semibold">
//                       {entry.actorEmail || "system"}
//                     </Text>{" "}
//                     <Text className="text-slate-text/70">
//                       {entry.message || entry.action}
//                     </Text>
//                   </Text>
//                   <Text className="text-[11.5px] text-slate-text/60 mt-0.5">
//                     {entry.action} · {entry.actorRole || "—"} ·{" "}
//                     {timeAgo(entry.createdAt)}
//                   </Text>
//                 </View>
//               </View>
//             ))}
//           </View>
//         ) : (
//           <Text className="p-4 text-[13px] text-slate-text/70">
//             No platform activity recorded yet.
//           </Text>
//         )}
//       </Card>
//     </ScrollView>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  Building2,
  Users,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Activity,
  CalendarClock,
  Layers,
} from "lucide-react-native";
import { api } from "@/lib/api";
import { Card, PageIntro, Pill, StatCard } from "@/components/UI";

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

export default function PlatformDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.analytics
      .summary()
      .then(({ data: raw }) => setData(raw))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
        <Card>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.amber} />
            <Text style={styles.loadingText}>Loading platform overview…</Text>
          </View>
        </Card>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <PageIntro eyebrow="Platform Owner" title="Platform Dashboard" />
        <Card>
          <Text style={styles.errorText}>
            Unable to load platform analytics: {error || "no data"}
          </Text>
        </Card>
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
    <ScrollView
      style={styles.scroll}
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
            value={(ov.users?.total ?? data.users ?? 0).toLocaleString("en-IN")}
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
              revenue.outstanding ?? data.revenue?.outstanding
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
                    ]}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F7F5F0",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#F7F5F0",
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