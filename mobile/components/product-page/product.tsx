import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ProductDetailSkeleton } from "@/components/skeleton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { useDeliveryOption } from "@/hooks/use-delivery-option";
import { useProduct } from "@/hooks/use-products";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { DeliveryOptions } from "@/components/delivery-options/delivery-options";
import ImageGallery from "@/components/image-gallery/image-gallery";
import { QuantitySelector } from "@/components/quantity-selector/quantity-selector";
import { Collapsible } from "@/components/ui/collapsible";
import { useState } from "react";
import { styles } from "./styles";

export default function Product({ slug }: { slug: string }) {
  const { product, isLoading, error } = useProduct(slug);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { deliveryOption, handleDeliveryChange, getButtonText } =
    useDeliveryOption("delivery");

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url,
          currency: product.currency,
          deliveryOption: deliveryOption,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <ProductDetailSkeleton />
      </ParallaxScrollView>
    );
  }

  if (error || !product) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <ThemedView
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ThemedText style={{ textAlign: "center", marginBottom: 16 }}>
            {error ? "Error al cargar el producto" : "Producto no encontrado"}
          </ThemedText>
          <ThemedText
            style={{ color: "#4F8EF7", textDecorationLine: "underline" }}
            onPress={() => router.back()}
          >
            Volver
          </ThemedText>
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ImageGallery
          images={product.images || []}
          fallbackIcon="leaf-outline"
        />

        <View style={styles.titleSection}>
          <ThemedText type="title" style={styles.title}>
            {product.name}
          </ThemedText>
        </View>

        <View style={styles.priceContainer}>
          <ThemedText style={styles.price} type="title">
            {product.price.toFixed(2)}
          </ThemedText>
          <ThemedText style={styles.currency}>{product.currency}</ThemedText>
        </View>

        {product.description && (
          <Collapsible title="Descripción" style={styles.descriptionContainer}>
            <ThemedText style={styles.description}>
              {product.description}
            </ThemedText>
          </Collapsible>
        )}

        <QuantitySelector
          quantity={quantity}
          onQuantityChange={setQuantity}
          min={1}
          max={10}
        />

        <DeliveryOptions
          selected={deliveryOption}
          onChange={handleDeliveryChange}
        />

        <Button
          title={getButtonText()}
          onPress={handleAddToCart}
          variant="outline"
          size="lg"
          icon={<Icon name="logo-whatsapp" size={20} color="#25D366" />}
          iconPosition="left"
          style={{ ...styles.whatsappButton, borderColor: "#25D366" }}
          textStyle={{ color: "#25D366" }}
        />

        <Button
          title="Adicionar al carrito"
          onPress={handleAddToCart}
          variant="primary"
          icon={<Icon name="cart" size={20} color="white" />}
          size="lg"
          iconPosition="left"
          style={styles.addToCartButton}
        />
      </ScrollView>
    </ParallaxScrollView>
  );
}
