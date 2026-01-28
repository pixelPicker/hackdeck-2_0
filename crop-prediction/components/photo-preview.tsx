import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "./themed-text";
import { LocalDatabase } from "@/services/local-db";
import { diagnosisApi } from "@/services/api";

interface PhotoPreviewProps {
  photoUri: string;
  onRetake: () => void;
  onSubmit: (photoUri: string) => void;
}

export function PhotoPreview({
  photoUri,
  onRetake,
  onSubmit,
}: PhotoPreviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleSubmit = async () => {
  //   try {
  //     setIsSubmitting(true);

  //     // Upload to backend for inference
  //     console.log("Uploading image for backend inference...");
  //     const result = await diagnosisApi.uploadScan(photoUri);

  //     // Save to local database
  //     await LocalDatabase.saveScan({
  //       crop_name: result.cropName,
  //       disease_name: result.diseaseName,
  //       confidence: result.confidence,
  //       image_uri: photoUri,
  //       quality_score: result.qualityScore || 85,
  //       timestamp: new Date().toISOString(),
  //       is_synced: 1, // Already synced since we got response
  //     });

  //     Alert.alert(
  //       "✅ Diagnosis Complete",
  //       `Crop: ${result.cropName}\n` +
  //         `Disease: ${result.diseaseName}\n` +
  //         `Confidence: ${(result.confidence * 100).toFixed(1)}%\n\n` +
  //         `${result.isHealthy ? "🌱 Plant is healthy!" : "⚠️ Treatment required"}`,
  //       [
  //         {
  //           text: "View Details",
  //           onPress: () => onSubmit(photoUri),
  //         },
  //       ],
  //     );
  //   } catch (error) {
  //     console.error("Diagnosis error:", error);
  //     Alert.alert(
  //       "❌ Error",
  //       "Failed to analyze the image. Make sure you're connected to the internet.",
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setIsSubmitting(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </View>

      <View style={styles.actionsContainer}>
        <View
          style={{
            gap: 8,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="information-outline"
            size={16}
            color="#666"
          />
          <ThemedText style={styles.label}>
            Review your photo before submitting
          </ThemedText>
        </View>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={onRetake}
            disabled={isSubmitting}
          >
            <ThemedText style={styles.retakeButtonText}>Retake</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  actionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
    textAlign: "center",
    color: "#666",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  retakeButton: {
    backgroundColor: "#ddd",
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  submitButton: {
    backgroundColor: "#22c55e",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});
