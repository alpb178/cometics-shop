import React from "react";
import { StyleSheet, Text } from "react-native";

export interface SubHeadingProps {
  sub_heading: string;
}

export function SubHeading({ sub_heading }: SubHeadingProps) {
  return <Text style={styles.subHeading}>{sub_heading}</Text>;
}

const styles = StyleSheet.create({
  subHeading: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
});
