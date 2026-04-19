import { Colors } from "@/constants/theme";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export interface StoryItem {
  id: number;
  tittle: string;
  description: string;
  image?: {
    url: string;
    alternativeText?: string;
  };
}

export interface StoryPanelProps {
  stories: StoryItem[];
}

export function StoryPanel({ stories }: StoryPanelProps) {
  const renderStoryItem = (item: StoryItem, index: number) => {
    return (
      <View key={item.id} style={styles.storyContainer}>
        {item.image && (
          <Image
            source={{ uri: item.image.url }}
            style={styles.imageFull}
            resizeMode="cover"
          />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.tittle}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {stories &&
        stories.length > 0 &&
        stories.map((story, index) => renderStoryItem(story, index))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  storyContainer: {
    marginBottom: 32,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageFull: {
    width: "100%",
    height: 250,
  },
  textContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    fontSize: 16,
    color: "#666666",
    lineHeight: 24,
  },
});
