import { Stack } from "expo-router";

export default function ResultsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitle: "Scan Result",
        headerShadowVisible: false,
      }}
    />
  );
}
