import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3f6f52",
          dark: "#2f5440",
          light: "#eaf2ec"
        },
        // Tokens de superficie (mismos nombres que el admin de Tu Chamba,
        // mapeados a la identidad de Iris) para reutilizar sus componentes
        // de tabla y paginación sin traducir clases.
        primary: "#3f6f52",
        "on-primary": "#ffffff",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "on-surface": "#171717",
        "on-surface-variant": "#525252",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#fafafa",
        "surface-container-high": "#e5e5e5",
        outline: "#a3a3a3",
        "outline-variant": "#e5e5e5"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
