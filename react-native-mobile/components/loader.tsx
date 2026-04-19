import { Loader } from "@/components";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "./ui/button";

export default function LoaderComponent({
  isBusy,
  error,
  onRefresh,
}: {
  isBusy: boolean;
  error?: Error;
  onRefresh?: () => void;
}) {
  if (isBusy) {
    return (
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            marginBottom: 10,
            marginTop: 10,
          }}
          resizeMode="contain"
        />
        <Loader text="Cargando contenido..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Image
          source={require("@/assets/images/icon.png")}
          style={{
            width: 150,
            height: 150,
            borderRadius: 75,
            marginBottom: 10,
            marginTop: 10,
          }}
          resizeMode="contain"
        />
        <Text style={styles.errorText}>Error al cargar el contenido</Text>
        <Button
          title="Reintentar"
          variant="outline"
          onPress={onRefresh || (() => {})}
          iconPosition="left"
          style={{ marginTop: 15 }}
        />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#800202",
    textAlign: "center",
  },
});
