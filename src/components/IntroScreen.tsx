import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const INTRO_VIDEO = require("../../assets/expo.icon/School_Management_app_intro_animation.mp4");

export default function IntroScreen() {
  const router = useRouter();
  const player = useVideoPlayer(INTRO_VIDEO, (videoPlayer) => {
    videoPlayer.loop = false;
    videoPlayer.muted = true;   // ← video muted
    videoPlayer.play();
  });

  const continueToApp = async () => {
    const user = await AsyncStorage.getItem("erp_user");
    router.replace(user ? ("/(drawer)" as any) : "/login");
  };

  useEffect(() => {
    const subscription = player.addListener("playToEnd", continueToApp);
    return () => subscription.remove();
  }, [player]);

  return (
    <View style={styles.screen}>
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      <View style={styles.copy}>
        <Text style={styles.title}>School Management</Text>
        <Text style={styles.subtitle}>
          One platform for every school operation
        </Text>
        <ActivityIndicator color="#E8A33D" style={styles.loader} />
        <Pressable style={styles.continueButton} onPress={continueToApp}>
          <Text style={styles.continueText}>Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#16213E",
  },
  copy: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    backgroundColor: "rgba(22,33,62,0.82)",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  loader: {
    marginTop: 18,
  },
  continueButton: {
    marginTop: 18,
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: "#E8A33D",
  },
  continueText: {
    color: "#16213E",
    fontSize: 14,
    fontWeight: "700",
  },
});