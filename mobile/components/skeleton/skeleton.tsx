import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: "#E0E0E0",
          opacity,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCircle({ size = 40 }: { size?: number }) {
  return <Skeleton width={size} height={size} borderRadius={size / 2} />;
}

export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <View>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          style={{
            marginBottom: index < lines - 1 ? 8 : 0,
            width: index === lines - 1 ? "80%" : "100%",
          }}
        />
      ))}
    </View>
  );
}

export function SkeletonCard({
  showImage = true,
  showText = true,
}: {
  showImage?: boolean;
  showText?: boolean;
}) {
  return (
    <View style={skeletonCardStyles.container}>
      {showImage && (
        <Skeleton
          width="100%"
          height={200}
          borderRadius={12}
          style={skeletonCardStyles.image}
        />
      )}
      {showText && (
        <View style={skeletonCardStyles.content}>
          <Skeleton height={20} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton height={16} borderRadius={4} style={{ width: "60%" }} />
        </View>
      )}
    </View>
  );
}

const skeletonCardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  image: {
    marginBottom: 12,
  },
  content: {
    paddingHorizontal: 4,
  },
});


