import { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { useFocusEffect } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CameraScreen } from "@/components/camera-screen";
import { PhotoPreview } from "@/components/photo-preview";

type ScreenState = "empty" | "camera" | "preview";

export default function TabTwoScreen() {
  const [screenState, setScreenState] = useState<ScreenState>("empty");
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);

  useFocusEffect(() => {
    if (screenState === "empty") {
      setScreenState("camera");
    }
  });

  const handlePhotoCapture = (photoUri: string) => {
    setSelectedPhotoUri(photoUri);
    setScreenState("preview");
  };

  const handleRetake = () => {
    setSelectedPhotoUri(null);
    setScreenState("camera");
  };

  const handleSubmit = (photoUri: string) => {
    // TODO: Call ML model API here
    Alert.alert("Success", `Photo submitted for analysis:\n${photoUri}`);
    // After successful submission, you might want to reset to empty state
    setSelectedPhotoUri(null);
    setScreenState("empty");
  };

  if (screenState === "camera") {
    return <CameraScreen onPhotoCapture={handlePhotoCapture} />;
  }

  if (screenState === "preview" && selectedPhotoUri) {
    return (
      <PhotoPreview
        photoUri={selectedPhotoUri}
        onRetake={handleRetake}
        onSubmit={handleSubmit}
      />
    );
  }

  return (
    <ThemedView style={styles.container}>
      <IconSymbol name="leaf" size={48} color="#22c55e" />

      <ThemedText type="title" style={styles.title}>
        No scans yet
      </ThemedText>

      <ThemedText style={styles.subtitle}>
        Click the camera button below to start a crop diagnosis
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.7,
  },
});
