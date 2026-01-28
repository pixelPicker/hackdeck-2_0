import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface ScanHistoryItem {
  id: string;
  crop_name: string;
  disease_name: string;
  confidence: number;
  image_url: string;
  created_at: string;
}

const dummyScanHistory: ScanHistoryItem[] = [
  {
    id: "1",
    crop_name: "Tomato",
    disease_name: "Early Blight",
    confidence: 85,
    image_url: "",
    created_at: "2026-01-28T14:30:00.000Z",
  },
  {
    id: "2",
    crop_name: "Potato",
    disease_name: "Healthy",
    confidence: 92,
    image_url: "",
    created_at: "2026-01-27T10:15:00.000Z",
  },
  {
    id: "3",
    crop_name: "Pepper",
    disease_name: "Bacterial Spot",
    confidence: 78,
    image_url: "",
    created_at: "2026-01-26T16:45:00.000Z",
  },
  {
    id: "4",
    crop_name: "Cucumber",
    disease_name: "Powdery Mildew",
    confidence: 81,
    image_url: "",
    created_at: "2026-01-25T09:30:00.000Z",
  },
  {
    id: "5",
    crop_name: "Tomato",
    disease_name: "Healthy",
    confidence: 95,
    image_url: "",
    created_at: "2026-01-24T15:20:00.000Z",
  },
];

function HistoryCard({ item }: { item: ScanHistoryItem }) {
  const router = useRouter();

  const getStatusColor = (diseaseName: string) => {
    if (
      diseaseName.toLowerCase().includes("healthy") ||
      diseaseName === "Healthy"
    ) {
      return "#22c55e";
    }
    if (
      diseaseName.toLowerCase().includes("severe") ||
      diseaseName.toLowerCase().includes("blight")
    ) {
      return "#dc2626";
    }
    return "#f59e0b";
  };

  const getStatusIcon = (diseaseName: string) => {
    if (
      diseaseName.toLowerCase().includes("healthy") ||
      diseaseName === "Healthy"
    ) {
      return "check-circle";
    }
    if (
      diseaseName.toLowerCase().includes("severe") ||
      diseaseName.toLowerCase().includes("blight")
    ) {
      return "alert-circle";
    }
    return "alert-triangle";
  };

  const getHealthStatus = (diseaseName: string) => {
    if (
      diseaseName.toLowerCase().includes("healthy") ||
      diseaseName === "Healthy"
    ) {
      return "Healthy";
    }
    return "Needs Attention";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePress = () => {
    router.push(`/results/${item.id}`);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <ThemedText style={styles.cropType}>{item.crop_name}</ThemedText>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.disease_name) },
            ]}
          >
            <IconSymbol
              name={getStatusIcon(item.disease_name)}
              size={14}
              color="#fff"
            />
            <ThemedText style={styles.statusText}>
              {getHealthStatus(item.disease_name)}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.date}>
          {formatDate(item.created_at)}
        </ThemedText>
      </View>

      {item.disease_name &&
        !item.disease_name.toLowerCase().includes("healthy") && (
          <View style={styles.diseaseRow}>
            <ThemedText style={styles.diseaseLabel}>Detected:</ThemedText>
            <ThemedText style={styles.diseaseName}>
              {item.disease_name}
            </ThemedText>
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
          {item.confidence.toFixed(0)}%
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

export default function TabThreeScreen() {
  return (
    <ThemedView style={styles.container}>
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
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingBottom: 16,
    backgroundColor: "#fff",
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
