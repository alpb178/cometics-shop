import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemedText } from "../themed-text";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  inStock?: boolean;
}

export interface ProductCardProps {
  product: any;
  onPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  style?: any;
}

export function ProductCard({
  product,
  onPress,
  onAddToCart,
  style,
}: ProductCardProps) {
  const formatPrice = (price: number, currency?: string) => {
    return new Intl.NumberFormat("es-CU", {
      style: "currency",
      currency: currency || "BOB",
    }).format(price);
  };

  return (
    <Card style={styles.container}>
      <TouchableOpacity onPress={() => onPress(product)}>
        <Image source={{ uri: product.images[0].url }} style={styles.image} />
        <View style={styles.content}>
          <CardTitle size="sm">{product.name}</CardTitle>
          <ThemedText style={styles.price}>
            {formatPrice(product.price)}
          </ThemedText>

          <View style={styles.footer}>
            <Button
              title="Agregar"
              size="sm"
              variant="outline"
              onPress={() => onAddToCart(product)}
              icon={<Icon name="cart" size={20} color="#4CAF50" />}
              iconPosition="left"
              disabled={product.inStock === false}
              color="#4CAF50"
              style={{ borderColor: "#4CAF50" }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 60,
    borderColor: "#4CAF50",
  },
  image: {
    width: "100%",
    height: 100,

    marginBottom: 12,
  },
  content: {
    flex: 1,
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4CAF50",
  },
});
