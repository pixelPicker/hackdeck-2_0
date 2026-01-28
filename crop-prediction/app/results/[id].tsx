import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";
import { DiagnosisResult } from "@/types/Result";

function ResultHighlight({
  result,
  id,
}: {
  result: DiagnosisResult;
  id: string;
}) {
  const circleSize = 150;

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
        <View style={styles.circleContainer}>
          <View style={styles.circleBackground} />
          <View
            style={[
              styles.circleProgress,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                borderLeftColor:
                  result.confidence > 80
                    ? "#4CAF50"
                    : result.confidence > 60
                      ? "#FF9800"
                      : "#F44336",
                transform: [{ rotate: "-90deg" }],
              },
            ]}
          />
          <View style={styles.circleCenter}>
            <ThemedText style={styles.confidencePercent}>
              {result.confidence}%
            </ThemedText>
            <ThemedText style={styles.confidenceLabel}>Confidence</ThemedText>
          </View>
        </View>
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
    confidence: 98.5,
    treatment: "Apply copper-based fungicide",
    prevention: "Avoid overhead watering",
    isSevere: true,
  };

  return (
    <ScrollView style={styles.container}>
      <ResultHighlight result={result} id={id} />
      <ResultData result={result} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf6f1",
  },
  highlightContainer: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 48,
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
    backgroundColor: "#ddd",
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
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#101010",
    marginBottom: 12,
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
    fontSize: 12,
    color: "#feb03b",
    fontWeight: "600",
  },
});
