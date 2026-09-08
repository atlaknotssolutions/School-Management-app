import { Card, PageIntro } from "@/components/UI";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.subscriptions
      .list()
      .then(({ data }: any) => setSubscriptions(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <PageIntro eyebrow="Platform Owner · Billing" title="Subscriptions" />
      {loading ? (
        <ActivityIndicator color="#E8A33D" />
      ) : subscriptions.length ? (
        subscriptions.map((subscription) => (
          <Card
            key={subscription._id}
            title={subscription.school?.name || "School subscription"}
          >
            <Text style={styles.detail}>
              {subscription.plan?.name || "No plan"} ·{" "}
              {subscription.status || "unknown"}
            </Text>
          </Card>
        ))
      ) : (
        <Card>
          <Text style={styles.detail}>No subscriptions found.</Text>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F5F0" },
  content: { padding: 16, paddingBottom: 40 },
  detail: { color: "#475467", fontSize: 13 },
});
