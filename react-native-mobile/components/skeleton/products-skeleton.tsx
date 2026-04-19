import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Skeleton, SkeletonCard } from "./skeleton";

export function ProductsSkeleton() {
  const renderItem = () => (
    <View style={styles.productCardContainer}>
      <SkeletonCard showImage={true} showText={true} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Skeleton height={32} width="40%" borderRadius={8} />
      </View>
      <FlatList
        data={Array.from({ length: 6 })}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#F5F5F5",
    margin: 20,
    borderRadius: 8,
  },
  listContainer: {
    padding: 16,
  },
  productCardContainer: {
    width: "45%",
    margin: 10,
  },
});


