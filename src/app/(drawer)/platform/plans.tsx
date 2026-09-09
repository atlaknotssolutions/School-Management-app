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
    <View style={styles.screen}>
      <View style={styles.toggleRow}>
        <DrawerToggle />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
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
  price: { color: "#16213E", fontSize: 18, fontWeight: "700", marginTop: 8 },
});
