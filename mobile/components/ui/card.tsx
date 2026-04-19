import React from "react";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
  margin?: number;
  shadow?: boolean;
}

export interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
  size?: "sm" | "md" | "lg";
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
  numberOfLines?: number;
}

export function Card({
  children,
  style,
  padding = 16,
  margin = 0,
  shadow = true,
}: CardProps) {
  return (
    <View
      style={[styles.card, shadow && styles.shadow, { padding, margin }, style]}
    >
      {children}
    </View>
  );
}

export function CardTitle({ children, style, size = "md" }: CardTitleProps) {
  return (
    <Text
      style={[
        styles.title,
        styles[`title${size.charAt(0).toUpperCase() + size.slice(1)}`],
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function CardDescription({
  children,
  style,
  numberOfLines,
}: CardDescriptionProps) {
  return (
    <Text style={[styles.description, style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  titleSm: {
    fontSize: 16,
  },
  titleMd: {
    fontSize: 18,
  },
  titleLg: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
});
