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
  Text,
  ActivityIndicator,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { DiagnosisResult } from "@/types/Result";
import CircularProgress from "@/components/ui/CircularProgress";
import { IconSymbol } from "@/components/ui/icon-symbol";
import diseasesData from "@/data/diseases.json";
import GeminiChatbotComponent from "@/components/GeminiChatbot";
import { useEffect, useState } from "react";

function ResultHighlight({
  result,
  id,
}: {
  result: DiagnosisResult;
  id: string;
}) {
  const getHealthStatusColor = (isHealthy: boolean, diseaseName: string) => {
    if (isHealthy) return "#22c55e";
    if (
      diseaseName.toLowerCase().includes("severe") ||
      diseaseName.toLowerCase().includes("blight")
    )
      return "#dc2626";
    return "#f59e0b";
  };

  const getHealthStatusText = (isHealthy: boolean, diseaseName: string) => {
    if (isHealthy) return "Healthy";
    return diseaseName || "Unknown Disease";
  };

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
          {result.crop_name} - {result.disease_name}
        </ThemedText>
        <View
          style={[
            styles.severityBadge,
            {
              backgroundColor: getHealthStatusColor(
                result.is_healthy,
                result.disease_name,
              ),
            },
          ]}
        >
          <ThemedText style={styles.severityText}>
            {getHealthStatusText(result.is_healthy, result.disease_name)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.confidenceChart}>
        <CircularProgress
          progress={result.confidence * 100}
          size={150}
          strokeWidth={12}
        >
          <View style={styles.circleCenter}>
            <ThemedText style={styles.confidencePercent}>
              {(Number(result.confidence) * 100).toFixed(2)}%
            </ThemedText>
            <ThemedText style={styles.confidenceLabel}>Confidence</ThemedText>
          </View>
        </CircularProgress>
      </View>

      <View style={styles.metadataContainer}>
        <View style={styles.metadataItem}>
          <ThemedText style={styles.metadataLabel}>Model Version:</ThemedText>
          <ThemedText style={styles.metadataValue}>
            {result.model_version}
          </ThemedText>
        </View>
        <View style={styles.metadataItem}>
          <ThemedText style={styles.metadataLabel}>Scan Date:</ThemedText>
          <ThemedText style={styles.metadataValue}>
            {new Date(result.created_at).toLocaleDateString()}
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

function ChatbotContainer({ result }: { result: DiagnosisResult }) {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: "user" | "bot" }[]
  >([
    {
      id: "1",
      text: `Hello! I'm here to help you with your ${result.crop_name} diagnosis for ${result.disease_name}. What would you like to know?`,
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  // const handleSendMessage = () => {
  //   if (input.trim()) {
  //     const userMsg = {
  //       id: Date.now().toString(),
  //       text: input,
  //       sender: "user" as const,
  //     };
  //     // setMessages((prev) => [...prev, userMsg]);
  //     setInput("");

  //     // Simulate bot response
  //     setTimeout(() => {
  //       const botResponses = [
  //         `That's a great question about treatment. ${result.suggestions[0] || "Consult an agricultural expert"} is recommended for this condition.`,
  //         `For prevention, ${result.suggestions[1] || "Regular monitoring is essential"} is very effective.`,
  //         `The confidence level of this diagnosis is ${result.confidence}%, which indicates strong detection.`,
  //         `This condition is classified as ${result.is_healthy ? "healthy" : "needs attention"}. Please monitor closely.`,
  //       ];
  //       const randomResponse =
  //         botResponses[Math.floor(Math.random() * botResponses.length)];
  //       setMessages((prev) => [
  //         ...prev,
  //         { id: Date.now().toString(), text: randomResponse, sender: "bot" },
  //       ]);
  //     }, 500);
  //   }
  // };

  return (
    <>
      <TouchableOpacity
        style={styles.chatbotButton}
        onPress={() => setChatbotOpen(true)}
      >
        <IconSymbol size={24} name="chat" color={"#fff"} />
      </TouchableOpacity>

      <Modal
        visible={chatbotOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setChatbotOpen(false)}
      >
        <View style={styles.chatbotOverlay}>
          <View style={styles.chatbotPopup}>
            <View style={styles.chatbotHeader}>
              <ThemedText style={styles.chatbotTitle}>
                Plant Assistant
              </ThemedText>
              <TouchableOpacity onPress={() => setChatbotOpen(false)}>
                <ThemedText style={styles.chatbotClose}>✕</ThemedText>
              </TouchableOpacity>
            </View>

            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageBubble,
                    item.sender === "user"
                      ? styles.userMessage
                      : styles.botMessage,
                  ]}
                >
                  <ThemedText style={styles.messageText}>
                    {item.text}
                  </ThemedText>
                </View>
              )}
              style={styles.chatbotMessages}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "flex-end",
              }}
            />

            <View style={styles.chatbotInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask a question..."
                placeholderTextColor="#999"
                value={input}
                onChangeText={setInput}
                // onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                style={styles.sendButton}
                // onPress={handleSendMessage}
              >
                <ThemedText style={styles.sendButtonText}>Send</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function ResultData({ result }: { result: DiagnosisResult }) {
  const openResearchLink = (query: string) => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.dataContainer}>
      {/* Suggestions Section */}
      {result.suggestions.length > 0 && (
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeader}>Recommendations</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardScroll}
          >
            {result.suggestions.map((suggestion, index) => (
              <View key={index} style={styles.card}>
                <ThemedText style={styles.cardTitle}>
                  {index === 0
                    ? "Primary"
                    : index === 1
                      ? "Secondary"
                      : `Additional ${index + 1}`}
                </ThemedText>
                <ThemedText style={styles.cardContent}>{suggestion}</ThemedText>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Top Predictions Section */}
      {result.top_3_predictions.length > 0 && (
        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionHeader}>Top Predictions</ThemedText>
          <View style={styles.predictionsContainer}>
            {result.top_3_predictions.map((prediction, index) => (
              <View key={index} style={styles.predictionItem}>
                <View style={styles.predictionHeader}>
                  <ThemedText style={styles.predictionRank}>
                    #{index + 1}
                  </ThemedText>
                  <ThemedText style={styles.predictionConfidence}>
                    {prediction.confidence.toFixed(1)}%
                  </ThemedText>
                </View>
                <ThemedText style={styles.predictionCrop}>
                  {prediction.crop_name}
                </ThemedText>
                <ThemedText style={styles.predictionDisease}>
                  {prediction.disease_name}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Quality Metrics Section */}
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionHeader}>Image Quality</ThemedText>
        <View style={styles.qualityContainer}>
          <View style={styles.qualityItem}>
            <ThemedText style={styles.qualityLabel}>Overall Score</ThemedText>
            <ThemedText style={styles.qualityValue}>
              {result.quality_metrics.quality_score.toFixed(0)}%
            </ThemedText>
          </View>
          <View style={styles.qualityItem}>
            <ThemedText style={styles.qualityLabel}>Blur Score</ThemedText>
            <ThemedText style={styles.qualityValue}>
              {result.quality_metrics.blur_score.toFixed(0)}%
            </ThemedText>
          </View>
          <View style={styles.qualityItem}>
            <ThemedText style={styles.qualityLabel}>Brightness</ThemedText>
            <ThemedText style={styles.qualityValue}>
              {result.quality_metrics.brightness.toFixed(0)}%
            </ThemedText>
          </View>
        </View>
        {!result.quality_metrics.is_acceptable && (
          <View style={styles.qualityWarning}>
            <IconSymbol name="alert-triangle" size={16} color="#f59e0b" />
            <ThemedText style={styles.qualityWarningText}>
              Image quality issues detected:{" "}
              {result.quality_metrics.issues.join(", ")}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Research Section */}
      <View style={styles.sectionContainer}>
        <ThemedText style={styles.sectionHeader}>Research</ThemedText>
        <View style={styles.linkContainer}>
          <View style={styles.linkCard}>
            <ThemedText style={styles.linkTitle}>
              Learn more about {result.disease_name} in {result.crop_name}
            </ThemedText>
            <ThemedText
              style={styles.linkButton}
              onPress={() =>
                openResearchLink(
                  `${result.crop_name} ${result.disease_name} treatment prevention`,
                )
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
                openResearchLink(
                  `${result.crop_name} ${result.disease_name} treatment local`,
                )
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
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiagnosisResult();
  }, [id]);

  const fetchDiagnosisResult = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("So what are we doin");
      // Replace with your actual API endpoint
      const response = await fetch(
        `https://bb58c48f2a48.ngrok-free.app/api/v1/diagnosis/${id}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DiagnosisResult = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error fetching diagnosis result:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load diagnosis result",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#feb03b" />
        <ThemedText style={styles.loadingText}>
          Loading diagnosis result...
        </ThemedText>
      </View>
    );
  }

  if (error || !result) {
    return (
      <View style={styles.errorContainer}>
        <IconSymbol name="alert-circle" size={48} color="#dc2626" />
        <ThemedText style={styles.errorTitle}>Error Loading Result</ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error || "Result not found"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton}>
          <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <ResultHighlight result={result} id={id || ""} />
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
  // New styles for dynamic content
  metadataContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  metadataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metadataLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  metadataValue: {
    fontSize: 14,
    color: "#101010",
    fontWeight: "600",
  },
  predictionsContainer: {
    gap: 12,
  },
  predictionItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  predictionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  predictionRank: {
    fontSize: 16,
    fontWeight: "700",
    color: "#feb03b",
  },
  predictionConfidence: {
    fontSize: 14,
    fontWeight: "600",
    color: "#101010",
  },
  predictionCrop: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  predictionDisease: {
    fontSize: 16,
    fontWeight: "600",
    color: "#101010",
  },
  qualityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  qualityItem: {
    alignItems: "center",
    flex: 1,
  },
  qualityLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
    textAlign: "center",
  },
  qualityValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101010",
  },
  qualityWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  qualityWarningText: {
    fontSize: 12,
    color: "#92400e",
    marginLeft: 8,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf6f1",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf6f1",
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#101010",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#feb03b",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#101010",
  },
});
