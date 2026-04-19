import { Colors } from "@/constants/theme";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  icon,
  iconPosition = "right",
  style,
  textStyle,
  color,
}: ButtonProps) {
  const buttonStyle = [
    styles(color).base,
    styles(color)[variant],
    styles(color)[size],
    disabled && styles(color).disabled,
    style,
  ];

  const textStyleCombined = [
    styles(color).text,
    styles(color)[`${variant}Text`],
    styles(color)[`${size}Text`],
    disabled && styles(color).disabledText,
    textStyle,
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <ActivityIndicator
            size="small"
            color={variant === "primary" ? "#FFFFFF" : Colors.light.tint}
          />
          <Text style={[textStyleCombined, { marginLeft: 8 }]}>
            Cargando...
          </Text>
        </>
      );
    }

    if (icon && iconPosition === "left") {
      return (
        <>
          {icon}
          <Text style={[textStyleCombined, { marginLeft: 8 }]}>{title}</Text>
        </>
      );
    }

    if (icon && iconPosition === "right") {
      return (
        <>
          <Text style={[textStyleCombined, { marginRight: 8 }]}>{title}</Text>
          {icon}
        </>
      );
    }

    return <Text style={textStyleCombined}>{title}</Text>;
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = (color?: string) =>
  StyleSheet.create({
    base: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    primary: {
      backgroundColor: Colors.light.tint,
    },
    secondary: {
      backgroundColor: "#F5F5F5",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: Colors.light.tint,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    sm: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 36,
    },
    md: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 44,
    },
    lg: {
      paddingHorizontal: 24,
      paddingVertical: 16,
      minHeight: 52,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontWeight: "600",
      textAlign: "center",
    },
    primaryText: {
      color: color || "#FFFFFF",
    },
    secondaryText: {
      color: color || "#333333",
    },
    outlineText: {
      color: color || Colors.light.tint,
    },
    ghostText: {
      color: color || Colors.light.tint,
    },
    smText: {
      fontSize: 14,
    },
    mdText: {
      fontSize: 16,
    },
    lgText: {
      fontSize: 18,
    },
    disabledText: {
      opacity: 0.7,
    },
  });
