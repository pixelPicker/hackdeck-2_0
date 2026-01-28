import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { ActionPill } from "@/components/ActionPill";
import { useState } from "react";
import { router } from "expo-router";
import HomeDashboard from "@/components/HomeDashboard";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

export default function HomeScreen() {
  const [hasSubmittedShit, setHasSubmittedShit] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#faf6f1",
      }}
    >
      {/* 🔵 HERO CARD */}
      {hasSubmittedShit ? (
        <HomeDashboard />
      ) : (
        <ThemedView
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignSelf: "center",
            backgroundColor: "#0000",
          }}
        >
          <Image
            source={require("@/assets/images/empty-leaf.png")}
            style={{ width: 350, height: 250 }}
            contentFit="contain"
          />
          <ThemedText
            type="defaultMedium"
            style={{
              color: "#101010",
              fontSize: 24,
              textAlign: hasSubmittedShit ? "left" : "center",
            }}
          >
            No scans yet.{"\n"}Try your first scan.
          </ThemedText>
          <Pressable
            style={styles.scanButton}
            onPress={() => router.push("/diagnose")}
          >
            <IconSymbol name="camera" size={20} color="#101010" />
            <ThemedText style={styles.scanText}>Scan Leaf</ThemedText>
          </Pressable>
        </ThemedView>
      )}
      {/* ⚪ RECENT / EMPTY STATE */}
      {/* <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Recent Scan</ThemedText>
        <ThemedText style={{ opacity: 0.7 }}>
          No scans yet. Scan your first crop to get started.
        </ThemedText>
      </ThemedView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 160,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 22,
    marginTop: 12,
    color: "#fff",
  },
  subtitle: {
    marginTop: 4,
    color: "#e0e6ff",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#feb03b",
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    borderRadius: 999,
    marginTop: 20,
  },
  scanText: {
    marginLeft: 8,
    color: "#101010",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  section: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#fafafa",
  },
});
