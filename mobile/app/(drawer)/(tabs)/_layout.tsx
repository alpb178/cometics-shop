import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useCart } from "@/hooks/use-cart";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { APP_NAME } from "@/lib/constant/var";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { cart } = useCart();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "dark"].tint,
        headerShown: true,
        headerTitle: APP_NAME,
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 18,
        },
        headerLeft: () => (
          <Pressable
            onPress={openDrawer}
            style={styles.menuButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={styles.iconContainer}>
              <Icon name="menu-outline" size={28} color="#000000" />
            </View>
          </Pressable>
        ),
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: APP_NAME,
          headerTitle: APP_NAME,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          tabBarLabel: "",
          tabBarIcon: () => <Icon name="home" size={30} color="#000000" />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: APP_NAME,
          headerTitle: APP_NAME,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          tabBarLabel: "",
          tabBarIcon: () => (
            <View style={styles.cartIconContainer}>
              <Icon name="cart" size={30} color="#000000" />
              {cart.itemCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cart.itemCount > 99 ? "99+" : cart.itemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="faq"
        options={{
          href: null, // Ocultar del tab bar
        }}
      />
      <Tabs.Screen
        name="products/[slug]/index"
        options={{
          href: null, // Ocultar del tab bar
          headerShown: true,
          headerTitle: APP_NAME,
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
        }}
      />
      <Tabs.Screen
        name="how-it-works"
        options={{
          href: null, // Ocultar del tab bar
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          href: null, // Ocultar del tab bar
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          href: null, // Ocultar del tab bar
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          href: null, // Ocultar del tab bar
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cartIconContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: -8,
    top: -8,
    backgroundColor: "#F44336",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
