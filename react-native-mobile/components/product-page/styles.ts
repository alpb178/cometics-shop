import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    lineHeight: 34,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 20,
  },
  price: {
    fontWeight: "bold",
    color: "#2E7D32",
  },
  currency: {
    fontSize: 18,
    color: "#666",
    marginLeft: 4,
    fontWeight: "500",
  },
  descriptionContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    padding: 16,
    color: "#4B5563",
    backgroundColor: "#F8F9FA",
  },

  addToCartButton: {
    marginBottom: 12,
    backgroundColor: "#4CAF50",
    color: "#FFFFFF",
  },
  whatsappButton: {
    marginBottom: 24,
    borderColor: "#4CAF50",
    color: "#FFFFFF",
  },
});


