import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const IMAGE_WIDTH = screenWidth - 40;

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  scrollView: {
    width: IMAGE_WIDTH,
  },
  imageContainer: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: IMAGE_WIDTH - 20,
    height: IMAGE_WIDTH - 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  placeholderImage: {
    width: IMAGE_WIDTH - 20,
    height: IMAGE_WIDTH - 20,
    borderRadius: 16,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderStyle: "dashed",
  },
  indicatorsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E9ECEF",
  },
  indicatorActive: {
    backgroundColor: "#4CAF50",
    width: 24,
  },
  counterContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
});
