import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Skeleton, SkeletonText } from "./skeleton";

export function ContentSkeleton() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Title */}
        <Skeleton height={32} width="60%" borderRadius={8} style={{ marginBottom: 24 }} />

        {/* Multiple content blocks */}
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} style={styles.contentBlock}>
            <Skeleton height={24} width="50%" borderRadius={6} style={{ marginBottom: 16 }} />
            <SkeletonText lines={4} />
            {index < 2 && <View style={styles.spacer} />}
          </View>
        ))}

        {/* Image placeholder */}
        <View style={styles.imageBlock}>
          <Skeleton width="100%" height={200} borderRadius={12} />
        </View>

        {/* More text */}
        <View style={styles.contentBlock}>
          <SkeletonText lines={3} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  contentBlock: {
    marginBottom: 24,
  },
  spacer: {
    height: 24,
  },
  imageBlock: {
    marginVertical: 24,
  },
});


