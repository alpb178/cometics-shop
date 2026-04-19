import {
  APP_MAP_LATITUDE,
  APP_MAP_LONGITUDE,
  APP_MAP_URL,
} from "@/lib/constant/var";
import React, { useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";
import { Bullet } from "./utils";

export function Store() {
  const [miniMapVisible] = useState(true);

  return (
    <View style={styles.cardBody}>
      <Bullet text="Ven a recoger tu pedido cuando esté listo" />
      <Bullet text="Listo de 24 a 48 horas" />
      <Bullet text="Sin costo adicional" />
      <Bullet text="Horarios: 10:00 - 18:00" />
      {miniMapVisible && (
        <View style={styles.miniMapContainer}>
          <MapView
            provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
            style={styles.miniMap}
            initialRegion={{
              latitude: APP_MAP_LATITUDE,
              longitude: APP_MAP_LONGITUDE,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            zoomEnabled={false}
            mapType="standard"
          >
            <Marker
              coordinate={{
                latitude: APP_MAP_LATITUDE,
                longitude: APP_MAP_LONGITUDE,
              }}
              title="Tienda"
              description="Recoger aquí"
            />
          </MapView>
        </View>
      )}
      <Pressable
        onPress={() => Linking.openURL(APP_MAP_URL)}
        style={styles.mapLink}
        accessibilityRole="link"
      >
        <Icon name="location" size={16} color="#10B981" />
        <Text style={styles.mapLinkText}>Ver ubicación en el mapa</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardBody: {
    marginTop: 4,
  },

  miniMapContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  miniMap: {
    width: "100%",
    height: 140,
    backgroundColor: "#F3F4F6",
  },
  mapFallbackText: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 12,
  },
  mapLink: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  mapLinkText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "600",
  },
});
