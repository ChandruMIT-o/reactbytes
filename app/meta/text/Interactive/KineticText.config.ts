import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const kineticTextConfig: ComponentConfig = {
  slug: "kinetic-text",
  name: "Kinetic Ribbon Text",
  category: "text",
  tags: ["kinetic", "motion", "scroll", "velocity", "physics"],
  componentPath: "app/meta/text/Interactive/KineticText.tsx",
  npmPackageName: "@reactbytes/kinetic-text",
  version: "1.0.0",
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
      name: "bgColor",
      type: "color",
      default: "#000000",
      description: "Background color of the canvas.",
    },
    {
      name: "activeStrokeColor",
      type: "color",
      default: "rgba(0, 245, 255, 0.45)",
      description:
        "Color of the ribbon/string when interaction is active (dragging).",
    },
    {
      name: "strokeColor",
      type: "color",
      default: "rgba(255, 255, 255, 0.08)",
      description: "Color of the ribbon/string when not active.",
    },
    {
      name: "activeCrosshairColor",
      type: "color",
      default: "rgba(255, 0, 110, 0.25)",
      description: "Color of the resting home-base crosshair indicator.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        text: "KINETIC",
        color: "#ffffff",
        bgColor: "#000000",
        activeStrokeColor: "rgba(0, 245, 255, 0.45)",
        strokeColor: "rgba(255, 255, 255, 0.08)",
        activeCrosshairColor: "rgba(255, 0, 110, 0.25)",
        staggerDelay: 80,
      },
    },
    {
      id: "matrix",
      label: "Matrix Green",
      config: {
        text: "MATRIX",
        color: "#00ff66",
        bgColor: "#000800",
        activeStrokeColor: "rgba(0, 255, 102, 0.5)",
        strokeColor: "rgba(0, 50, 20, 0.15)",
        activeCrosshairColor: "rgba(0, 255, 102, 0.3)",
        staggerDelay: 50,
      },
    },
    {
      id: "cyberpunk",
      label: "Cyberpunk Neon",
      config: {
        text: "CYBER",
        color: "#ffe600",
        bgColor: "#0f0015",
        activeStrokeColor: "rgba(255, 0, 110, 0.6)",
        strokeColor: "rgba(255, 230, 0, 0.05)",
        activeCrosshairColor: "rgba(0, 245, 255, 0.35)",
        staggerDelay: 120,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "ChandruMIT-o",
          role: "Design & Development",
          url: "https://github.com/ChandruMIT-o/",
        },
      ],
    },
  ],
  staticProps: {
    textClassName: "text-[clamp(2.5rem,8cqw,4.5rem)] font-bold font-sans tracking-tighter text-center",
  },
};
