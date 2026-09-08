import { Card, PageIntro } from "@/components/UI";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";

export default function Plans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.plans
      .list()
      .then(({ data }: any) => setPlans(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <PageIntro eyebrow="Platform Owner · Billing" title="Plans & Pricing" />
      {loading ? (
        <ActivityIndicator color="#E8A33D" />
      ) : plans.length ? (
        plans.map((plan) => (
          <Card key={plan._id} title={plan.name || "Unnamed plan"}>
            <Text style={styles.detail}>
              {plan.description || "Platform subscription plan"}
            </Text>
            <Text style={styles.price}>₹{plan.price ?? 0}</Text>
          </Card>
        ))
      ) : (
        <Card>
          <Text style={styles.detail}>No plans configured yet.</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F5F0" },
  content: { padding: 16, paddingBottom: 40 },
  detail: { color: "#475467", fontSize: 13 },
  price: { color: "#16213E", fontSize: 18, fontWeight: "700", marginTop: 8 },
});
