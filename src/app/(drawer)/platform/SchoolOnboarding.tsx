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
import {
  Building2,
  UserRound,
  CreditCard,
  Rocket,
  Check,
  ArrowRight,
  ArrowLeft,
  Plus,
} from "lucide-react-native";
import { api } from "@/lib/api";
import { Card, PageIntro } from "@/components/UI";

const colors = {
  ink: "#16213E",
  amber: "#E8A33D",
  paper: "#F7F5F0",
  slate: "#475467",
  success: "#3F8F5F",
  border: "rgba(0,0,0,0.1)",
};

const STEPS = [
  { key: "profile", label: "School profile", icon: Building2 },
  { key: "admin", label: "School admin", icon: UserRound },
  { key: "plan", label: "Subscription", icon: CreditCard },
  { key: "launch", label: "Launch", icon: Rocket },
];

const initialForm = {
  name: "",
  code: "",
  shortName: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  session: String(new Date().getFullYear()),
};

type FormState = typeof initialForm;
type AdminState = { name: string; email: string; password: string };
type Plan = {
  _id: string;
  name: string;
  code?: string;
  description?: string;
  price?: number;
  billingCycle?: string;
  trialDays?: number;
};

export default function SchoolOnboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [admin, setAdmin] = useState<AdminState>({
    name: "",
    email: "",
    password: "",
  });
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planId, setPlanId] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolCode, setSchoolCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.plans
      .list("status=active")
      .then(({ data }: any) => {
        setPlans(data || []);
        if (data?.length) setPlanId(data[0]._id);
      })
      .catch((err: any) => Alert.alert("Error", err.message));
  }, []);

  const setField =
    (key: keyof FormState) => (value: string) =>
      setForm((prev) => ({ ...prev, [key]: value }));

  const createSchool = async () => {
    if (!form.name.trim() || !form.code.trim()) {
      Alert.alert("Error", "School name and code are required");
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.schools.create({
        ...form,
        code: form.code.trim(),
        name: form.name.trim(),
        shortName: form.shortName.trim() || undefined,
      });
      setSchoolId(data._id);
      setSchoolCode(data.code);
      await api.platform.schools.updateOnboarding(data._id, "configured");
      Alert.alert("Done", "School created — profile configured");
      setStepIndex(1);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const createAdmin = async () => {
    if (!admin.name.trim() || !admin.email.trim() || !admin.password) {
      Alert.alert("Error", "Name, email and password are required");
      return;
    }
    if (admin.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    try {
      await api.users.create({
        schoolId,
        name: admin.name.trim(),
        email: admin.email.trim().toLowerCase(),
        password: admin.password,
        role: "school_admin",
      });
      Alert.alert("Done", "School admin account created");
      setStepIndex(2);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const assignPlan = async () => {
    if (!planId) {
      Alert.alert("Error", "Pick a plan first");
      return;
    }
    setBusy(true);
    try {
      await api.subscriptions.assign(schoolId, planId, undefined);
      await api.platform.schools.updateOnboarding(schoolId, "subscribed");
      Alert.alert("Done", "Subscription assigned");
      setStepIndex(3);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const launch = async () => {
    setBusy(true);
    try {
      await api.platform.schools.updateOnboarding(schoolId, "live");
      setDone(true);
      Alert.alert("Success", "School is live");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setAdmin({ name: "", email: "", password: "" });
    setSchoolId("");
    setSchoolCode("");
    setStepIndex(0);
    setDone(false);
  };

  // ========== Done state ==========
  if (done) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <PageIntro
          eyebrow="Platform Owner · School Operations"
          title="School Onboarding"
          description="Provision a new tenant end-to-end."
        />
        <Card>
          <View style={styles.doneRow}>
            <View style={styles.doneIcon}>
              <Check size={22} color={colors.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.doneTitle}>School launched</Text>
              <Text style={styles.doneDesc}>
                {form.name || "School"} onboarded with school admin and a live
                subscription. It will appear under Schools Management.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.outlineBtn} onPress={reset}>
            <Text style={styles.outlineBtnText}>Onboard another school</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <PageIntro
        eyebrow="Platform Owner · School Operations"
        title="School Onboarding"
        description="Guided wizard that provisions the school, its admin account, and its first subscription using real platform APIs."
      />

      {/* Stepper */}
      <Card style={styles.mb4} bodyStyle={{ padding: 14 }}>
        <View style={styles.stepper}>
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const active = index === stepIndex;
            const past = index < stepIndex;

            return (
              <React.Fragment key={step.key}>
                <TouchableOpacity
                  style={styles.stepItem}
                  disabled={!past}
                  onPress={() => past && setStepIndex(index)}
                  activeOpacity={past ? 0.7 : 1}
                >
                  <View
                    style={[
                      styles.stepDot,
                      past && styles.stepDotPast,
                      active && styles.stepDotActive,
                    ]}
                  >
                    {past ? (
                      <Check size={13} color={colors.success} />
                    ) : active ? (
                      <Icon size={13} color="#fff" />
                    ) : (
                      <Text style={styles.stepNum}>{index + 1}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      past && { color: colors.success },
                      active && { color: colors.ink, fontWeight: "600" },
                    ]}
                    numberOfLines={1}
                  >
                    {step.label}
                  </Text>
                </TouchableOpacity>
                {index < STEPS.length - 1 && <View style={styles.stepLine} />}
              </React.Fragment>
            );
          })}
        </View>
      </Card>

      {/* Step 0 · Profile */}
      {stepIndex === 0 && (
        <Card title="Step 1 · School profile">
          <View style={styles.formGrid}>
            <TextInput
              style={styles.input}
              placeholder="School name *"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={form.name}
              onChangeText={setField("name")}
            />
            <TextInput
              style={[styles.input, styles.mono]}
              placeholder="Code (slug, e.g. brightwood) *"
              placeholderTextColor="rgba(71,84,103,0.45)"
              autoCapitalize="none"
              value={form.code}
              onChangeText={setField("code")}
            />
            <TextInput
              style={styles.input}
              placeholder="Short name"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={form.shortName}
              onChangeText={setField("shortName")}
            />
            <TextInput
              style={styles.input}
              placeholder="Session (2026-27)"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={form.session}
              onChangeText={setField("session")}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={form.city}
              onChangeText={setField("city")}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              placeholderTextColor="rgba(71,84,103,0.45)"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={setField("phone")}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact email"
              placeholderTextColor="rgba(71,84,103,0.45)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.email}
              onChangeText={setField("email")}
            />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={form.address}
              onChangeText={setField("address")}
            />
          </View>

          <View style={styles.actionsEnd}>
            <TouchableOpacity
              style={[styles.amberBtn, busy && { opacity: 0.6 }]}
              onPress={createSchool}
              disabled={busy}
              activeOpacity={0.8}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.ink} />
              ) : (
                <Plus size={15} color={colors.ink} />
              )}
              <Text style={styles.amberBtnText}>
                {busy ? "Creating…" : "Create school"}
              </Text>
              {!busy && <ArrowRight size={15} color={colors.ink} />}
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Step 1 · Admin */}
      {stepIndex === 1 && (
        <Card title="Step 2 · School admin account">
          <View style={styles.formGrid}>
            <TextInput
              style={styles.input}
              placeholder="Full name *"
              placeholderTextColor="rgba(71,84,103,0.45)"
              value={admin.name}
              onChangeText={(v) => setAdmin({ ...admin, name: v })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email (login) *"
              placeholderTextColor="rgba(71,84,103,0.45)"
              keyboardType="email-address"
              autoCapitalize="none"
              value={admin.email}
              onChangeText={(v) => setAdmin({ ...admin, email: v })}
            />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 chars) *"
              placeholderTextColor="rgba(71,84,103,0.45)"
              secureTextEntry
              value={admin.password}
              onChangeText={(v) => setAdmin({ ...admin, password: v })}
            />
          </View>

          <View style={styles.actionsBetween}>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setStepIndex(0)}
            >
              <ArrowLeft size={15} color={colors.ink} />
              <Text style={styles.outlineBtnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.amberBtn, busy && { opacity: 0.6 }]}
              onPress={createAdmin}
              disabled={busy}
              activeOpacity={0.8}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.ink} />
              ) : (
                <Plus size={15} color={colors.ink} />
              )}
              <Text style={styles.amberBtnText}>
                {busy ? "Creating…" : "Create admin"}
              </Text>
              {!busy && <ArrowRight size={15} color={colors.ink} />}
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Step 2 · Plan */}
      {stepIndex === 2 && (
        <Card title="Step 3 · Subscription plan">
          {plans.length ? (
            <View style={styles.planList}>
              {plans.map((plan) => {
                const selected = planId === plan._id;
                return (
                  <TouchableOpacity
                    key={plan._id}
                    style={[
                      styles.planCard,
                      selected && styles.planCardSelected,
                    ]}
                    onPress={() => setPlanId(plan._id)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.planName}>{plan.name}</Text>
                      <Text style={styles.planDesc}>
                        {plan.description || plan.code}
                      </Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={styles.planPrice}>
                        ₹{Number(plan.price || 0).toLocaleString("en-IN")}
                        <Text style={styles.planCycle}>
                          {plan.billingCycle === "yearly" ? "/yr" : "/mo"}
                        </Text>
                      </Text>
                      <Text style={styles.planTrial}>
                        {plan.trialDays
                          ? `${plan.trialDays}-day trial`
                          : "No trial"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text style={styles.muted}>No active plans available yet.</Text>
          )}

          <View style={styles.actionsBetween}>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setStepIndex(1)}
            >
              <ArrowLeft size={15} color={colors.ink} />
              <Text style={styles.outlineBtnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.amberBtn,
                (busy || !planId) && { opacity: 0.6 },
              ]}
              onPress={assignPlan}
              disabled={busy || !planId}
              activeOpacity={0.8}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.ink} />
              ) : null}
              <Text style={styles.amberBtnText}>
                {busy ? "Assigning…" : "Assign plan"}
              </Text>
              {!busy && <ArrowRight size={15} color={colors.ink} />}
            </TouchableOpacity>
          </View>
        </Card>
      )}

      {/* Step 3 · Launch */}
      {stepIndex === 3 && (
        <Card title="Step 4 · Launch">
          <Text style={styles.launchText}>
            <Text style={{ fontWeight: "700", color: colors.ink }}>
              {form.name || "School"}
            </Text>{" "}
            is configured, the admin account is created, and the subscription is
            assigned. Marking it live completes onboarding and it enters the
            operator dashboard.
          </Text>
          <Text style={styles.launchCode}>
            Code:{" "}
            <Text style={styles.mono}>{schoolCode || "—"}</Text>
          </Text>

          <View style={styles.actionsBetween}>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => setStepIndex(2)}
            >
              <ArrowLeft size={15} color={colors.ink} />
              <Text style={styles.outlineBtnText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.amberBtn, busy && { opacity: 0.6 }]}
              onPress={launch}
              disabled={busy}
              activeOpacity={0.8}
            >
              {busy ? (
                <ActivityIndicator size="small" color={colors.ink} />
              ) : (
                <Rocket size={15} color={colors.ink} />
              )}
              <Text style={styles.amberBtnText}>
                {busy ? "Launching…" : "Launch school"}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  mb4: {
    marginBottom: 16,
  },
  muted: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepItem: {
    alignItems: "center",
    gap: 4,
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotPast: {
    backgroundColor: "rgba(63,143,95,0.12)",
  },
  stepDotActive: {
    backgroundColor: colors.ink,
  },
  stepNum: {
    fontSize: 11,
    color: "rgba(71,84,103,0.6)",
    fontWeight: "600",
  },
  stepLabel: {
    fontSize: 10.5,
    color: "rgba(71,84,103,0.5)",
    maxWidth: 70,
    textAlign: "center",
  },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginHorizontal: 4,
    marginBottom: 14,
  },
  formGrid: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    color: colors.ink,
  },
  mono: {
    fontFamily: "monospace",
  },
  actionsEnd: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  actionsBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  amberBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.amber,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  amberBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
  },
  outlineBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  planList: {
    gap: 10,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
  },
  planCardSelected: {
    borderColor: colors.ink,
    backgroundColor: "rgba(22,33,62,0.03)",
  },
  planName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  planDesc: {
    fontSize: 12,
    color: "rgba(71,84,103,0.7)",
    marginTop: 2,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  planCycle: {
    fontSize: 11.5,
    fontWeight: "500",
    color: "rgba(71,84,103,0.7)",
  },
  planTrial: {
    fontSize: 11.5,
    color: "rgba(71,84,103,0.6)",
    marginTop: 2,
  },
  launchText: {
    fontSize: 13.5,
    color: colors.slate,
    lineHeight: 20,
  },
  launchCode: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 10,
  },
  doneRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 20,
  },
  doneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(63,143,95,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  doneTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.ink,
  },
  doneDesc: {
    fontSize: 13,
    color: "rgba(71,84,103,0.7)",
    marginTop: 4,
    lineHeight: 19,
  },
});