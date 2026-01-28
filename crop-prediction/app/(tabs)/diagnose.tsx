import { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { CameraScreen } from "@/components/camera-screen";
import { PhotoPreview } from "@/components/photo-preview";
import { Image } from "expo-image";
import { Pulse } from "@/components/ui/Pulse";

type ScreenState = "empty" | "camera" | "preview" | "processing";

export default function TabTwoScreen() {
  const [screenState, setScreenState] = useState<ScreenState>("empty");
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [isModelProcessing, setIsModelProcessing] = useState(false);

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

  const handleSubmit = () => {
    setIsModelProcessing(true);
    setScreenState("processing");

    // Mock demo response for testing chatbot (replace API call)
    setTimeout(() => {
      const demoId = Math.random().toString(36).substring(7);
      setSelectedPhotoUri(null);
      setIsModelProcessing(false);
      setScreenState("empty");
      router.push({ pathname: "/results/[id]", params: { id: demoId } });
    }, 2000);
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

  if (screenState === "processing" && isModelProcessing) {
    return (
      <ThemedView style={styles.container}>
        <Pulse>
          <Image
            source={require("@/assets/images/circle-leaf.png")}
            style={{ width: 150, height: 150 }}
            contentFit="contain"
          />
        </Pulse>
        <ThemedText style={{}}>
          Please wait while the model is processing
        </ThemedText>
      </ThemedView>
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
