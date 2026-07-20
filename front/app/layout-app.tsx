"use client";

import { Footer } from "../components/footer/footer";
import { HelpButton } from "../components/help/help-button";
import Navbar from "@/components/navbar";

interface LayoutAppProps {
  children: React.ReactNode;
}

export default function LayoutApp({ children }: LayoutAppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar locale="en" />

      <div className="flex-1">{children}</div>

      <Footer locale="en" />
      <HelpButton />
    </div>
  );
}
