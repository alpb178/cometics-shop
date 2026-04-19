import { StyleSheet, Text, View } from "react-native";

export function Bullet({ text }: { text: string }) {
  return (
    <View style={styles.bulletRow}>
      <View style={styles.bulletDot} />
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bulletRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#34D399",
    marginRight: 8,
  },
  bulletText: {
    color: "#4B5563",
    fontSize: 13,
  },
});
