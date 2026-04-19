import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text } from "react-native";

export interface HeadingProps {
  heading: string;
}

export function Heading({ heading }: { heading: string }) {
  return <Text style={styles.heading}>{heading}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 12,
  },
});
