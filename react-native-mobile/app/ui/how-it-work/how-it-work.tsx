import { DynamicZone } from "@/components/dynamic-zone/dynamic-zone";
import LoaderComponent from "@/components/loader";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useDynamicContent } from "@/hooks";
import React from "react";

export default function HowItWorks() {
  const {
    content,
    isLoading,
    error,
    mutate: onRefresh,
  } = useDynamicContent({
    slug: "how-it-works",
  });

  if (isLoading || error) {
    return (
      <LoaderComponent isBusy={isLoading} error={error} onRefresh={onRefresh} />
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
