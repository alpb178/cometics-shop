import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Skeleton, SkeletonText } from "./skeleton";

export function ProductDetailSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Gallery */}
      <Skeleton width="100%" height={350} borderRadius={0} />

      {/* Title */}
      <View style={styles.titleSection}>
        <Skeleton height={32} width="80%" borderRadius={8} />
      </View>

      {/* Price */}
      <View style={styles.priceSection}>
        <Skeleton height={40} width="50%" borderRadius={8} />
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Skeleton height={24} width="40%" style={{ marginBottom: 12 }} />
        <SkeletonText lines={4} />
      </View>

      {/* Quantity Selector */}
      <View style={styles.quantitySection}>
        <Skeleton height={24} width="30%" style={{ marginBottom: 12 }} />
        <Skeleton height={48} width={150} borderRadius={8} />
      </View>

      {/* Delivery Options */}
      <View style={styles.deliverySection}>
        <Skeleton height={24} width="50%" style={{ marginBottom: 16 }} />
        <View style={styles.deliveryOption}>
          <Skeleton width={16} height={16} borderRadius={8} />
          <Skeleton height={16} width="60%" style={{ marginLeft: 8 }} />
        </View>
        <View style={styles.deliveryCard}>
          <Skeleton height={20} width="40%" style={{ marginBottom: 12 }} />
          <SkeletonText lines={3} />
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsSection}>
        <Skeleton
          height={52}
          width="100%"
          borderRadius={12}
          style={{ marginBottom: 12 }}
        />
        <Skeleton height={52} width="100%" borderRadius={12} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  priceSection: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  descriptionSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  quantitySection: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  deliverySection: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  deliveryOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  deliveryCard: {
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  buttonsSection: {
    marginBottom: 24,
  },
});
