import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText } from "./themed-text";

interface CameraScreenProps {
  onPhotoCapture: (photoUri: string) => void;
}

export function CameraScreen({ onPhotoCapture }: CameraScreenProps) {
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [flashMode, setFlashMode] = useState<"on" | "off" | "auto">("off");
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  React.useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
    })();
  }, [permission]);

  const handleTakePicture = async () => {
    if (!cameraRef.current || !cameraReady) {
      Alert.alert("Camera not ready", "Please wait a moment and try again");
      return;
    }

    try {
      setIsCapturing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });
      onPhotoCapture(photo.uri);
    } catch (error) {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
      console.error(error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleUploadFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onPhotoCapture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from gallery");
      console.error(error);
    }
  };

  const toggleFlash = () => {
    setFlashMode((current) => {
      if (current === "off") return "on";
      if (current === "on") return "auto";
      return "off";
    });
  };

  const getFlashIcon = () => {
    switch (flashMode) {
      case "on":
        return "flash";
      case "auto":
        return "flash-auto";
      default:
        return "flash-off";
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <ThemedText style={styles.permissionText}>
          Camera permission is required to use this feature
        </ThemedText>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <ThemedText style={styles.permissionButtonText}>
            Grant Permission
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        flash={flashMode}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.bottomContent}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadFromGallery}
            disabled={isCapturing}
          >
            <MaterialCommunityIcons
              name="image-plus"
              size={28}
              color="#444444"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shutterButton,
              isCapturing && styles.shutterButtonDisabled,
            ]}
            onPress={handleTakePicture}
            disabled={isCapturing}
          >
            {isCapturing ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <View style={styles.shutterButtonInner} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flashButton}
            onPress={toggleFlash}
            disabled={isCapturing}
          >
            <MaterialCommunityIcons
              name={getFlashIcon() as any}
              size={28}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },

  flashButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "44444444",
    justifyContent: "center",
    alignItems: "center",
  },

  uploadButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomContent: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 32,
    paddingHorizontal: 24,
  },
  shutterButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#444444",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  shutterButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "white",
  },
  shutterButtonDisabled: {
    opacity: 0.6,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: "#feb03b",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
