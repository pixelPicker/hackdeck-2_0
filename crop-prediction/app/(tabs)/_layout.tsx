import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarStyle: {
          elevation: 0, // 👈 Android
          shadowColor: "transparent", // 👈 iOS
          borderTopWidth: 0, //
        },
        headerTransparent: true,
        headerStyle: { backgroundColor: "transparent" },
        headerShown: true,
        headerLeft: () => (
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              marginLeft: 16,
            }}
          >
            <ThemedText style={{ fontSize: 12, color: "#101010" }}>
              {getGreeting()}
            </ThemedText>
            <ThemedText
              style={{ fontSize: 20, color: "#101010" }}
              type="defaultMedium"
            >
              Welcome To Croppy
            </ThemedText>
          </View>
        ),
        headerRight: () => (
          <IconSymbol
            name="bell"
            size={24}
            color="#101010"
            style={{ marginRight: 16 }}
          />
        ),
        headerTitle: "",
        headerShadowVisible: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diagnose"
        options={{
          title: "Diagnose",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="camera" color={color} />
          ),
          headerLeft: undefined,
          headerRight: undefined,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="clock" color={color} />
          ),
          headerLeft: () => (
            <ThemedText
              style={{ paddingLeft: 16, fontSize: 20 }}
              type="defaultMedium"
            >
              Scan History
            </ThemedText>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  default: {},
  defaultSemiBold: {},
  title: {
    fontSize: 24,
  },
});
