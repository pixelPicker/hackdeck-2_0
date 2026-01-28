import { View, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

interface StatsProps {
  scans?: number;
  highRisk?: number;
}

function Stats({ scans = 12, highRisk = 3 }: StatsProps) {
  return (
    <View style={styles.statGrid}>
      <View style={styles.statCard}>
        <IconSymbol
          name="camera"
          size={32}
          style={styles.statIcon}
          color="#4a63c7"
        />
        <ThemedText style={styles.statValue}>{scans}</ThemedText>
        <ThemedText style={styles.statLabel}>Scans</ThemedText>
      </View>

      <View style={styles.statCard}>
        <IconSymbol name="alert-circle" size={32} color="#dc2626" />
        <ThemedText style={styles.statValue}>{highRisk}</ThemedText>
        <ThemedText style={styles.statLabel}>High Risk</ThemedText>
      </View>
    </View>
  );
}

export default Stats;

const styles = StyleSheet.create({
  statGrid: {
    width: "100%",
    display: "flex",
    flexDirection: "row" as const,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fafafa",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  statIcon: { marginRight: "auto" },
  statValue: {
    fontSize: 36,
    fontWeight: "700",
    marginTop: 6,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
});
