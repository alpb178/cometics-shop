import React from "react";
import { StyleSheet, View } from "react-native";
import { FAQ } from "./faq";
import { HowItWorks } from "./how-it-works";
import { StoryPanel } from "./story-panel";

export interface DynamicZoneInterface {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface DynamicZoneProps {
  content: DynamicZoneInterface[];
}

export function DynamicZone({ content }: DynamicZoneProps) {
  const renderComponent = (component: DynamicZoneInterface) => {
    switch (component.__component) {
      case "dynamic-zone.faq":
        return (
          <FAQ
            key={component.id + "dynamic-zone.faq"}
            heading={component.heading}
            faqs={component.faqs || []}
          />
        );

      case "dynamic-zone.how-it-works":
        return (
          <HowItWorks
            key={component.id + "dynamic-zone.how-it-works"}
            heading={component.heading}
            sub_heading={component.sub_heading}
            steps={component.steps || []}
          />
        );

      case "dynamic-zone.story-panel":
        return (
          <StoryPanel
            key={component.id + "dynamic-zone.story-panel"}
            stories={component.storys || []}
          />
        );

      default:
        console.warn(`Unknown component type: ${component.__component}`);
        return null;
    }
  };

  return <View style={styles.container}>{content.map(renderComponent)}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
