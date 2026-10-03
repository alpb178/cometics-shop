import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DEFAULT_DURATION = 0.4;
const DEFAULT_INITIAL_OPACITY = 0.5;

export const useEntranceAnimation = (options?: { amount?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: options?.amount ?? 0,
    margin: "-100px 0px -100px 0px"
  });

  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    } else if (!isInView && hasAnimated) {
      setHasAnimated(false);
    }
  }, [isInView, hasAnimated]);

  return { ref, isInView: hasAnimated };
};

export const entranceAnimationVariants = {
  container: {
    hidden: { opacity: DEFAULT_INITIAL_OPACITY },
    visible: {
      opacity: 1,
      transition: {
        duration: DEFAULT_DURATION,
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  },

  item: {
    hidden: {
      opacity: DEFAULT_INITIAL_OPACITY,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.4, 0, 0.2, 1] as const
      }
    },
    exit: {
      opacity: 1,
      y: 0
    }
  },

  icon: {
    hidden: {
      opacity: DEFAULT_INITIAL_OPACITY,
      scale: 0.5,
      rotate: -180
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.34, 1.56, 0.64, 1] as const
      }
    }
  },

  content: {
    hidden: {
      opacity: DEFAULT_INITIAL_OPACITY,
      y: 40
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  },

  slideUp: {
    hidden: {
      opacity: DEFAULT_INITIAL_OPACITY,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  },

  slideLeft: {
    hidden: {
      opacity: DEFAULT_INITIAL_OPACITY,
      x: -50
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  },

  slideRight: {
    hidden: {
      opacity: DEFAULT_INITIAL_OPACITY,
      x: 50
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  },

  fadeIn: {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  },

  scaleIn: {
    hidden: {
      opacity: DEFAULT_INITIAL_OPACITY,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: DEFAULT_DURATION,
        ease: [0.34, 1.56, 0.64, 1] as const
      }
    }
  }
};
