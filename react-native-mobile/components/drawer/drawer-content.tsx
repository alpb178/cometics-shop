import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
  aboutAppItems,
  aboutUsItems,
  locationItems,
  sharedItems,
} from "./drawer-items";

export function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menú</Text>
      </View>

      {sharedItems.map((item) => (
        <DrawerItem
          key={item.route}
          label={item.label}
          activeTintColor="#22C55E"
          inactiveTintColor="#666"
          icon={({ color, size }) => (
            <Icon name={item.icon} size={size} color={color} />
          )}
          onPress={() => {
            router.push(item.route as any);
            props.navigation.closeDrawer();
          }}
        />
      ))}

      <View style={styles.separator} />

      <Text style={styles.sectionTitle}>Sobre la aplicación</Text>
      {aboutAppItems.map((item) => (
        <DrawerItem
          key={item.route}
          label={item.label}
          icon={({ color, size }) => (
            <Icon name={item.icon} size={size} color={color} />
          )}
          activeTintColor="#22C55E"
          inactiveTintColor="#666"
          onPress={() => {
            router.push(item.route as any);
            props.navigation.closeDrawer();
          }}
        />
      ))}

      <Text style={styles.sectionTitle}>Sobre nosotros</Text>

      <View style={styles.separator} />
      {aboutUsItems.map((item) => (
        <DrawerItem
          key={item.route}
          label={item.label}
          icon={({ color, size }) => (
            <Icon name={item.icon} size={size} color={color} />
          )}
          activeTintColor="#22C55E"
          inactiveTintColor="#666"
          onPress={() => {
            router.push(item.route as any);
            props.navigation.closeDrawer();
          }}
        />
      ))}

      <Text style={styles.sectionTitle}>Donde estamos</Text>

      <View style={styles.separator} />
      {locationItems.map((item) => (
        <DrawerItem
          key={item.route}
          label={item.label}
          icon={({ color, size }) => (
            <Icon name={item.icon} size={size} color={color} />
          )}
          activeTintColor="#22C55E"
          inactiveTintColor="#666"
          onPress={() => {
            router.push(item.route as any);
            props.navigation.closeDrawer();
          }}
        />
      ))}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
});
