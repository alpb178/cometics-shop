"use client";

import RichTextRenderer from "../text/rich-text";
import { Text } from "../text/text-variant/text";

export const RichText = (props: any) => {
  const { text_description: data } = props;

  return (
    <div className="relative w-full min-h-screen">
      <div className="mx-auto px-6 py-20 max-w-4xl">
        <div className="p-8">
          <div className="max-w-none prose prose-lg">
            {data &&
              data?.map((item: any, index: number) => (
                <div key={index} className="mb-8">
                  <Text
                    as="title"
                    className="mb-4 text-left"
                    content={item.tittle}
                  />
                  <div className="text-foreground text-left leading-relaxed">
                    <RichTextRenderer content={item.description} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
