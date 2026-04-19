import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Skeleton, SkeletonCircle } from "./skeleton";

export function CartSkeleton() {
  const renderItem = () => (
    <View style={styles.itemContainer}>
      <Skeleton width={80} height={80} borderRadius={8} />
      <View style={styles.itemInfo}>
        <Skeleton height={18} width="80%" style={{ marginBottom: 8 }} />
        <Skeleton height={14} width="40%" style={{ marginBottom: 12 }} />
        <View style={styles.quantityRow}>
          <Skeleton height={36} width={100} borderRadius={8} />
          <SkeletonCircle size={36} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={Array.from({ length: 3 })}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Skeleton height={20} width="30%" />
          <Skeleton height={24} width="40%" />
        </View>
        <Skeleton height={52} width="100%" borderRadius={12} style={{ marginBottom: 12 }} />
        <Skeleton height={44} width="100%" borderRadius={12} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 200,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
});


