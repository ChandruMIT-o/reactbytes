import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const shatterTextConfig: ComponentConfig = {
  slug: "shatter-text",
  name: "Cinematic Shatter",
  category: "text",
  tags: ["shatter", "break", "cinematic", "particles", "explode"],
  componentPath: "app/meta/text/Interactive/ShatterText.tsx",
  npmPackageName: "@reactbytes/shatter-text",
  version: "1.0.0",
  props: [
    {
      name: "text",
      type: "string",
      default: "FRAGMENTED",
      description: "The text to assemble dynamically.",
    },
    {
      name: "scatterFactor",
      type: "number",
      default: 400,
      min: 100,
      max: 1500,
      step: 50,
      description:
        "Maximum distance for initial chaos scatter on both X and Y axis.",
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
      default: "text-5xl font-black text-rb-accent-1",
      description: "Tailwind classes for font styling.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Fracture",
      config: {
        text: "FRAGMENTED",
        scatterFactor: 400,
        color: "#FFFFFF",
        uppercase: true,
        textClassName: "text-5xl font-black",
      },
    },
    {
      id: "explosive",
      label: "Explosive Scatter",
      config: {
        text: "SUPERNOVA",
        scatterFactor: 1500,
        color: "#f43f5e",
        uppercase: true,
        textClassName: "text-6xl tracking-widest font-black uppercase",
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
