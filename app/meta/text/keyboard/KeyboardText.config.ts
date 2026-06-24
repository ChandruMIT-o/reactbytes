import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const keyboardTextConfig: ComponentConfig = {
  slug: "keyboard-text",
  name: "Keyboard Text",
  category: "text",
  tags: ["keyboard", "typing", "keys", "mechanical", "click"],
  componentPath: "app/meta/text/keyboard/KeyboardText.tsx",
  props: [
    {
      name: "text",
      type: "string",
      default: "KEYBOARD",
      description: "The text sequence to apply the ghost typing effect to.",
    },
    {
      name: "yBounce",
      type: "number",
      default: 10,
      min: 0,
      max: 35,
      step: 1,
      description:
        "The distance in pixels each character travels downward mimicking a key press.",
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
  ],
  presets: [
    {
      id: "default",
      label: "Classic Keyboard",
      config: {
        text: "KEYBOARD",
        yBounce: 10,
        color: "#FFFFFF",
        uppercase: true,
      },
    },
    {
      id: "deep-press",
      label: "Deep Press",
      config: {
        text: "TYPEWRITER",
        yBounce: 25,
        color: "#fca5a5",
        uppercase: true,
      },
    },
    {
      id: "subtle",
      label: "Subtle Taps",
      config: {
        text: "GHOSTLY",
        yBounce: 4,
        color: "#94a3b8",
        uppercase: true,
      },
    },
  ],
  credits: [
    {
      title: "Concept Origin",
      items: [
        {
          name: "Juxtopposed",
          role: "Visual Concept",
          url: "https://x.com/juxtopposed/status/1691908961086378042?s=20",
        },
      ],
    },
    {
      title: "Implementation Utilities",
      items: [
        {
          name: "Framer Motion",
          role: "Animation Layout",
          url: "https://www.framer.com/motion/",
        },
        {
          name: "React Bytes",
          role: "Collection",
          url: "https://reactbytes.dev",
        },
      ],
    },
  ],
  staticProps: {
    className:
      "text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] tracking-tighter mix-blend-difference z-10 font-[Poppins]",
  },
};
