import { CustomDrawerContent } from "@/components/drawer/drawer-content";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#22C55E",
        drawerInactiveTintColor: "#666",
        drawerStyle: {
          backgroundColor: "#FFFFFF",
          width: 280,
        },
        drawerType: "front",
        drawerLabelStyle: {
          marginLeft: -20,
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}
