"use client";

import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { onSendWhatsAppMessage } from "@/lib/utils";
import { logsStrapi } from "@/lib/strapi/logs";

export const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Check if cart drawer is open
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsCartOpen(document.body.hasAttribute("data-cart-open"));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-cart-open"]
    });

    setIsCartOpen(document.body.hasAttribute("data-cart-open"));

    return () => observer.disconnect();
  }, []);

  const generateHelpMessage = () => {
    let message =
      "¡Hola! ¿Podrían ayudarme con alguna consulta sobre sus productos o servicios?";

    return message;
  };

  const handleWhatsAppClick = async () => {
    onSendWhatsAppMessage(generateHelpMessage());

    try {
      await logsStrapi(
        "User Clicked Help Button WhatsApp",
        `${generateHelpMessage()}`
      );
    } catch {
      () => {};
    }
  };

  // Hide button when cart is open
  if (isCartOpen) {
    return null;
  }

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        aria-label="Help"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="help"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconBrandWhatsapp className="w-8 h-8 text-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Help Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Floating panel: does not block the site; page remains scrollable and clickable */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-6 z-50 bg-background border border-border rounded-lg shadow-xl p-4 min-w-[200px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  ¿Necesitas ayuda?
                </h3>

                <button
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <IconBrandWhatsapp className="w-5 h-5 text-lg" />
                  Contactar por WhatsApp
                </button>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Horario de atención:
                  </p>
                  <p className="text-xs text-foreground font-medium">
                    Lunes - Viernes: 10:00 - 18:00
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
