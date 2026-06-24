import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const waveTextConfig: ComponentConfig = {
  slug: "wave-text",
  name: "Proximity Ripple",
  category: "text",
  tags: ["wave", "proximity", "ripple", "interactive", "mouse", "hover"],
  componentPath: "app/meta/text/Interactive/WaveText.tsx",
  props: [
    {
      name: "text",
      type: "string",
      default: "RESONANCE",
      description: "The text to animate with the wave effect.",
    },
    {
      name: "maxDistance",
      type: "number",
      default: 120,
      min: 0,
      max: 400,
      step: 10,
      description:
        "The maximum distance from the cursor to apply the wave scale/jump.",
    },
    {
      name: "hoverColor",
      type: "color",
      default: "#34d399",
      description: "The hex color to apply during cursor proximity.",
    },
    {
      name: "color",
      type: "color",
      default: "#FFFFFF",
      description: "The base color of the text letters.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: true,
      description: "Whether to force the text to uppercase.",
    },
    {
      name: "textClassName",
      type: "string",
      default: "text-5xl font-bold",
      description: "Tailwind classes for font style, size, and weight.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        text: "RESONANCE",
        maxDistance: 120,
        hoverColor: "#34d399",
        color: "#FFFFFF",
        uppercase: true,
        textClassName: "text-5xl font-bold",
      },
    },
    {
      id: "wide",
      label: "Wide Ripple",
      config: {
        text: "AMPLITUDE",
        maxDistance: 200,
        hoverColor: "#fbbf24",
        color: "#FFFFFF",
        uppercase: true,
        textClassName: "text-5xl tracking-widest font-black",
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
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
        {
          name: "Tailwind CSS",
          role: "Styling",
          url: "https://tailwindcss.com",
        },
      ],
    },
  ],
  staticProps: {},
};
