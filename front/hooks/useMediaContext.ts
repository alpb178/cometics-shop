"use client";

import { useEffect, useState } from "react";

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1280,
  xxl: 1400
};

const getBreakpoint = (width: number): Breakpoint => {
  if (width < 576) return "xs";
  if (width >= 576 && width < 768) return "sm";
  if (width >= 768 && width < 1024) return "md";
  if (width >= 1024 && width < 1280) return "lg";
  return "xl";
};

export const useMediaQuery = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>();

  const handleResize = () => {
    const newBreakpoint = getBreakpoint(window.innerWidth);

    if (newBreakpoint !== currentBreakpoint) {
      setCurrentBreakpoint(newBreakpoint);
    }
  };

  useEffect(() => {
    setCurrentBreakpoint(getBreakpoint(window.innerWidth));

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBreakpoint]);

  // Implment a logic to get non exclusive breakpoints (e.i fromXs will include xs,sm,md,lg,xl, fromSm will include sm,md,lg,xl, etc)
  const from = (breakpoint: Breakpoint) => {
    if (currentBreakpoint) {
      return breakpoints[breakpoint] <= breakpoints[currentBreakpoint];
    }

    return false;
  };

  const to = (breakpoint: Breakpoint) => {
    if (currentBreakpoint) {
      return breakpoints[breakpoint] > breakpoints[currentBreakpoint];
    }

    return false;
  };

  return { breakpoint: currentBreakpoint, from, to };
};
