import { DrawerToggle } from "@/components/PlatformSidebar";
import { PlatformTabBar } from "@/components/PlatformTabBar";
import { Card, PageIntro } from "@/components/UI";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
    <View style={styles.screen}>
      <View style={styles.toggleRow}>
        <DrawerToggle />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
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
      <PlatformTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7F5F0" },
  toggleRow: {
    backgroundColor: "#16213E",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "flex-start",
  },
  content: { padding: 16, paddingBottom: 40 },
  detail: { color: "#475467", fontSize: 13 },
});
