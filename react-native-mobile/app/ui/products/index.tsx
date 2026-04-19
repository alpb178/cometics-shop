import { ProductCard } from "@/components/product-card/product-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Heading } from "@/components/title/heading";
import { useCart } from "@/hooks/use-cart";
import { useProducts } from "@/hooks/use-products";
import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

export default function ProductsList() {
  const {
    products,
    isLoading,
    error,
    mutate: onRefresh,
  } = useProducts({
    pageSize: 20,
  });

  const { addToCart } = useCart();

  const handleProductPress = (product: any) => {
    router.push({
      pathname: "/(drawer)/(tabs)/products/[slug]",
      params: { slug: product.slug as string, name: product.name as string },
    });
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      currency: product.currency,
    });
  };

  if (isLoading || error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}>
          Error al cargar productos.{"\n"}
          <ThemedText style={styles.retryText} onPress={() => onRefresh()}>
            Toca para reintentar
          </ThemedText>
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <View style={styles.productCardContainer}>
          <ProductCard
            product={item}
            onPress={handleProductPress}
            onAddToCart={handleAddToCart}
            style={styles.productCard}
          />
        </View>
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={<Heading heading="Productos" />}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#F5F5F5",
    margin: 20,
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    width: "100%",
    marginBottom: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
  },
  retryText: {
    color: "#4F8EF7",
    textDecorationLine: "underline",
  },
  productCardContainer: {
    width: "45%",
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
