"use client";

import React, { use } from "react";
import { ComponentDatabase } from "@/app/registry/ComponentDatabase";
import { ComponentMap } from "@/app/registry/ComponentMap";

export default function CapturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const dbEntry = ComponentDatabase.find((entry) => entry.slug === id);

  if (!dbEntry) {
    return <div className="text-white p-4">Component not found: {id}</div>;
  }

  const Component = ComponentMap[id];
  if (!Component) {
    return <div className="text-white p-4">Component class not found in map: {id}</div>;
  }

  // Get default props
  const propStates: Record<string, any> = {};
  dbEntry.props.forEach((prop) => {
    propStates[prop.name] = prop.default;
  });
  const props = { ...propStates, ...(dbEntry.staticProps || {}) };
  const isBackground = dbEntry.category === "background";

  return (
    <div
      id="capture-viewport"
      className="fixed inset-0 w-[600px] h-[320px] overflow-hidden bg-rb-neutral-2 select-none flex items-center justify-center"
      style={{
        width: "600px",
        height: "320px",
        background: "var(--rb-neutral-2, #060010)",
      }}
    >
      <style>{`
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          background: #060010 !important;
          width: 600px !important;
          height: 320px !important;
        }
      `}</style>
      <div
        className={
          isBackground
            ? "w-full h-full relative overflow-hidden p-0"
            : `w-full h-full relative overflow-hidden flex items-center justify-center p-6 ${dbEntry.containerClassName || ""}`
        }
      >
        <Component
          {...props}
          className={isBackground ? `relative w-full h-full overflow-hidden select-none ${dbEntry.customClassName || ""}` : undefined}
        />
      </div>
    </div>
  );
}
