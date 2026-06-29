import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const scrambleRevealConfig: ComponentConfig = {
  slug: "scramble-reveal",
  name: "Scramble Reveal",
  category: "text",
  tags: ["scramble", "glitch", "reveal", "matrix", "random", "chars"],
  componentPath: "app/meta/text/TextEnter/ScrambleReveal.tsx",
  npmPackageName: "@reactbytes/scramble-reveal",
  version: "1.0.0",
  peerDependencies: {
    "framer-motion": "^12.38.0"
  },
  props: [
    {
      name: "text",
      type: "string",
      default: "CREATIVE",
      description: "The target text to reveal.",
    },
    {
      name: "scrambleChars",
      type: "string",
      default: "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*",
      description: "Characters used during the scramble phase.",
    },
    {
      name: "duration",
      type: "number",
      default: 0.8,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: "Duration of each animation phase in seconds.",
    },
    {
      name: "scrambleStagger",
      type: "number",
      default: 0.05,
      min: 0,
      max: 0.5,
      step: 0.01,
      description: "Delay increment for the initial scramble appearance.",
    },
    {
      name: "revealStagger",
      type: "number",
      default: 0.1,
      min: 0,
      max: 0.5,
      step: 0.01,
      description: "Delay increment for the final character reveal.",
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
      label: "Classic Push",
      config: {
        text: "CREATIVE",
        scrambleChars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        duration: 0.8,
        scrambleStagger: 0.05,
        revealStagger: 0.1,
        color: "#34d399",
        uppercase: true,
      },
    },
    {
      id: "matrix",
      label: "System Reveal",
      config: {
        text: "INITIALIZING",
        scrambleChars: "01",
        duration: 0.4,
        scrambleStagger: 0.02,
        revealStagger: 0.05,
        color: "#10b981",
        uppercase: true,
      },
    },
    {
      id: "cinematic",
      label: "Cinematic Slow",
      config: {
        text: "PROCESSED",
        scrambleChars: "!@#$%^&*",
        duration: 1.2,
        scrambleStagger: 0.08,
        revealStagger: 0.15,
        color: "#60a5fa",
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
