import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const gooeyMorphConfig: ComponentConfig = {
  slug: "gooey-morph",
  name: "Gooey Morph",
  category: "text",
  componentPath: "app/meta/text/Morph/GooeyMorph.tsx",
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
          name: "Creative Designs",
          role: "Visual Designer",
          url: "https://codepen.io/lmgonzalves/pen/XWwjYmO",
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
        {
          name: "Framer Motion",
          role: "Animations",
          url: "https://www.framer.com/motion/",
        },
        {
          name: "Tailwind CSS",
          role: "Styling",
          url: "https://tailwindcss.com",
        },
      ],
    },
  ],
  staticProps: {
    textClassName: "text-4xl md:text-6xl font-bold font-sans tracking-tighter",
  },
};
