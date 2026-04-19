import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemedText } from "../themed-text";
import { styles } from "./image-gallery.styles";

const { width: screenWidth } = Dimensions.get("window");
const IMAGE_WIDTH = screenWidth - 40;

export default function ImageGallery({
  images,
  fallbackIcon,
}: {
  images: { url: string }[];
  fallbackIcon: string;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / IMAGE_WIDTH);
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholderImage}>
          <Icon name={fallbackIcon} size={60} color="#4CAF50" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: image.url }}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex && styles.indicatorActive,
              ]}
            />
          ))}
        </View>
      )}

      {images.length > 1 && (
        <View style={styles.counterContainer}>
          <View style={styles.counter}>
            <Icon name="images" size={16} color="#666" />
            <View style={styles.counterText}>
              <ThemedText type="subtitle" style={styles.counterText}>
                {currentIndex + 1} / {images.length}
              </ThemedText>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
