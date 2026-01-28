import { StyleSheet } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";
import { IconSymbol } from "./ui/icon-symbol";
import LastScanSummary from "./LastScanSummary";
import HomeStats from "./HomeStats";

function HomeDashboard() {
  return (
    <ThemedView style={styles.heroCard}>
      <ThemedText
        type="defaultMedium"
        style={{
          color: "#101010",
          fontSize: 24,
          textAlign: "left",
        }}
      >
        Your Last Scan Summary
      </ThemedText>
      <LastScanSummary />
      <HomeStats />
    </ThemedView>
  );
}

export default HomeDashboard;

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#0000",
    padding: 16,
    marginBottom: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
});
