import { DrawerToggle } from "@/components/PlatformSidebar";
import { PlatformTabBar } from "@/components/PlatformTabBar";
import { Card, PageIntro, Pill, StatCard } from "@/components/UI";
import { api } from "@/lib/api";
import {
  Activity,
  AlertTriangle,
  Building2,
  CalendarClock,
  Layers,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  border: "rgba(0,0,0,0.07)",
  white: "#FFFFFF",
};

const inr = (value: any) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
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
      <View style={styles.screen}>
        <View style={styles.toggleRow}>
          <DrawerToggle />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.amber} />
          <Text style={styles.loadingText}>Loading platform overview…</Text>
        </View>
        <PlatformTabBar />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.screen}>
        <View style={styles.toggleRow}>
          <DrawerToggle />
        </View>
        <View style={styles.loadingContainer}>
          <AlertTriangle size={28} color={colors.alert} />
          <Text style={styles.errorTitle}>Unable to load analytics</Text>
          <Text style={styles.errorText}>{error || "No data available"}</Text>
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
    <View style={styles.screen}>
      {/* Top bar with drawer toggle */}
      <View style={styles.toggleRow}>
        <DrawerToggle />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <PageIntro
          eyebrow="Platform Owner"
          title="Platform Dashboard"
          description="Live snapshot across the entire multi-tenant network — growth, subscriptions, revenue, onboarding and operator attention items."
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
                  size={16}
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
        <Card title="Plan distribution" style={styles.section}>
          {planBars.length ? (
            <View style={styles.bars}>
              {planBars.map((plan: any, index: number) => {
                const max = Math.max(...planBars.map((p: any) => p.count), 1);
                const width = Math.round((plan.count / max) * 100);
                return (
                  <View key={plan.name} style={styles.barRow}>
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
        <Card title="Onboarding funnel" style={styles.section}>
          <View style={styles.bars}>
            {funnel.map((step: any, index: number) => {
              const max = Math.max(1, ...funnel.map((f: any) => f.count));
              const width = Math.round((step.count / max) * 100);
              return (
                <View key={step.step} style={styles.barRow}>
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
        <Card title="Revenue" style={styles.section}>
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
            <View style={styles.pillRowCompact}>
              <Pill tone={exp.in7 > 0 ? "alert" : "success"}>
                {exp.in7 || 0} in 7d
              </Pill>
              <Pill tone={exp.in15 > 0 ? "amber" : "neutral"}>
                {exp.in15} in 15d
              </Pill>
            </View>
          }
          style={styles.section}
          bodyStyle={{ padding: 0 }}
        >
          {exp.items?.length ? (
            <View>
              {exp.items.map((item: any) => (
                <View key={item._id} style={styles.listItem}>
                  <View style={styles.listIcon}>
                    <CalendarClock size={15} color={colors.amberDark} />
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
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
            <Text style={[styles.emptyText, { padding: 18 }]}>
              No expiring subscriptions in the next 30 days.
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
                      <Text style={{ color: "rgba(71,84,103,0.75)" }}>
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
            <Text style={[styles.emptyText, { padding: 18 }]}>
              No platform activity recorded yet.
            </Text>
          )}
        </Card>
      </ScrollView>

      {/* Bottom Tabs - kept fixed */}
      <PlatformTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  toggleRow: {
    backgroundColor: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 11,
    alignItems: "flex-start",
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: "rgba(71,84,103,0.7)",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13.5,
    color: colors.alert,
    textAlign: "center",
  },

  // Alerts
  alertsWrap: {
    marginBottom: 18,
    gap: 8,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  alertWarning: {
    backgroundColor: "rgba(214,90,74,0.06)",
    borderColor: "rgba(214,90,74,0.22)",
  },
  alertInfo: {
    backgroundColor: "rgba(59,111,160,0.06)",
    borderColor: "rgba(59,111,160,0.22)",
  },
  alertText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 19,
  },

  // Stats
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

  section: {
    marginBottom: 18,
  },

  // Bars
  bars: {
    gap: 14,
  },
  barRow: {
    gap: 5,
  },
  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  barLabel: {
    fontSize: 13,
    color: colors.slate,
    fontWeight: "500",
  },
  barValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  barTrack: {
    height: 9,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.06)",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 999,
  },

  emptyText: {
    fontSize: 13.5,
    color: "rgba(71,84,103,0.65)",
  },

  // Revenue
  revenueRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  revenueBox: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
  },
  revenueSuccess: {
    backgroundColor: "rgba(63,143,95,0.06)",
    borderColor: "rgba(63,143,95,0.18)",
  },
  revenueAlert: {
    backgroundColor: "rgba(214,90,74,0.06)",
    borderColor: "rgba(214,90,74,0.18)",
  },
  revenueLabel: {
    fontSize: 12,
    color: "rgba(71,84,103,0.7)",
    fontWeight: "500",
  },
  revenueValue: {
    fontSize: 19,
    fontWeight: "700",
    marginTop: 4,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pillRowCompact: {
    flexDirection: "row",
    gap: 6,
  },

  // Lists
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  listIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(232,163,61,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  activityIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.ink,
  },
  listSub: {
    fontSize: 12,
    color: "rgba(71,84,103,0.7)",
    marginTop: 2,
  },
  listMeta: {
    fontSize: 12.5,
    color: "rgba(71,84,103,0.65)",
    fontWeight: "500",
  },
});