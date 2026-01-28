import { View, StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";

interface LastScanSummaryProps {
  cropType?: string;
  date?: string;
  healthStatus?: string;
  recommendations?: string[];
}

function LastScanSummary({
  cropType = "Tomato",
  date = "Jan 28, 2026",
  healthStatus = "Moderate Risk",
  recommendations = [
    "Early blight detected",
    "Increase air circulation",
    "Apply fungicide treatment",
  ],
}: LastScanSummaryProps) {
  return (
    <View style={styles.summaryCard}>
      <ThemedView style={styles.summaryRow}>
        <ThemedText style={styles.summaryLabel}>Crop Type:</ThemedText>
        <ThemedText style={styles.summaryValue}>{cropType}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryRow}>
        <ThemedText style={styles.summaryLabel}>Date:</ThemedText>
        <ThemedText style={styles.summaryValue}>{date}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryRow}>
        <ThemedText style={styles.summaryLabel}>Health Status:</ThemedText>
        <ThemedText style={[styles.summaryValue, styles.healthStatus]}>
          {healthStatus}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.recommendationsSection}>
        <ThemedText style={styles.recommendationsTitle}>
          Recommendations:
        </ThemedText>
        {recommendations.map((recommendation, index) => (
          <ThemedView key={index} style={styles.recommendationItem}>
            <IconSymbol name="check-circle" size={16} color="#10b981" />
            <ThemedText style={styles.recommendationText}>
              {recommendation}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </View>
  );
}

export default LastScanSummary;

const styles = StyleSheet.create({
  summaryCard: {
    width: "100%",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 16,
    color: "#1f2937",
  },
  summaryRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500" as const,
  },
  summaryValue: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "600" as const,
  },
  healthStatus: {
    color: "#f59e0b",
  },
  recommendationsSection: {
    marginTop: 16,
  },
  recommendationsTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 8,
    color: "#1f2937",
  },
  recommendationItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 13,
    color: "#4b5563",
    marginLeft: 8,
    flex: 1,
  },
});
