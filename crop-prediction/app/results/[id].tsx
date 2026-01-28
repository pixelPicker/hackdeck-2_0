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

// // Enhanced knowledge-based response generator with fuzzy matching for short queries
// function getKnowledgeBasedResponse(
//   userQuery: string,
//   diseaseName: string,
// ): string {
//   const query = userQuery.toLowerCase().trim();
//   const words = query.split(/\s+/);

//   const disease = (diseasesData as any).diseases.find(
//     (d: any) =>
//       d.name.toLowerCase() === diseaseName.toLowerCase() ||
//       d.scientificName.toLowerCase().includes(diseaseName.toLowerCase()) ||
//       d.commonNames?.some(
//         (cn: string) => cn.toLowerCase() === diseaseName.toLowerCase(),
//       ),
//   );

//   if (!disease) {
//     return "I couldn't find information about this disease. Could you provide more details?";
//   }

//   // Helper function to check for keyword matches (flexible for short queries)
//   const hasKeyword = (keywords: string[], checkWords: string[] = words) => {
//     return keywords.some((kw: string) =>
//       checkWords.some(
//         (w: string) => kw.includes(w) || w.includes(kw.substring(0, 3)),
//       ),
//     );
//   };

//   // Check for symptom-related short queries
//   if (
//     hasKeyword([
//       "symptom",
//       "sign",
//       "look",
//       "appear",
//       "see",
//       "show",
//       "mark",
//       "spot",
//       "lesion",
//       "spot",
//     ]) ||
//     (query.match(/^(what|how|any|what's|what\s)/i) &&
//       words.some((w) => ["symptom", "sign", "spot", "mark"].includes(w)))
//   ) {
//     const symptoms = disease.symptoms || [];
//     const symptomsText = symptoms.slice(0, 4).join(", ");
//     return `📍 Symptoms of ${disease.name}: ${symptomsText}. These typically develop on lower leaves or in humid conditions.`;
//   }

//   // Cause/why queries (very short)
//   if (
//     hasKeyword([
//       "cause",
//       "why",
//       "origin",
//       "trigger",
//       "source",
//       "agent",
//       "pathogen",
//       "infect",
//     ]) ||
//     query === "why" ||
//     query === "cause" ||
//     query === "how"
//   ) {
//     return `🔬 ${disease.name} is caused by ${disease.causes[0]}. Spreads through ${disease.causes[1] || "water and spores"}. Conditions: ${disease.conditions.temperature}, ${disease.conditions.humidity} humidity.`;
//   }

//   // Treatment/spray (very short)
//   if (
//     hasKeyword([
//       "treat",
//       "spray",
//       "chemical",
//       "fix",
//       "cure",
//       "solve",
//       "remedy",
//       "product",
//       "drug",
//     ]) ||
//     (query.includes("what") && query.includes("use")) ||
//     query === "treat" ||
//     query === "spray" ||
//     query === "fix"
//   ) {
//     const treatments = disease.treatment.chemical || [];
//     const treatment =
//       treatments.slice(0, 3).join(", ") || disease.treatment.immediate?.[0];
//     return `💊 Treatment: ${treatment}. Apply every ${disease.treatment.frequency}. Actions: ${disease.treatment.immediate?.[0] || "Remove infected parts"}`;
//   }

//   // Prevention (very short)
//   if (
//     hasKeyword([
//       "prevent",
//       "avoid",
//       "stop",
//       "protect",
//       "defense",
//       "shield",
//       "safe",
//     ]) ||
//     query === "prevent" ||
//     query === "how prevent" ||
//     query.includes("prevent")
//   ) {
//     const preventions = disease.prevention || [];
//     return `🛡️ Prevention: ${preventions.slice(0, 2).join(" • ")}. Best during ${disease.conditions.seasonality}.`;
//   }

//   // Organic/biological (very short)
//   if (
//     hasKeyword(["organic", "bio", "natural", "green", "safe", "ecological"]) ||
//     query === "organic" ||
//     query === "bio" ||
//     query === "natural"
//   ) {
//     const bioAgents = disease.treatment.biological || [];
//     return `🌱 Organic options: ${bioAgents.join(", ")}. Natural but slower acting than chemicals.`;
//   }

//   // Risk/when/conditions (very short)
//   if (
//     hasKeyword([
//       "risk",
//       "when",
//       "condition",
//       "weather",
//       "temperature",
//       "humid",
//       "wet",
//       "spread",
//     ]) ||
//     query === "risk" ||
//     query === "when" ||
//     query === "weather"
//   ) {
//     const risks = disease.riskFactors || [];
//     return `⚠️ Risk factors: ${risks.slice(0, 2).join(", ")}. Thrives in ${disease.conditions.temperature} temp, ${disease.conditions.humidity} humidity.`;
//   }

//   // Severity/danger/damage (very short)
//   if (
//     hasKeyword([
//       "severe",
//       "danger",
//       "damage",
//       "bad",
//       "loss",
//       "impact",
//       "serious",
//     ]) ||
//     query === "severe" ||
//     query === "bad" ||
//     query === "danger"
//   ) {
//     return `🚨 Severity: ${disease.severity} | Impact: ${disease.economicImpact}. Early action is critical!`;
//   }

//   // How long/duration/cycle
//   if (
//     hasKeyword([
//       "long",
//       "duration",
//       "cycle",
//       "lifespan",
//       "time",
//       "generation",
//       "stages",
//     ]) ||
//     query === "how long" ||
//     query === "duration" ||
//     query === "cycle"
//   ) {
//     return `⏱️ Disease cycle: ${disease.lifespan}. Repeat treatment every 7-10 days during infection.`;
//   }

//   // Where/zone/region (very short)
//   if (
//     hasKeyword([
//       "where",
//       "zone",
//       "region",
//       "area",
//       "place",
//       "found",
//       "climate",
//     ]) ||
//     query === "where" ||
//     query === "zone"
//   ) {
//     return `📍 Found in: ${disease.zoneAffected.join(", ")}. Common in areas with matching temperature/humidity.`;
//   }

//   // Cost/price/cheap
//   if (
//     hasKeyword(["cost", "price", "cheap", "expensive", "afford"]) ||
//     query === "cost" ||
//     query === "price"
//   ) {
//     return `💰 Fungicides: Low to Medium cost. Biological controls: Medium to High cost. Consider both effectiveness and budget.`;
//   }

//   // Crop/plant specific
//   if (
//     hasKeyword(["crop", "plant", "tomato", "potato", "pepper"]) ||
//     query.includes("plant")
//   ) {
//     const crops = disease.affectedCrops || [];
//     return `🌾 Affects: ${crops.join(", ")}. Each may show slightly different symptoms.`;
//   }

//   // Spread/transmission (very short)
//   if (
//     hasKeyword([
//       "spread",
//       "transmit",
//       "move",
//       "travel",
//       "wind",
//       "water",
//       "touch",
//     ]) ||
//     query === "spread" ||
//     query === "how spread"
//   ) {
//     return `🔄 Spreads via: ${disease.causes.slice(1, 3).join(", ")}. Avoid overhead watering and working in wet fields.`;
//   }

//   // Resistant varieties
//   if (
//     hasKeyword(["resist", "variety", "var", "breed", "type", "strong"]) ||
//     query === "resistant"
//   ) {
//     return `🌟 Use resistant varieties labeled VF, FF, or N codes. Choose varieties suited to your region's disease pressure.`;
//   }

//   // Spray schedule
//   if (
//     hasKeyword(["schedule", "when", "frequency", "often", "timing"]) ||
//     query === "when" ||
//     query === "schedule"
//   ) {
//     return `📅 Apply every ${disease.treatment.frequency}. Start before conditions become favorable. Peak during ${disease.conditions.seasonality}.`;
//   }

//   // Quick yes/no style responses for very short queries
//   if (words.length === 1 || query.length < 5) {
//     const word = words[0];

//     if (word === "yes" || word === "no" || word === "ok" || word === "what") {
//       return `${disease.name} Details: Severity=${disease.severity}, Affects ${disease.affectedCrops.join("/")}. Optimal conditions: ${disease.conditions.temperature}°C, ${disease.conditions.humidity}. Ask about symptoms, treatment, prevention, or how to spread.`;
//     }
//   }

//   // Fallback: provide comprehensive overview
//   return `📋 ${disease.name} Overview: Severity ${disease.severity}, affects ${disease.affectedCrops.join(", ")}. Optimal: ${disease.conditions.temperature}, ${disease.conditions.humidity}. Key steps: ${disease.prevention[0]}. Ask about symptoms, treatment, causes, prevention, or any other aspect!`;
// }

// function ChatbotContainer({ result }: { result: DiagnosisResult }) {
//   const [chatbotOpen, setChatbotOpen] = useState(false);
//   const [messages, setMessages] = useState<
//     { id: string; text: string; sender: "user" | "bot" }[]
//   >([
//     {
//       id: "1",
//       text: `Hello! I'm your Plant Health Assistant. I have comprehensive knowledge about ${result.diagnosis} and can answer questions about symptoms, treatment, prevention, and more. What would you like to know?`,
//       sender: "bot",
//     },
//   ]);
//   const [input, setInput] = useState("");

//   const handleSendMessage = () => {
//     if (input.trim()) {
//       const userMsg = {
//         id: Date.now().toString(),
//         text: input,
//         sender: "user" as const,
//       };
//       setMessages((prev) => [...prev, userMsg]);
//       setInput("");

//       setTimeout(() => {
//         const botResponse = getKnowledgeBasedResponse(input, result.diagnosis);
//         setMessages((prev) => [
//           ...prev,
//           { id: Date.now().toString(), text: botResponse, sender: "bot" },
//         ]);
//       }, 500);
//     }
//   };

//   return (
//     <>
//       <TouchableOpacity
//         style={styles.chatbotButton}
//         onPress={() => setChatbotOpen(true)}
//       >
//         <IconSymbol size={24} name="chat" color={"#fff"} />
//       </TouchableOpacity>

//       <Modal
//         visible={chatbotOpen}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setChatbotOpen(false)}
//       >
//         <View style={styles.chatbotOverlay}>
//           <View style={styles.chatbotPopup}>
//             <View style={styles.chatbotHeader}>
//               <ThemedText style={styles.chatbotTitle}>
//                 Plant Assistant
//               </ThemedText>
//               <TouchableOpacity onPress={() => setChatbotOpen(false)}>
//                 <ThemedText style={styles.chatbotClose}>✕</ThemedText>
//               </TouchableOpacity>
//             </View>

//             <FlatList
//               data={messages}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <View
//                   style={[
//                     styles.messageBubble,
//                     item.sender === "user"
//                       ? styles.userMessage
//                       : styles.botMessage,
//                   ]}
//                 >
//                   <ThemedText style={styles.messageText}>
//                     {item.text}
//                   </ThemedText>
//                 </View>
//               )}
//               style={styles.chatbotMessages}
//               contentContainerStyle={{
//                 flexGrow: 1,
//                 justifyContent: "flex-end",
//               }}
//             />

//             <View style={styles.chatbotInput}>
//               <TextInput
//                 style={styles.textInput}
//                 placeholder="Ask a question..."
//                 placeholderTextColor="#999"
//                 value={input}
//                 onChangeText={setInput}
//                 onSubmitEditing={handleSendMessage}
//               />
//               <TouchableOpacity
//                 style={styles.sendButton}
//                 onPress={handleSendMessage}
//               >
//                 <ThemedText style={styles.sendButtonText}>Send</ThemedText>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }

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
