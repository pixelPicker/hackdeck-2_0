import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export function Shimmer({
  width,
  height,
  borderRadius = 12,
}: {
  width: number;
  height: number;
  borderRadius?: number;
}) {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: "#e6e6e6",
        overflow: "hidden",
      }}
    >
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <View
            style={{
              width,
              height,
              borderRadius,
              backgroundColor: "#000",
            }}
          />
        }
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={["#e6e6e6", "#f5f5f5", "#e6e6e6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: width * 2, height }}
          />
        </Animated.View>
      </MaskedView>
    </View>
  );
}

export function ShimmerOverlay({
  width,
  height,
  borderRadius = 12,
}: {
  width: number;
  height: number;
  borderRadius?: number;
}) {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: width,
        duration: 1400,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  return (
    <View style={[styles.overlay, { width, height, borderRadius }]}>
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <View
            style={{
              width,
              height,
              borderRadius,
              backgroundColor: "black",
            }}
          />
        }
      >
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX }],
          }}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.05)",
              "rgba(255,255,255,0.35)",
              "rgba(255,255,255,0.05)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: width * 2, height }}
          />
        </Animated.View>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.15)", // dim image slightly
    overflow: "hidden",
  },
});
