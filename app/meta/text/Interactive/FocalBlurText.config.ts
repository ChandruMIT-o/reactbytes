import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const focalBlurConfig: ComponentConfig = {
  slug: "focal-blur",
  name: "Focal Depth Blur",
  category: "text",
  tags: ["blur", "focus", "interactive", "mouse", "depth"],
  componentPath: "app/meta/text/Interactive/FocalBlurText.tsx",
  npmPackageName: "@reactbytes/focal-blur",
  version: "1.0.0",
  props: [
    {
      name: "text",
      type: "string",
      default: "PERSPECTIVE",
      description: "The text to apply the focal blur effect.",
    },
    {
      name: "maxDistance",
      type: "number",
      default: 250,
      min: 50,
      max: 600,
      step: 10,
      description:
        "The radial distance around the cursor where the focus takes effect.",
    },
    {
      name: "focusColor",
      type: "color",
      default: "#60a5fa",
      description:
        "Hex color for the highlighted text in focus. Pass 'inherit' to disable.",
    },
    {
      name: "maxBlur",
      type: "number",
      default: 12,
      min: 0,
      max: 36,
      step: 1,
      description: "Maximum blur pixel amount for out of focus elements.",
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
      default: "text-5xl font-black",
      description: "Tailwind classes for font size, weight, and layout.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Perspective",
      config: {
        text: "PERSPECTIVE",
        maxDistance: 250,
        maxBlur: 12,
        focusColor: "#60a5fa",
        color: "#FFFFFF",
        uppercase: true,
        textClassName: "text-5xl font-black",
      },
    },
    {
      id: "heavy_blur",
      label: "Heavy Depth",
      config: {
        text: "MYSTERY",
        maxDistance: 150,
        maxBlur: 24,
        focusColor: "#f43f5e",
        color: "#FFFFFF",
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
