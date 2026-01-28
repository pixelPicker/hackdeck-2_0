// Fallback for using MaterialIcons on Android and web.

import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";

type IconLib = "Feather" | "FontAwesome6";

type IconConfig = {
  lib: IconLib;
  name: string;
};

const ICON_MAP: Record<string, IconConfig> = {
  // BOTTOMBAR ICONS
  house: { lib: "Feather", name: "home" },
  camera: { lib: "Feather", name: "camera" },
  clock: { lib: "Feather", name: "clock" },
  user: { lib: "Feather", name: "user" },
  chat: { lib: "Feather", name: "message-square" },

  settings: { lib: "Feather", name: "settings" },
  bell: { lib: "Feather", name: "bell" },

  leaf: { lib: "FontAwesome6", name: "leaf" },
  wheat: { lib: "FontAwesome6", name: "wheat-awn" },
  plant: { lib: "FontAwesome6", name: "seedling" },
};

type IconName = keyof typeof ICON_MAP;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
}) {
  const icon = ICON_MAP[name];

  if (!icon) {
    console.warn(`Icon "${name}" not found in ICON_MAP`);
    return null;
  }

  if (icon.lib === "FontAwesome6") {
    return (
      <FontAwesome6
        name={icon.name as any}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  return (
    <Feather name={icon.name as any} size={size} color={color} style={style} />
  );
}
