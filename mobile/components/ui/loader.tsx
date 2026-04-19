import { Colors } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

export interface LoaderProps {
  visible?: boolean;
  text?: string;
  size?: "small" | "large";
  fullScreen?: boolean;
  color?: string;
}

export function Loader({
  visible = true,
  text = "Cargando...",
  size = "large",
  fullScreen = false,
  color = Colors.light.tint,
}: LoaderProps) {
  if (!visible) return null;

  const content = (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );

  if (fullScreen) {
    return (
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>{content}</View>
      </Modal>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
});
