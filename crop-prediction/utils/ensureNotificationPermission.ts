import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

const NOTIF_KEY = "notification_permission_asked";

export async function ensureNotificationPermission() {
  const alreadyAsked = await AsyncStorage.getItem(NOTIF_KEY);

  // If we already asked before, just check status
  if (alreadyAsked) {
    const settings = await Notifications.getPermissionsAsync();
    return settings.status === "granted";
  }

  // First time asking
  const { status } = await Notifications.requestPermissionsAsync();

  await AsyncStorage.setItem(NOTIF_KEY, "true");

  return status === "granted";
}
