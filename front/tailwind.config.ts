import type { Config } from "tailwindcss";
const {
  default: flattenColorPalette
} = require("tailwindcss/lib/util/flattenColorPalette");

import svgToDataUri from "mini-svg-data-uri";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./container/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-libre-franklin)", "system-ui", "sans-serif"],
        display: ["var(--font-merriweather-garamond)", "serif"],
        merriweather: ["var(--font-merriweather-garamond)", "serif"],
        libre: ["var(--font-libre-franklin)", "sans-serif"]
      },
      colors: {
        // Tokens del panel de administración (`/admin`). No colisionan con los
        // del storefront salvo `primary`/`secondary`, que son de la tienda; en
        // el panel esos usos se mapearon a `brand`.
        brand: {
          DEFAULT: "#3f6f52",
          dark: "#2f5440",
          light: "#eaf2ec"
        },
        "on-primary": "#ffffff",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "on-surface": "#171717",
        "on-surface-variant": "#525252",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fafafa",
        "surface-container-high": "#e5e5e5",
        outline: "#a3a3a3",
        "outline-variant": "#e5e5e5",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))"
        },
        pink: {
          DEFAULT: "rgb(var(--pink))",
          foreground: "rgb(var(--pink-foreground))"
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))"
        },
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))"
      },
      boxShadow: {
        derek: `0px 0px 0px 1px rgb(0 0 0 / 0.06),
        0px 1px 1px -0.5px rgb(0 0 0 / 0.06),
        0px 3px 3px -1.5px rgb(0 0 0 / 0.06), 
        0px 6px 6px -3px rgb(0 0 0 / 0.06),
        0px 12px 12px -6px rgb(0 0 0 / 0.06),
        0px 24px 24px -12px rgb(0 0 0 / 0.06)`,
        aceternity: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))"
      },
      animation: {
        move: "move 5s linear infinite",
        "spin-circle": "spin-circle 3s linear infinite"
      },
      keyframes: {
        move: {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" }
        },
        "spin-circle": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      screens: {
        xs: "576px"
      },
      borderRadius: {
        DEFAULT: "0"
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    addVariablesForColors,
    function ({ matchUtilities, theme }: any) {
      matchUtilities(
        {
          "bg-grid": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`
          }),
          "bg-grid-small": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`
          }),
          "bg-dot": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
            )}")`
          }),
          "bg-dot-thick": (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="2.5"></circle></svg>`
            )}")`
          })
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );

      matchUtilities(
        {
          highlight: (value: any) => ({
            boxShadow: `inset 0 1px 0 0 ${value}`
          })
        },
        { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
      );
    }
  ]
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars
  });
}

export default config;
