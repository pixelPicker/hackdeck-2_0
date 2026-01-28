import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Linking,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { useState } from "react";

import { ThemedText } from "@/components/themed-text";
import { DiagnosisResult } from "@/types/Result";
import CircularProgress from "@/components/ui/CircularProgress";
import { IconSymbol } from "@/components/ui/icon-symbol";
import diseasesData from "@/data/diseases.json";
import GeminiChatbotComponent from "@/components/GeminiChatbot";

function ResultHighlight({
  result,
  id,
}: {
  result: DiagnosisResult;
  id: string;
}) {
  return (
    <View style={styles.highlightContainer}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Diagnosis Result
        </ThemedText>
        <ThemedText style={styles.scanId}>Scan ID: {id}</ThemedText>
      </View>

      <View style={styles.diagnosisHeader}>
        <ThemedText type="subtitle" style={styles.diagnosisTitle}>
          {result.diagnosis}
        </ThemedText>
        <View
          style={[
            styles.severityBadge,
            { backgroundColor: result.isSevere ? "#feb03b" : "#666" },
          ]}
        >
          <ThemedText style={styles.severityText}>
            {result.isSevere ? "Severe" : "Mild"}
          </ThemedText>
        </View>
      </View>

      <View style={styles.confidenceChart}>
        <CircularProgress
          progress={result.confidence}
          size={150}
          strokeWidth={12}
        >
          <View style={styles.circleCenter}>
            <ThemedText style={styles.confidencePercent}>
              {Number(result.confidence).toFixed(
                Number.isInteger(result.confidence) ? 0 : 1,
              )}
              %
            </ThemedText>
            <ThemedText style={styles.confidenceLabel}>Confidence</ThemedText>
          </View>
        </CircularProgress>
      </View>
    </View>
  );
}

function ResultData({ result }: { result: DiagnosisResult }) {
  const openResearchLink = (query: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.dataContainer}>
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionHeader}>Treatment</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardScroll}
        >
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Primary Treatment</ThemedText>
            <ThemedText style={styles.cardContent}>
              {result.treatment}
            </ThemedText>
          </View>
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Alternative</ThemedText>
            <ThemedText style={styles.cardContent}>
              Apply organic neem oil spray
            </ThemedText>
          </View>
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Emergency</ThemedText>
            <ThemedText style={styles.cardContent}>
              Remove affected plants immediately
            </ThemedText>
          </View>
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionHeader}>Prevention</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.cardScroll}
        >
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Water Management</ThemedText>
            <ThemedText style={styles.cardContent}>
              {result.prevention}
            </ThemedText>
          </View>
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Crop Rotation</ThemedText>
            <ThemedText style={styles.cardContent}>
              Rotate crops every 2-3 years
            </ThemedText>
          </View>
          <View style={styles.card}>
            <ThemedText style={styles.cardTitle}>Monitoring</ThemedText>
            <ThemedText style={styles.cardContent}>
              Regular inspection for early signs
            </ThemedText>
          </View>
        </ScrollView>
      </View>

      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionHeader}>Research</ThemedText>
        <View style={styles.linkContainer}>
          <View style={styles.linkCard}>
            <ThemedText style={styles.linkTitle}>
              Learn more about {result.diagnosis}
            </ThemedText>
            <ThemedText
              style={styles.linkButton}
              onPress={() =>
                openResearchLink(`${result.diagnosis} treatment prevention`)
              }
            >
              Research →
            </ThemedText>
          </View>
          <View style={styles.linkCard}>
            <ThemedText style={styles.linkTitle}>
              Find local solutions
            </ThemedText>
            <ThemedText
              style={styles.linkButton}
              onPress={() =>
                openResearchLink(`${result.diagnosis} treatment local`)
              }
            >
              Local Solutions →
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const result: DiagnosisResult = {
    diagnosis: "Late Blight",
    confidence: 91,
    treatment: ["Apply copper-based fungicide"],
    prevention: ["Avoid overhead watering"],
    isSevere: true,
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ResultHighlight result={result} id={id} />
        <ResultData result={result} />
      </ScrollView>
      <GeminiChatbotComponent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf6f1",
  },
  highlightContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  dataContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  headerTitle: {
    color: "#101010",
    marginBottom: 8,
  },
  scanId: {
    color: "#666",
    fontSize: 14,
  },
  diagnosisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  diagnosisTitle: {
    color: "#ff0000",
    fontWeight: "bold",
    flex: 1,
    fontSize: 24,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  severityText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  confidenceChart: {
    alignItems: "center",
    marginVertical: 20,
  },
  circleContainer: {
    width: 150,
    height: 150,
    position: "relative",
  },
  circleBackground: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 12,
    borderColor: "#e0e0e0",
  },

  circleProgress: {
    position: "absolute",
    borderWidth: 12,
    borderColor: "transparent",
    borderTopWidth: 12,
  },
  circleCenter: {
    position: "absolute",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  confidencePercent: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#101010",
  },
  confidenceLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#101010",
    marginBottom: 8,
  },
  chatbotContainer: {
    position: "absolute",
    right: 8,
    bottom: 8,
  },
  cardScroll: {
    marginHorizontal: -8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 8,
    width: 200,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#101010",
    marginBottom: 8,
  },
  cardContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 18,
  },
  linkContainer: {
    gap: 12,
  },
  linkCard: {
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#101010",
    flex: 1,
  },
  linkButton: {
    fontSize: 10,
    color: "#feb03b",
    fontWeight: "600",
  },
  chatbotButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#feb03b",
    justifyContent: "center",
    alignItems: "center",
  },
  chatbotButtonText: {
    fontSize: 28,
  },
  chatbotOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  chatbotPopup: {
    height: Dimensions.get("window").height * 0.7,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    flexDirection: "column",
  },
  chatbotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatbotTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#101010",
  },
  chatbotClose: {
    fontSize: 24,
    color: "#666",
  },
  chatbotMessages: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageBubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
    borderRadius: 12,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#feb03b",
    borderBottomRightRadius: 0,
    marginBottom: 4,
    minWidth: 80,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 0,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: "#101010",
  },
  chatbotInput: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: "#101010",
  },
  sendButton: {
    backgroundColor: "#feb03b",
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#101010",
  },
});
