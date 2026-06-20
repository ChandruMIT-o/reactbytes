import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const blurTextConfig: ComponentConfig = {
  slug: "blur-text",
  name: "Blur Text",
  category: "text",
  componentPath: "app/meta/text/BlurText/BlurText.tsx",
  npmPackageName: "@reactbytes/blur-text",
  version: "1.0.1",
  peerDependencies: {
    "framer-motion": "^12.38.0"
  },
  props: [
    {
      name: "text",
      type: "string",
      default: "BLURRY MOTION",
      description: "The text to be broken down and animated.",
    },
    {
      name: "animateBy",
      type: "select",
      default: "letters",
      options: [
        { id: "letters", label: "Letters" },
        { id: "words", label: "Words" },
      ],
      description: "Whether to animate each word or each letter individually.",
    },
    {
      name: "direction",
      type: "select",
      default: "top",
      options: [
        { id: "top", label: "Top" },
        { id: "bottom", label: "Bottom" },
        { id: "none", label: "None" },
      ],
      description: "The direction from which the text elements appear.",
    },
    {
      name: "duration",
      type: "number",
      default: 0.5,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: "The duration of the animation for each individual element.",
    },
    {
      name: "stagger",
      type: "number",
      default: 0.05,
      min: 0,
      max: 1,
      step: 0.01,
      description: "Stagger delay between each element in seconds.",
    },
    {
      name: "delay",
      type: "number",
      default: 0,
      min: 0,
      max: 2,
      step: 0.1,
      description: "Base delay before the animation sequence starts.",
    },
    {
      name: "loop",
      type: "boolean",
      default: false,
      description: "Whether the animation should loop continuously (pulsing effect).",
    },
    {
      name: "blurAmount",
      type: "number",
      default: 10,
      min: 0,
      max: 100,
      step: 1,
      description: "The peak blur intensity in pixels.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: true,
      description: "Whether to force the text to uppercase.",
    },
    {
      name: "className",
      type: "string",
      default: "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-rb-accent-2",
      description: "Additional wrapper CSS classes.",
    },
  ],
  presets: [
    {
      id: "soft-reveal",
      label: "Soft Reveal",
      config: {
        text: "SOFT REVEAL",
        duration: 0.5,
        stagger: 0.04,
        animateBy: "letters",
        direction: "top",
        delay: 0,
        loop: false,
        blurAmount: 8,
        uppercase: true,
        className: "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-rb-accent-2",
      },
    },
    {
      id: "infinite-fog",
      label: "Infinite Fog",
      config: {
        text: "DREAMY...",
        duration: 1.2,
        stagger: 0.1,
        animateBy: "letters",
        direction: "none",
        delay: 0,
        loop: true,
        blurAmount: 20,
        uppercase: true,
        className: "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-rb-accent-1",
      },
    },
    {
      id: "smoky",
      label: "Smoky Entrance",
      config: {
        text: "SMOKY MOTION",
        duration: 1.8,
        stagger: 0.08,
        animateBy: "letters",
        direction: "bottom",
        delay: 0,
        loop: false,
        blurAmount: 40,
        uppercase: true,
        className: "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white",
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
          name: "Framer Motion",
          role: "Animation",
          url: "https://framer.com/motion",
        },
      ],
    },
  ],
  staticProps: {},
};
