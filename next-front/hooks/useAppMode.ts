"use client";

import { useTheme } from "@/context/theme-context";
import { useEffect, useState } from "react";

export type AppMode = "light" | "dark";

interface UseAppModeReturn {
  mode: AppMode;
  isDark: boolean;
  isLight: boolean;
  toggleMode: () => void;
  setMode: (mode: AppMode) => void;
}

/**
 * Custom hook to get application theme mode and toggle/set functions
 * @returns Object with current mode and functions to change it
 */
export function useAppMode(): UseAppModeReturn {
  const { theme, toggleTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  // Check if we're on the client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // If not on client, return default values
  if (!isClient) {
    return {
      mode: "light",
      isDark: false,
      isLight: true,
      toggleMode: () => {},
      setMode: () => {}
    };
  }

  return {
    mode: theme,
    isDark: theme === "dark",
    isLight: theme === "light",
    toggleMode: toggleTheme,
    setMode: (newMode: AppMode) => {
      if (newMode !== theme) {
        toggleTheme();
      }
    }
  };
}

/**
 * Simplified hook that returns whether the app is in dark mode
 * @returns true if dark mode, false if light mode
 */
export function useIsDarkMode(): boolean {
  const { isDark } = useAppMode();
  return isDark;
}

/**
 * Simplified hook that returns whether the app is in light mode
 * @returns true if light mode, false if dark mode
 */
export function useIsLightMode(): boolean {
  const { isLight } = useAppMode();
  return isLight;
}
