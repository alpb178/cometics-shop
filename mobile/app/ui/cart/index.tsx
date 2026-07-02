import ParallaxScrollView from "@/components/parallax-scroll-view";
import { DeliveryOptions } from "@/components/delivery-options/delivery-options";
import { QuantitySelector } from "@/components/quantity-selector/quantity-selector";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    updateDeliveryOption,
    clearCart
  } = useCart();

  if (cart.items.length === 0) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      >
        <ThemedView style={styles.emptyContainer}>
          <Icon name="cart-outline" size={80} color="#999" />
          <ThemedText type="title" style={styles.emptyTitle}>
            Tu carrito está vacío
          </ThemedText>
          <ThemedText style={styles.emptyText}>
            Agrega productos para comenzar
          </ThemedText>
          <Button
            title="Ver productos"
            onPress={() => router.push("/")}
            variant="primary"
            size="lg"
            style={styles.emptyButton}
          />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <ThemedView style={styles.itemContainer}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      ) : (
        <View style={[styles.itemImage, styles.placeholderImage]}>
          <Icon name="image-outline" size={30} color="#999" />
        </View>
      )}
      <View style={styles.itemInfo}>
        <ThemedText type="subtitle" style={styles.itemName}>
          {item.name}
        </ThemedText>
        <ThemedText style={styles.itemPrice}>
          {item.price.toFixed(2)} {item.currency || "USD"}
        </ThemedText>
        <View style={styles.quantityRow}>
          <QuantitySelector
            quantity={item.quantity}
            onQuantityChange={(qty) => updateQuantity(item.id, qty)}
            min={1}
            max={99}
          />
          <Pressable
            onPress={() => removeFromCart(item.id)}
            style={styles.removeButton}
          >
            <Icon name="trash-outline" size={20} color="#F44336" />
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
    >
      <View style={styles.container}>
        <View style={styles.listContainer}>
          {cart.items.map((item) => (
            <View key={item.id}>{renderItem({ item })}</View>
          ))}
          <ThemedView style={styles.deliverySection}>
            <DeliveryOptions
              selected={cart.deliveryOption}
              onChange={updateDeliveryOption}
            />
          </ThemedView>
        </View>
        <ThemedView style={styles.footer}>
          <View style={styles.totalRow}>
            <ThemedText type="subtitle" style={styles.totalLabel}>
              Total:
            </ThemedText>
            <ThemedText type="title" style={styles.totalAmount}>
              {cart.total.toFixed(2)} {cart.items[0]?.currency || "USD"}
            </ThemedText>
          </View>
          <Button
            title="Proceder al pago"
            onPress={() => {}}
            variant="primary"
            size="lg"
            style={styles.checkoutButton}
          />
          <Button
            title="Limpiar carrito"
            onPress={clearCart}
            variant="outline"
            size="md"
            style={styles.clearButton}
          />
        </ThemedView>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 400,
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  emptyButton: {
    marginTop: 20,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 200,
    flex: 1,
  },
  deliverySection: {
    marginTop: 16,
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  checkoutButton: {
    marginBottom: 12,
  },
  clearButton: {
    borderColor: "#F44336",
  },
});
