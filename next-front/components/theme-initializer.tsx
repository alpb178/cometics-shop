"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    // Initialize theme after component mounts to avoid hydration issues
    try {
      // Check if device is mobile (screen width < 1024px)
      const isMobile = window.innerWidth < 1024;
      
      // Force light theme on mobile
      const theme = isMobile ? "light" : (localStorage.getItem("theme") || "light");
      const root = document.documentElement;

      // Remove existing theme classes
      root.classList.remove("light", "dark");
      // Add the theme
      root.classList.add(theme);
      
      // Ensure localStorage is set correctly
      if (isMobile) {
        localStorage.setItem("theme", "light");
      }
    } catch {
      // If localStorage is not available, default to light
      document.documentElement.classList.add("light");
    }
  }, []);

  return null; // This component doesn't render anything
}
