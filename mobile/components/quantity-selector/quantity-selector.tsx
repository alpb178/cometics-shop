import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import Icon from "react-native-vector-icons/Ionicons";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

export interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <ThemedView style={styles.quantityContainer}>
      <ThemedText type="subtitle" style={styles.title}>
        Cantidad
      </ThemedText>
      <View style={styles.quantitySelector}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleDecrease}
          disabled={disabled}
        >
          <Icon name="remove" size={20} color="#666" />
        </TouchableOpacity>
        <ThemedText style={styles.quantityText}>{quantity}</ThemedText>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={handleIncrease}
          disabled={disabled}
        >
          <Icon name="add" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  quantityContainer: {
    marginBottom: 24,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 4,
    alignSelf: "flex-start",
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: "center",
  },
});
