import React from "react";
import { StyleSheet, View } from "react-native";
import { Bullet } from "./utils";

export type DeliveryOption = "delivery" | "pickup";

interface HomeProps {
  title: string;
  description: string;
  image: string;
}

export function Home({ title, description, image }: HomeProps) {
  return (
    <View style={styles.cardBody}>
      <Bullet text="Te llevamos el producto hasta tu casa" />
      <Bullet text="Entrega en 24-72 horas" />
      <Bullet text="Costo de envío a cotizar" />
    </View>
  );
}

const styles = StyleSheet.create({
  cardBody: {
    marginTop: 4,
  },
});
