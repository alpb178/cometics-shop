import ParallaxScrollView from "@/components/parallax-scroll-view";
import { Heading } from "@/components/title/heading";
import { SubHeading } from "@/components/title/sub-heading";
import {
  APP_MAP_ADDRESS,
  APP_MAP_LATITUDE,
  APP_MAP_LONGITUDE,
  APP_MAP_URL,
} from "@/lib/constant/var";
import React from "react";
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

export default function Location() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <Heading heading="Estamos ubicados en:" />
      <SubHeading sub_heading={APP_MAP_ADDRESS} />

      <Pressable
        onPress={() => Linking.openURL(APP_MAP_URL)}
        style={styles.mapLink}
        accessibilityRole="link"
      >
        <Icon name="location" size={16} color="#10B981" />
        <Text style={styles.mapLinkText}>Ver ubicación en el mapa</Text>
      </Pressable>

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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },

  addressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "gray",
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
    height: 400,
    backgroundColor: "#F3F4F6",
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
