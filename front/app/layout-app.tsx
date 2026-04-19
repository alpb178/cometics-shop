"use client";

import { Footer } from "../components/footer/footer";
import { useApp } from "@/context/app-context";
import { HelpButton } from "../components/help/help-button";
import Navbar from "@/components/navbar";

interface LayoutAppProps {
  children: React.ReactNode;
}

export default function LayoutApp({ children }: LayoutAppProps) {
  const { data: pageData } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar locale="en" />

      <div className="flex-1 mt-20">{children}</div>

      <Footer data={pageData?.footer || {}} locale="en" />
      <HelpButton />
    </div>
  );
}
