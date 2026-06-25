"use client";

import React from "react";
import { ComponentRegistry } from "./ComponentRegistry";
import HeaderText from "../textfields/HeaderText";
import ParagraphText from "../textfields/ParagraphText";

interface LegacyPageRendererProps {
  id: string;
}

export const LegacyPageRenderer: React.FC<LegacyPageRendererProps> = ({
  id,
}) => {
  const entry = ComponentRegistry[id];

  if (entry) {
    const Component = entry.component;
    return <Component />;
  }

  return (
    <div className="flex flex-col gap-5">
      <HeaderText
        text={id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")}
        option={3}
      />
      <ParagraphText
        text="Content for this section is coming soon."
        option={4}
      />
    </div>
  );
};

export default LegacyPageRenderer;
