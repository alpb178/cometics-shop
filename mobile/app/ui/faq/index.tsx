import { DynamicZone } from "@/components/dynamic-zone/dynamic-zone";
import { ContentSkeleton } from "@/components/skeleton";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useDynamicContent } from "@/hooks";
import React from "react";

export default function FAQ() {
  const {
    content,
    isLoading,
    error,
    mutate: onRefresh,
  } = useDynamicContent({
    slug: "faq",
  });

  if (isLoading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <ContentSkeleton />
      </ParallaxScrollView>
    );
  }

  if (error) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
          <ThemedText style={{ textAlign: "center", marginBottom: 16 }}>
            Error al cargar el contenido
          </ThemedText>
          <ThemedText
            style={{ color: "#4F8EF7", textDecorationLine: "underline" }}
            onPress={() => onRefresh()}
          >
            Toca para reintentar
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      {content && content.length > 0 && <DynamicZone content={content} />}
    </ParallaxScrollView>
  );
}
