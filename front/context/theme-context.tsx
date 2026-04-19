"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      // Check if screen width is less than 1024px (lg breakpoint)
      const isMobileDevice = window.innerWidth < 1024;
      setIsMobile(isMobileDevice);
      
      // If mobile, force light theme
      if (isMobileDevice) {
        setTheme("light");
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add("light");
        localStorage.setItem("theme", "light");
        return;
      }
      
      // For desktop, get theme from localStorage
      try {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          setTheme(savedTheme);
        } else {
          setTheme("light");
          localStorage.setItem("theme", "light");
        }
      } catch (error) {
        setTheme("light");
      }
    };
    
    checkMobile();
    
    // Listen for resize events to update mobile state
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // If mobile, always force light theme
    if (isMobile) {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add("light");
      return;
    }

    // Update document class and localStorage when theme changes (desktop only)
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, isClient, isMobile]);

  const toggleTheme = () => {
    // Prevent theme toggle on mobile
    if (isMobile) {
      return;
    }
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
