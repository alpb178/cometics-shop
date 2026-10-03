"use client";

import { useTheme } from "@/context/theme-context";

export const AmbientColor = () => {
  const { theme } = useTheme();

  // Use stronger opacity values for light theme to make colors more perceptible
  const primaryOpacity = theme === "light" ? 0.04 : 0.08;
  const secondaryOpacity = theme === "light" ? 0.01 : 0.02;
  const tertiaryOpacity = theme === "light" ? 0.01 : 0.02;

  return (
    <div className="top-0 left-0 z-40 absolute w-screen h-screen pointer-events-none">
      <div
        style={{
          transform: "translateY(-350px) rotate(-45deg)",
          width: "560px",
          height: "1380px",
          background: `
            radial-gradient(68.54% 68.72% at 55.02% 31.46%, 
              rgb(var(--ambient-primary) / ${primaryOpacity}) 0, 
              rgb(var(--ambient-secondary) / ${secondaryOpacity}) 50%, 
              hsl(var(--accent) / 0) 80%)
          `
        }}
        className="top-0 left-0 absolute"
      />

      <div
        style={{
          transform: "rotate(-45deg) translate(5%, -50%)",
          transformOrigin: "top left",
          width: "240px",
          height: "1380px",
          background: `
            radial-gradient(50% 50% at 50% 50%, 
              rgb(var(--ambient-primary) / ${primaryOpacity * 0.75}) 0, 
              rgb(var(--primary) / ${secondaryOpacity}) 80%, 
              transparent 100%)
          `
        }}
        className="top-0 left-0 absolute"
      />

      <div
        style={{
          position: "absolute",
          borderRadius: "20px",
          transform: "rotate(-45deg) translate(-180%, -70%)",
          transformOrigin: "top left",
          top: 0,
          left: 0,
          width: "240px",
          height: "1380px",
          background: `
            radial-gradient(50% 50% at 50% 50%, 
              hsl(var(--ambient-primary) / ${primaryOpacity * 0.5}) 0, 
              hsl(var(--ambient-tertiary) / ${tertiaryOpacity}) 80%, 
              transparent 100%)
          `
        }}
        className="top-0 left-0 absolute"
      />
    </div>
  );
};
