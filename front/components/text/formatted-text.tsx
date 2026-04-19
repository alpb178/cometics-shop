"use client";

import { cn } from "@/lib/utils";
import { useAppMode } from "@/hooks/useAppMode";

interface FormattedTextProps {
  content: string;
  className?: string;
}

export function FormattedText({ content, className }: FormattedTextProps) {
  const { isDark } = useAppMode();

  const formatText = (text: string) => {
    const paragraphs = text?.split(/\n\s*\n/);

    return paragraphs?.map((paragraph, paragraphIndex) => {
      if (!paragraph.trim()) return null;

      const lines = paragraph.split(/\n/);

      return (
        <div key={paragraphIndex} className="mb-4 last:mb-0">
          {lines.map((line, lineIndex) => {
            if (!line.trim()) return <br key={lineIndex} />;

            const isBulletPoint = /^[•⁠\s]+/.test(line);

            if (isBulletPoint) {
              const content = line.replace(/^[•⁠\s]+/, "").trim();

              return (
                <div key={lineIndex} className="flex items-start mb-2">
                  <span className="text-primary mr-2 mt-1">•</span>
                  <span
                    className={cn(
                      "flex-1",
                      isDark ? "text-gray-300" : "text-gray-600"
                    )}
                  >
                    {content}
                  </span>
                </div>
              );
            }

            const isTitle = line.includes(":") && line.length < 100;

            if (isTitle) {
              return (
                <h3
                  key={lineIndex}
                  className={cn(
                    "font-semibold mb-2 mt-4 first:mt-0",
                    isDark ? "text-white" : "text-gray-900"
                  )}
                >
                  {line}
                </h3>
              );
            }

            return (
              <p
                key={lineIndex}
                className={cn(
                  "mb-2 last:mb-0 leading-relaxed",
                  isDark ? "text-gray-300" : "text-gray-600"
                )}
              >
                {line}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className={cn(isDark ? "text-white" : "text-gray-900", className)}>
      {formatText(content)}
    </div>
  );
}
