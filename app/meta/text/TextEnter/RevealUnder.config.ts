import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const revealUnderConfig: ComponentConfig = {
  slug: "reveal-under",
  name: "Reveal Under",
  category: "text",
  tags: ["reveal", "clip", "entrance", "underline", "wipe"],
  componentPath: "app/meta/text/TextEnter/RevealUnder.tsx",
  npmPackageName: "@reactbytes/reveal-under",
  version: "1.0.0",
  peerDependencies: {
    "framer-motion": "^12.38.0"
  },

  props: [
    {
      name: "firstWord",
      type: "string",
      default: "Hello",
      description: "The primary word that covers the reveal.",
    },
    {
      name: "secondWord",
      type: "string",
      default: "World",
      description: "The secondary word revealed from behind.",
    },
    {
      name: "direction",
      type: "select",
      default: "right",
      options: [
        { id: "right", label: "Right" },
        { id: "left", label: "Left" },
        { id: "top", label: "Top" },
        { id: "bottom", label: "Bottom" },
      ],
      description: "The direction in which the second word appears.",
    },
    {
      name: "duration",
      type: "number",
      default: 1.5,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: "Total animation time in seconds.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: true,
      description: "Whether to force the text to uppercase.",
    },
    {
      name: "color",
      type: "color",
      default: "#E8EAF0",
      description: "Hex color for the text.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        firstWord: "Hello",
        secondWord: "World",
        direction: "right",
        duration: 1.5,
        color: "#E8EAF0",
        uppercase: true,
      },
    },
    {
      id: "up",
      label: "Classic Reveal Up",
      config: {
        firstWord: "Reveal",
        secondWord: "Under",
        direction: "top",
        duration: 1.5,
        color: "#A78BFA",
        uppercase: true,
      },
    },
    {
      id: "rapid",
      label: "Rapid Punch",
      config: {
        firstWord: "PUNCH",
        secondWord: "OUT",
        direction: "left",
        duration: 0.6,
        color: "#2DD4BF",
        uppercase: true,
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
    }
  ],
  staticProps: {
    textClassName: "text-6xl font-bold tracking-tight font-mono",
  },
};
