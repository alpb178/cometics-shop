"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useStrapiData } from "@/hooks/useStrapiData";

interface AppData {
  logo: any;
  navbar: any;
  footer: any;
  [key: string]: any;
}

interface AppContextType {
  data: AppData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateData: (key: string, value: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const {
    data,
    loading,
    error,
    refetch: strapiRefetch
  } = useStrapiData({
    contentType: "global",
    params: { filters: { locale: "en" } },
    spreadData: true
  });

  const updateData = useCallback((_key: string, _value: any) => {}, []);

  const refetch = useCallback(() => {
    strapiRefetch();
  }, [strapiRefetch]);

  const contextValue: AppContextType = {
    data,
    loading,
    error,
    refetch,
    updateData
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
