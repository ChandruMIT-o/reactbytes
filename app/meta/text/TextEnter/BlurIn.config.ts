import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const blurInConfig: ComponentConfig = {
  slug: "blur-in",
  name: "Blur In",
  category: "text",
  componentPath: "app/meta/text/TextEnter/BlurIn.tsx",
  props: [
    {
      name: "text",
      type: "string",
      default: "All Hail Rameez",
      description: "The text to be broken down and animated. Handles spaces automatically.",
    },
    {
      name: "duration",
      type: "number",
      default: 0.6,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: "How long each character takes to finish its animation (in seconds).",
    },
    {
      name: "stagger",
      type: "number",
      default: 0.04,
      min: 0,
      max: 0.5,
      step: 0.005,
      description: "The delay between each character's animation start.",
    },
    {
      name: "initialBlur",
      type: "number",
      default: 12,
      min: 0,
      max: 100,
      step: 2,
      description: "The initial blur intensity for the enter effect.",
    },
    {
      name: "color",
      type: "color",
      default: "#E8EAF0",
      description: "Hex color for the text.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: false,
      description: "Whether to force the text to uppercase.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        text: "All Hail Rameez",
        duration: 0.6,
        stagger: 0.04,
        initialBlur: 12,
        color: "#E8EAF0",
        uppercase: false,
      },
    },
    {
      id: "ethereal",
      label: "Ethereal Mist",
      config: {
        text: "ETHEREAL",
        duration: 1.5,
        stagger: 0.1,
        initialBlur: 32,
        color: "#A78BFA",
        uppercase: true,
      },
    },
    {
      id: "sharp",
      label: "Rapid Entry",
      config: {
        text: "REACTION",
        duration: 0.3,
        stagger: 0.02,
        initialBlur: 8,
        color: "#2DD4BF",
        uppercase: true,
      },
    },
    {
      id: "cascade",
      label: "Slow Cascade",
      config: {
        text: "BLURRING",
        duration: 2.0,
        stagger: 0.05,
        initialBlur: 24,
        color: "#FB7185",
        uppercase: true,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "JP Belley",
          role: "Visual Designer",
          url: "https://jeanphilippebelley.com/",
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
    textClassName: "text-6xl font-bold tracking-tight font-mono",
  },
};
