"use client";
import dynamic from "next/dynamic";
import React from "react";

interface DynamicZoneComponent {
  __component: string;
  id: number;
  [key: string]: any;
}

interface Props {
  dynamicZone: DynamicZoneComponent[];
  locale: string;
}

const componentMapping: { [key: string]: any } = {
  "dynamic-zone.how-it-works": dynamic(
    () => import("./how-it-works").then((mod) => mod.HowItWorks),
    { ssr: false }
  ),
  "dynamic-zone.form-next-to-section": dynamic(
    () => import("./form-next-to-section").then((mod) => mod.FormNextToSection),
    { ssr: false }
  ),
  "dynamic-zone.faq": dynamic(() => import("./faq").then((mod) => mod.FAQ), {
    ssr: false,
  }),

  "dynamic-zone.rich-text": dynamic(
    () => import("./rich-text").then((mod) => mod.RichText),
    { ssr: false }
  ),
  "dynamic-zone.story-panel": dynamic(
    () => import("./story-panel").then((mod) => mod.StoryPanel),
    { ssr: false }
  ),
};

const DynamicZoneManager: React.FC<Props> = ({ dynamicZone, locale }) => {
  if (!dynamicZone || !Array.isArray(dynamicZone)) {
    return null;
  }

  return (
    <div>
      {dynamicZone.map((componentData, index) => {
        if (!componentData || !componentData.__component) {
          return null;
        }

        const Component = componentMapping[componentData.__component];
        if (!Component) {
          return null;
        }

        // Generate unique key combining id, component type, and index
        const uniqueKey = componentData.id
          ? `${componentData.__component}-${componentData.id}`
          : `${componentData.__component}-${index}`;

        try {
          return (
            <Component key={uniqueKey} {...componentData} locale={locale} />
          );
        } catch {
          return null;
        }
      })}
    </div>
  );
};

export default DynamicZoneManager;
