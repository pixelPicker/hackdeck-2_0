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

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      onSubmit(photoUri);
    } catch (error) {
      Alert.alert("Error", "Failed to submit photo");
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </View>

      <View style={styles.actionsContainer}>
        <ThemedText style={styles.label}>
          Review your photo before submitting
        </ThemedText>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.retakeButton]}
            onPress={onRetake}
            disabled={isSubmitting}
          >
            <MaterialCommunityIcons
              name="camera-rear"
              size={24}
              color="#22c55e"
            />
            <ThemedText style={styles.retakeButtonText}>Retake</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={24} color="white" />
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
    paddingVertical: 32,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 24,
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
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  retakeButton: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1.5,
    borderColor: "#22c55e",
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e",
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
