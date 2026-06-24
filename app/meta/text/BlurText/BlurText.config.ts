import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const blurTextConfig: ComponentConfig = {
  slug: "blur-text",
  name: "Blur Text",
  category: "text",
  tags: [
    "blur",
    "animation",
    "entrance",
    "hero",
    "letters",
    "words",
    "stagger",
  ],
  componentPath: "app/meta/text/BlurText/BlurText.tsx",
  npmPackageName: "@reactbytes/blur-text",
  version: "1.0.1",
  peerDependencies: {
    "framer-motion": "^12.38.0",
  },
  context_from_dev:
    "Use this component to animate text with a smooth blur entry effect. It breaks down text into characters or words dynamically. Note: best used for hero headlines and text overlays, not for large bodies of paragraphs.",
  props: [
    {
      name: "triggerOnView",
      type: "boolean",
      default: true,
      description: "Whether animation waits until entering viewport."
    },
    {
      name: "initialBlur",
      type: "number",
      default: 10,
      min: 0,
      max: 100,
      step: 1,
      description: "Initial blur intensity."
    },
    {
      name: "color",
      type: "color",
      default: "#FFFFFF",
      description: "Text color."
    },
    {
      name: "text",
      type: "string",
      default: "All Hail Rameez",
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
      description:
        "Whether the animation should loop continuously (pulsing effect).",
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
      default:
        "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-rb-accent-2",
      description: "Additional wrapper CSS classes.",
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
        animateBy: "letters",
        direction: "none",
        initialBlur: 12,
        triggerOnView: false,
        color: "#E8EAF0",
        uppercase: false,
        className: "text-6xl font-bold tracking-tight font-mono",
        animationStyle: "blur-in",
      },
    },

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
        animationStyle: "blur-text",
        className:
          "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-rb-accent-2",
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
        className:
          "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-rb-accent-1",
        animationStyle: "blur-text",
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
        className:
          "text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-white",
        animationStyle: "blur-text",
      },
    },

    {
      id: "sharp",
      label: "Rapid Entry",
      config: {
        text: "REACTION",
        duration: 0.3,
        stagger: 0.02,
        animateBy: "letters",
        direction: "none",
        initialBlur: 8,
        triggerOnView: false,
        color: "#2DD4BF",
        uppercase: true,
        className: "text-6xl font-bold tracking-tight font-mono",
        animationStyle: "blur-in",
      },
    },

    {
      id: "ethereal",
      label: "Ethereal Mist",
      config: {
        text: "ETHEREAL",
        duration: 1.5,
        stagger: 0.1,
        animateBy: "letters",
        direction: "none",
        initialBlur: 32,
        triggerOnView: false,
        color: "#A78BFA",
        uppercase: true,
        className: "text-6xl font-bold tracking-tight font-mono",
        animationStyle: "blur-in",
      },
    },

    {
      id: "cascade",
      label: "Slow Cascade",
      config: {
        text: "BLURRING",
        duration: 2.0,
        stagger: 0.05,
        animateBy: "letters",
        direction: "none",
        initialBlur: 24,
        triggerOnView: false,
        color: "#FB7185",
        uppercase: true,
        className: "text-6xl font-bold tracking-tight font-mono",
        animationStyle: "blur-in",
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
