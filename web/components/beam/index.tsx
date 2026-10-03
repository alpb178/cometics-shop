"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

const Beam = ({
  showBeam = true,
  className
}: {
  showBeam?: boolean;
  className?: string;
}) => {
  const meteorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const meteor = meteorRef.current;

    if (showBeam && meteor) {
      const handleAnimationEnd = () => {
        meteor.style.visibility = "hidden";
        const animationDelay = Math.floor(Math.random() * (2 - 0) + 0);
        const animationDuration = Math.floor(Math.random() * (4 - 0) + 0);
        const meteorWidth = Math.floor(Math.random() * (150 - 80) + 80);
        meteor.style.setProperty("--meteor-delay", `${animationDelay}s`);
        meteor.style.setProperty("--meteor-duration", `${animationDuration}s`);
        meteor.style.setProperty("--meteor-width", `${meteorWidth}px`);

        restartAnimation();
      };

      const handleAnimationStart = () => {
        meteor.style.visibility = "visible";
      };

      meteor.addEventListener("animationend", handleAnimationEnd);
      meteor.addEventListener("animationstart", handleAnimationStart);

      return () => {
        // Using the same meteor variable captured in the effect
        meteor.removeEventListener("animationend", handleAnimationEnd);
        meteor.removeEventListener("animationstart", handleAnimationStart);
      };
    }
  }, [showBeam]);

  const restartAnimation = () => {
    const meteor = meteorRef.current;
    if (!meteor) return;
    meteor.style.animation = "none";
    void meteor.offsetWidth; // This forces a reflow, restarting the animation
    meteor.style.animation = "";
  };

  return (
    showBeam && (
      <span
        ref={meteorRef}
        className={cn(
          "-top-4 z-[40] absolute bg-primary shadow-[0_0_0_1px_#ffffff10] rounded-[9999px] w-[0.1rem] h-[0.1rem] rotate-[180deg]",
          styles.meteor,
          className
        )}
      ></span>
    )
  );
};

export default Beam;
