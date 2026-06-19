import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const kineticTextConfig: ComponentConfig = {
  slug: "kinetic-text",
  name: "Kinetic Ribbon Text",
  category: "text",
  componentPath: "app/meta/text/Interactive/KineticText.tsx",
  props: [
    {
      name: "text",
      type: "string",
      default: "KINETIC",
      description: "The word/text to render and animate.",
    },
    {
      name: "staggerDelay",
      type: "number",
      default: 80,
      min: 10,
      max: 300,
      step: 10,
      description: "Stagger delay in milliseconds between character entrances.",
    },
    {
      name: "color",
      type: "color",
      default: "#ffffff",
      description: "Foreground color of the letters.",
    },
    {
      name: "activeStrokeColor",
      type: "color",
      default: "rgba(0, 245, 255, 0.45)",
      description: "Color of the ribbon/string when interaction is active (dragging).",
    },
    {
      name: "strokeColor",
      type: "color",
      default: "rgba(255, 255, 255, 0.08)",
      description: "Color of the ribbon/string when not active.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        text: "KINETIC",
        color: "#ffffff",
        activeStrokeColor: "rgba(0, 245, 255, 0.45)",
        strokeColor: "rgba(255, 255, 255, 0.08)",
        staggerDelay: 80,
      },
    },
    {
      id: "matrix",
      label: "Matrix Green",
      config: {
        text: "MATRIX",
        color: "#00ff66",
        activeStrokeColor: "rgba(0, 255, 102, 0.5)",
        strokeColor: "rgba(0, 50, 20, 0.15)",
        staggerDelay: 50,
      },
    },
    {
      id: "cyberpunk",
      label: "Cyberpunk Neon",
      config: {
        text: "CYBER",
        color: "#ffe600",
        activeStrokeColor: "rgba(255, 0, 110, 0.6)",
        strokeColor: "rgba(255, 230, 0, 0.05)",
        staggerDelay: 120,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "Google DeepMind Team",
          role: "Developer",
          url: "https://deepmind.google",
        },
        {
          name: "React Bytes",
          role: "Collection",
          url: "https://reactbytes.dev",
        },
      ],
    },
    {
      title: "Open Source Libraries",
      items: [
        {
          name: "React",
          role: "UI Framework",
          url: "https://react.dev",
        },
      ],
    },
  ],
  staticProps: {},
};
