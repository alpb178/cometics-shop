import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Home } from "./home";
import { Store } from "./store";

export type DeliveryOption = "delivery" | "pickup";

interface DeliveryOptionsProps {
  selected: DeliveryOption;
  onChange: (option: DeliveryOption) => void;
}

export function DeliveryOptions({ selected, onChange }: DeliveryOptionsProps) {
  const isDelivery = selected === "delivery";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Opción de entrega:</Text>

      {/* Radios */}
      <View style={styles.optionsRow}>
        <Pressable
          onPress={() => onChange("delivery")}
          style={styles.optionItem}
          accessibilityRole="radio"
          accessibilityState={{ selected: isDelivery }}
        >
          <View style={[styles.radio, isDelivery && styles.radioChecked]} />
          <Icon
            name="car"
            size={16}
            color="#F59E0B"
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Envío a domicilio</Text>
        </Pressable>

        <Pressable
          onPress={() => onChange("pickup")}
          style={styles.optionItem}
          accessibilityRole="radio"
          accessibilityState={{ selected: !isDelivery }}
        >
          <View style={[styles.radio, !isDelivery && styles.radioChecked]} />
          <Icon
            name="business"
            size={16}
            color="#10B981"
            style={styles.optionIcon}
          />
          <Text style={styles.optionText}>Recoger en tienda</Text>
        </Pressable>
      </View>

      {/* Detail card */}
      <View
        style={[
          styles.card,
          isDelivery ? styles.cardDelivery : styles.cardPickup,
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Icon
            name={isDelivery ? "car" : "storefront"}
            size={18}
            color={isDelivery ? "#F59E0B" : "#10B981"}
          />
          <Text style={styles.cardTitle}>
            {isDelivery ? "Envío a domicilio" : "Recoger en tienda"}
          </Text>
        </View>
        {isDelivery ? (
          <Home
            title="Envío a domicilio"
            description="Te llevamos el producto hasta tu casa"
            image="https://via.placeholder.com/150"
          />
        ) : (
          <Store />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "600",
  },
  optionsRow: {
    flexDirection: "column",
    gap: 16,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  radioChecked: {
    borderColor: "#22C55E",
    backgroundColor: "#22C55E",
  },
  optionIcon: {
    marginRight: 6,
  },
  optionText: {
    color: "#111827",
    fontSize: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
    padding: 16,
    borderRadius: 12,
  },
  cardDelivery: {
    backgroundColor: "#F9FEF9",
  },
  cardPickup: {
    backgroundColor: "#F7FBFF",
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
});
