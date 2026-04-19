import { Libre_Franklin, Merriweather } from "next/font/google";

export const merriweatherGaramond = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather-garamond",
  display: "swap"
});

export const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-libre-franklin",
  display: "swap"
});
