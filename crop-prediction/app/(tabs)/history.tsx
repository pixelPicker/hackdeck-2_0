import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabThreeScreen() {
  return (
    <ThemedView style={styles.container}>
      <IconSymbol name="leaf" size={48} color="#22c55e" />

      <ThemedText type="title" style={styles.title}>
        No scans yet
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Your crop diagnosis history will appear here.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
});
