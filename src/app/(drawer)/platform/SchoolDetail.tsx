import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Users,
  CreditCard,
  FileText,
} from "lucide-react-native";
import { api } from "@/lib/api";
import { Card, PageIntro, Pill } from "@/components/UI";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  paper: "#F7F5F0",
  slate: "#475467",
  info: "#3B6FA0",
  alert: "#D65A4A",
  success: "#3F8F5F",
  border: "rgba(0,0,0,0.06)",
};

const ONBOARDING_FLOW = ["created", "configured", "subscribed", "live"] as const;

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

const nextStepOf = (current?: string) => {
  const index = ONBOARDING_FLOW.indexOf(current as any);
  return index >= 0 && index < ONBOARDING_FLOW.length - 1
    ? ONBOARDING_FLOW[index + 1]
    : null;
};

const fmtDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function SchoolDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.platform.schools
      .get360(id)
      .then(({ data: raw }: any) => setData(raw))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, refreshKey]);

  const advance = async () => {
    const school = data?.school;
    if (!school) return;
    const next = nextStepOf(school.onboarding?.status);
    if (!next) return;

    setBusy(true);
    try {
      await api.platform.schools.updateOnboarding(school._id, next);
      Alert.alert("Done", `Onboarding advanced to ${next}`);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <PageIntro title="School 360°" />
        <Card>
          <View style={styles.center}>
            <ActivityIndicator color={colors.amber} />
            <Text style={styles.muted}>Loading school…</Text>
          </View>
        </Card>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.container}>
        <PageIntro title="School 360°" />
        <Card>
          <Text style={styles.errorText}>{error || "School not found"}</Text>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.push("/(drawer)/platform/schools" as any)}
          >
            <Text style={styles.backLinkText}>← Back to Schools Management</Text>
          </TouchableOpacity>
        </Card>
      </View>
    );
  }

  const school = data.school;
  const next = nextStepOf(school.onboarding?.status);
  const subscription = data.subscription;
  const admins = data.admins || [];
  const stage = school.onboarding?.status || "created";
  const currentIndex = ONBOARDING_FLOW.indexOf(stage as any);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <PageIntro
        eyebrow="Platform Owner · School Operations"
        title={`${school.name} — 360°`}
        description="Full context on this tenant: profile, onboarding, admins, subscription and recent invoices."
        right={
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => router.push("/(drawer)/platform/schools" as any)}
          >
            <ArrowLeft size={15} color={colors.ink} />
            <Text style={styles.outlineBtnText}>Schools</Text>
          </TouchableOpacity>
        }
      />

      {/* Profile */}
      <Card title="Profile" style={styles.mb4}>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Code</Text>
            <Text style={styles.mono}>{school.code}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Plan</Text>
            <Pill tone="info">{school.plan}</Pill>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Status</Text>
            <Pill tone={school.status === "active" ? "success" : "alert"}>
              {school.status}
            </Pill>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{school.city || "—"}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Created</Text>
            <Text style={styles.value}>{fmtDate(school.createdAt)}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Last update</Text>
            <Text style={styles.value}>{fmtDate(school.updatedAt)}</Text>
          </View>
        </View>
      </Card>

      {/* Admins */}
      <Card title="School admins" style={styles.mb4} bodyStyle={{ padding: 0 }}>
        {admins.length ? (
          <View>
            {admins.map((admin: any) => (
              <View key={admin._id} style={styles.adminRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(admin.name || "U").slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminName} numberOfLines={1}>
                    {admin.name}
                  </Text>
                  <Text style={styles.adminEmail} numberOfLines={1}>
                    {admin.email}
                  </Text>
                </View>
                <Text style={styles.adminMeta}>
                  {admin.lastLogin
                    ? `last login ${fmtDate(admin.lastLogin)}`
                    : "never logged in"}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            <Text style={styles.muted}>
              No school admin yet. Onboard one from Users & Access.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(drawer)/platform/users" as any)}
            >
              <Text style={styles.linkText}>Go to Users & Access →</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.adminFooter}>
          <Users size={13} color="rgba(71,84,103,0.7)" />
          <Text style={styles.adminFooterText}>
            {data.activeUsers || 0} active user
            {data.activeUsers === 1 ? "" : "s"} across roles in this school
          </Text>
        </View>
      </Card>

      {/* Recent Invoices */}
      <Card
        title="Recent invoices"
        style={styles.mb4}
        bodyStyle={{ padding: 0 }}
      >
        {data.recentInvoices?.length ? (
          <View>
            {data.recentInvoices.map((invoice: any) => (
              <View key={invoice._id} style={styles.invoiceRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.invoiceNo} numberOfLines={1}>
                    {invoice.invoiceNumber}
                  </Text>
                  <Text style={styles.invoiceDue}>
                    due {fmtDate(invoice.dueDate)}
                  </Text>
                </View>
                <Text style={styles.invoiceAmount}>
                  ₹{Number(invoice.amount || 0).toLocaleString("en-IN")}
                </Text>
                <Pill
                  tone={
                    invoice.status === "paid"
                      ? "success"
                      : invoice.status === "overdue"
                      ? "alert"
                      : "amber"
                  }
                >
                  {invoice.status}
                </Pill>
              </View>
            ))}
          </View>
        ) : (
          <Text style={[styles.muted, { padding: 16 }]}>No invoices yet.</Text>
        )}
      </Card>

      {/* Onboarding */}
      <Card title="Onboarding" style={styles.mb4}>
        <View style={styles.onboardHeader}>
          <Text style={styles.muted}>Current stage</Text>
          <Pill tone={onboardingTone(school.onboarding?.status)}>
            {school.onboarding?.status || "created"}
          </Pill>
        </View>

        <View style={styles.flowList}>
          {ONBOARDING_FLOW.map((step, index) => {
            const reached = index <= currentIndex;
            return (
              <View key={step} style={styles.flowItem}>
                <View
                  style={[
                    styles.flowDot,
                    reached ? styles.flowDotDone : styles.flowDotPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.flowDotText,
                      { color: reached ? colors.success : "rgba(71,84,103,0.5)" },
                    ]}
                  >
                    {reached ? "✓" : index + 1}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.flowLabel,
                    reached && styles.flowLabelDone,
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        {next ? (
          <TouchableOpacity
            style={[styles.advanceBtn, busy && { opacity: 0.6 }]}
            onPress={advance}
            disabled={busy}
            activeOpacity={0.8}
          >
            <Text style={styles.advanceBtnText}>
              {busy ? "Updating…" : `Advance to ${next}`}
            </Text>
          </TouchableOpacity>
        ) : null}
      </Card>

      {/* Subscription */}
      <Card title="Current subscription">
        {subscription ? (
          <View>
            <View style={styles.subHeader}>
              <View style={styles.subIcon}>
                <CreditCard size={15} color={colors.success} />
              </View>
              <View>
                <Text style={styles.subTitle}>
                  {subscription.plan?.name || "—"}
                </Text>
                <Text style={styles.subStatus}>{subscription.status}</Text>
              </View>
            </View>

            <View style={styles.subGrid}>
              <View style={styles.gridItem}>
                <Text style={styles.subMetaLabel}>Renews</Text>
                <Text style={styles.subMetaValue}>
                  {fmtDate(subscription.nextBillingDate)}
                </Text>
              </View>
              <View style={styles.gridItem}>
                <Text style={styles.subMetaLabel}>Amount</Text>
                <Text style={styles.subMetaValue}>
                  ₹{Number(subscription.price || 0).toLocaleString("en-IN")}/
                  {subscription.billingCycle === "yearly" ? "yr" : "mo"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.manageLink}
              onPress={() =>
                router.push("/(drawer)/platform/subscriptions" as any)
              }
            >
              <FileText size={13} color={colors.info} />
              <Text style={styles.manageLinkText}>
                Manage in Subscriptions
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.muted}>
              No current subscription. Assign one from Subscriptions.
            </Text>
            <TouchableOpacity
              onPress={() =>
                router.push("/(drawer)/platform/subscriptions" as any)
              }
            >
              <Text style={styles.linkText}>Go to Subscriptions →</Text>
            </TouchableOpacity>
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.paper,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    alignItems: "center",
    paddingVertical: 28,
  },
  muted: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
  },
  errorText: {
    fontSize: 13,
    color: colors.alert,
  },
  backLink: {
    marginTop: 12,
  },
  backLinkText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.info,
  },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  outlineBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  mb4: {
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  gridItem: {
    width: "47%",
  },
  label: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "rgba(71,84,103,0.6)",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  value: {
    fontSize: 13.5,
    color: colors.ink,
  },
  mono: {
    fontSize: 13.5,
    color: colors.ink,
    fontFamily: "monospace",
  },
  adminRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.amber,
    fontWeight: "600",
    fontSize: 11,
  },
  adminName: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.ink,
  },
  adminEmail: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.7)",
    marginTop: 1,
  },
  adminMeta: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    maxWidth: 90,
    textAlign: "right",
  },
  adminFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  adminFooterText: {
    fontSize: 12.5,
    color: "rgba(71,84,103,0.7)",
  },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.info,
    marginTop: 8,
  },
  invoiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  invoiceNo: {
    fontSize: 13.5,
    fontWeight: "600",
    color: colors.ink,
  },
  invoiceDue: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.7)",
    marginTop: 1,
  },
  invoiceAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  onboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  flowList: {
    gap: 10,
  },
  flowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  flowDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  flowDotDone: {
    backgroundColor: "rgba(63,143,95,0.12)",
  },
  flowDotPending: {
    backgroundColor: colors.paper,
  },
  flowDotText: {
    fontSize: 10,
    fontWeight: "600",
  },
  flowLabel: {
    fontSize: 13,
    color: "rgba(71,84,103,0.6)",
    textTransform: "capitalize",
  },
  flowLabelDone: {
    color: colors.ink,
    fontWeight: "600",
  },
  advanceBtn: {
    marginTop: 16,
    backgroundColor: colors.ink,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  advanceBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  subIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(63,143,95,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  subStatus: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.7)",
    textTransform: "capitalize",
    marginTop: 1,
  },
  subGrid: {
    flexDirection: "row",
    gap: 16,
  },
  subMetaLabel: {
    fontSize: 12,
    color: "rgba(71,84,103,0.6)",
  },
  subMetaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    marginTop: 2,
  },
  manageLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
  },
  manageLinkText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: colors.info,
  },
});