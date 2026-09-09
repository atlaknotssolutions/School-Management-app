import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";

type DrawerToggleProps = {
  size?: number;
  color?: string;
  backgroundColor?: string;
};

export default function DrawerToggle({
  size = 24,
  color = "#fff",
  backgroundColor = "#16213E",
}: DrawerToggleProps) {
  const navigation = useNavigation();

  const openDrawer = () => {
    // Drawer navigation object has openDrawer / closeDrawer / toggleDrawer
    // @ts-ignore
    if (navigation?.openDrawer) {
      // @ts-ignore
      navigation.openDrawer();
    } else if (navigation?.dispatch) {
      // fallback
      // @ts-ignore
      navigation.dispatch({ type: "OPEN_DRAWER" });
    }
  };

  return (
    <Pressable onPress={openDrawer} style={[styles.button, { backgroundColor }]}>
      <Ionicons name="menu" size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});