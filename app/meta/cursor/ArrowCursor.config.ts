import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const arrowCursorConfig: ComponentConfig = {
  slug: "follow-cursor",
  name: "Follow Cursor",
  category: "cursor",
  tags: ["cursor", "arrow", "custom", "pointer", "mouse"],
  componentPath: "app/meta/cursor/ArrowCursor.tsx",
  props: [
    {
      name: "color",
      type: "color",
      default: "#F2F5F8",
      description: "The primary color of the cursor arrow.",
    },
    {
      name: "size",
      type: "number",
      default: 20,
      min: 12,
      max: 64,
      step: 1,
      description: "The size of the cursor in pixels.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default",
      config: {
        color: "#F2F5F8",
        size: 20,
      },
    },
    {
      id: "large-accent",
      label: "Large Accent",
      config: {
        color: "#6366F1",
        size: 40,
      },
    },
    {
      id: "compact-flame",
      label: "Compact Flame",
      config: {
        color: "#F97316",
        size: 14,
      },
    },
  ],
  credits: [
    {
      title: "Inspiration",
      items: [
        {
          name: "React Bits",
          role: "Original Implementation",
          url: "https://reactbits.dev",
        },
      ],
    },
  ],
};
