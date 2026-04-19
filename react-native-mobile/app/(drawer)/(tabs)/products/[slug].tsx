import Product from "@/components/product-page/product";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";

export default function ProductPage() {
  const slug = useLocalSearchParams().slug as string;
  const name = useLocalSearchParams().name as string;
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: name,
      headerShown: true,
      headerBackTitle: " ",
    });
  }, [name, navigation]);

  return <Product slug={slug} />;
}
