import { View, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol";

interface HomeStatsProps {
  totalScans?: number;
  highRisk?: number;
}

function HomeStats({ totalScans = 12, highRisk = 3 }: HomeStatsProps) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <IconSymbol
          name="camera"
          size={32}
          style={styles.statIcon}
          color="#4a63c7"
        />
        <ThemedText style={styles.statValue}>{totalScans}</ThemedText>
        <ThemedText style={styles.statLabel}>Total Scans</ThemedText>
      </View>

      <View style={styles.statCard}>
        <IconSymbol name="alert-circle" size={32} color="#dc2626" />
        <ThemedText style={styles.statValue}>{highRisk}</ThemedText>
        <ThemedText style={styles.statLabel}>High Risk</ThemedText>
      </View>
    </View>
  );
}

export default HomeStats;

const styles = StyleSheet.create({
  statsContainer: {
    width: "100%",
    flexDirection: "row" as const,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fafafa",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center" as const,
  },
  statIcon: { marginRight: "auto" },
  statValue: {
    fontSize: 36,
    fontWeight: "700" as const,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 2,
  },
});
