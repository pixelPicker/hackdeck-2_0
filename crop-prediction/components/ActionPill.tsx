import { StyleSheet, View } from "react-native";
import { ThemedText } from "./themed-text";
import { IconSymbol } from "./ui/icon-symbol.ios";

export function ActionPill({ icon, label }: { icon: any; label: string }) {
  return (
    <View style={styles.pill}>
      <IconSymbol name={icon} size={18} color="#4a63c7" />
      <ThemedText style={styles.pillText}>{label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f4ff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  pillText: {
    marginLeft: 6,
    fontSize: 14,
  },
});
