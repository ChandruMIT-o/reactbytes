import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const magneticTextConfig: ComponentConfig = {
  slug: "magnetic-text",
  name: "Magnetic Repel",
  category: "text",
  componentPath: "app/meta/text/Interactive/MagneticText.tsx",
  npmPackageName: "@reactbytes/magnetic-repel",
  version: "1.0.0",
  context_from_dev: "Applies physics-based repulsion force on letters as the user moves their cursor nearby. Supports touch events. Performance optimization: uses inline style transform updates rather than React state changes during cursor movement to prevent render bottlenecks.",
  props: [
    {
      name: "text",
      type: "string",
      default: "ELASTICITY",
      description: "The text to repel away from the cursor.",
    },
    {
      name: "maxDistance",
      type: "number",
      default: 140,
      min: 50,
      max: 400,
      step: 10,
      description: "The activation distance for the repulsion physics.",
    },
    {
      name: "repelForce",
      type: "number",
      default: 30,
      min: 0,
      max: 150,
      step: 5,
      description: "The multiplier for the strength of the magnetic push.",
    },
    {
      name: "hoverColor",
      type: "color",
      default: "#c084fc",
      description: "Color to apply when the character is deflected.",
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
      description: "Tailwind classes for text styling.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Bounce",
      config: {
        text: "ELASTICITY",
        maxDistance: 140,
        repelForce: 30,
        hoverColor: "#c084fc",
        color: "#FFFFFF",
        uppercase: true,
        textClassName: "text-5xl font-bold",
      },
    },
    {
      id: "intense",
      label: "Intense Push",
      config: {
        text: "REPULSION",
        maxDistance: 250,
        repelForce: 80,
        hoverColor: "#ef4444",
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
