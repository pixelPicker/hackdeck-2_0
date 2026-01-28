import { StyleSheet, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface ScanHistoryItem {
  id: string;
  date: string;
  cropType: string;
  healthStatus: "Healthy" | "Moderate Risk" | "High Risk";
  disease?: string;
  confidence: number;
  imageUrl?: string;
}

const dummyScanHistory: ScanHistoryItem[] = [
  {
    id: "1",
    date: "Jan 28, 2026 - 2:30 PM",
    cropType: "Tomato",
    healthStatus: "Moderate Risk",
    disease: "Early Blight",
    confidence: 85,
  },
  {
    id: "2",
    date: "Jan 27, 2026 - 10:15 AM",
    cropType: "Potato",
    healthStatus: "Healthy",
    confidence: 92,
  },
  {
    id: "3",
    date: "Jan 26, 2026 - 4:45 PM",
    cropType: "Pepper",
    healthStatus: "High Risk",
    disease: "Bacterial Spot",
    confidence: 78,
  },
  {
    id: "4",
    date: "Jan 25, 2026 - 9:30 AM",
    cropType: "Cucumber",
    healthStatus: "Moderate Risk",
    disease: "Powdery Mildew",
    confidence: 81,
  },
  {
    id: "5",
    date: "Jan 24, 2026 - 3:20 PM",
    cropType: "Tomato",
    healthStatus: "Healthy",
    confidence: 95,
  },
];

function HistoryCard({ item }: { item: ScanHistoryItem }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Healthy":
        return "#22c55e";
      case "Moderate Risk":
        return "#f59e0b";
      case "High Risk":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Healthy":
        return "check-circle";
      case "Moderate Risk":
        return "alert-triangle";
      case "High Risk":
        return "alert-circle";
      default:
        return "help-circle";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <ThemedText style={styles.cropType}>{item.cropType}</ThemedText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.healthStatus) },
            ]}
          >
            <IconSymbol
              name={getStatusIcon(item.healthStatus)}
              size={14}
              color="#fff"
            />
            <ThemedText style={styles.statusText}>
              {item.healthStatus}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
      </View>

      {item.disease && (
        <View style={styles.diseaseRow}>
          <ThemedText style={styles.diseaseLabel}>Detected:</ThemedText>
          <ThemedText style={styles.diseaseName}>{item.disease}</ThemedText>
        </View>
      )}

      <View style={styles.confidenceRow}>
        <ThemedText style={styles.confidenceLabel}>Confidence:</ThemedText>
        <View style={styles.confidenceBar}>
          <View
            style={[styles.confidenceFill, { width: `${item.confidence}%` }]}
          />
        </View>
        <ThemedText style={styles.confidenceValue}>
          {item.confidence}%
        </ThemedText>
      </View>
    </View>
  );
}

export default function TabThreeScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <IconSymbol name="leaf" size={32} color="#22c55e" />
        <ThemedText type="title" style={styles.title}>
          Scan History
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {dummyScanHistory.map((item) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    marginLeft: 12,
    fontSize: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cropType: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#6b7280",
  },
  diseaseRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  diseaseLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginRight: 8,
  },
  diseaseName: {
    fontSize: 14,
    color: "#dc2626",
    fontWeight: "600",
  },
  confidenceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
    marginRight: 12,
    minWidth: 80,
  },
  confidenceBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginRight: 12,
  },
  confidenceFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    minWidth: 40,
    textAlign: "right",
  },
});
