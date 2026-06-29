import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const gooeyMorphConfig: ComponentConfig = {
  slug: "gooey-morph",
  name: "Gooey Morph",
  category: "text",
  tags: ["gooey", "morph", "liquid", "transition", "blob"],
  componentPath: "app/meta/text/Morph/GooeyMorph.tsx",
  npmPackageName: "@reactbytes/gooey-morph",
  version: "1.0.0",
  peerDependencies: {
    "framer-motion": "^12.38.0"
  },
  props: [
    {
      name: "words",
      type: "string",
      default: "CREATE, DESIGN, DEVELOP",
      description: "The list of words to rotate through (separated by commas).",
    },
    {
      name: "duration",
      type: "number",
      default: 3,
      min: 1,
      max: 10,
      step: 0.5,
      description: "Time spent on each word in seconds.",
    },
    {
      name: "morphSpeed",
      type: "number",
      default: 1,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: "Speed of the morph transition in seconds.",
    },
    {
      name: "yOffset",
      type: "number",
      default: 20,
      min: 0,
      max: 100,
      step: 1,
      description: "Vertical displacement during the morph.",
    },
    {
      name: "color",
      type: "color",
      default: "#34d399",
      description: "The base color of the text letters.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: true,
      description: "Whether to force the text to uppercase.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        words: "CREATE, DESIGN, DEVELOP",
        duration: 3,
        morphSpeed: 1,
        color: "#34d399",
        yOffset: 20,
        uppercase: true,
      },
    },
    {
      id: "coding",
      label: "Coding Flow",
      config: {
        words: "CODE, BUILD, SHIP",
        duration: 2,
        morphSpeed: 0.8,
        color: "#60a5fa",
        yOffset: 30,
        uppercase: true,
      },
    },
    {
      id: "slow-vibes",
      label: "Slow Vibes",
      config: {
        words: "BREATHE, RELAX, CREATE",
        duration: 5,
        morphSpeed: 2,
        color: "#c084fc",
        yOffset: 10,
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
    },
  ],
  staticProps: {
    textClassName: "text-[clamp(2.5rem,8cqw,4.5rem)] font-bold font-sans tracking-tighter text-center",
  },
};
