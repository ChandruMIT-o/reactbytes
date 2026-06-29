import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const elasticRevealConfig: ComponentConfig = {
  slug: "elastic-reveal",
  name: "Elastic Reveal",
  category: "text",
  tags: ["elastic", "spring", "hover", "reveal", "bounce"],
  componentPath: "app/meta/text/Hover/ElasticReveal.tsx",
  npmPackageName: "@reactbytes/elastic-reveal",
  version: "1.0.0",
  peerDependencies: {
    "framer-motion": "^12.38.0"
  },
  props: [
    {
      name: "text",
      type: "string",
      default: "REACTBYTES",
      description: "The text context to animate.",
    },
    {
      name: "duration",
      type: "number",
      default: 0.6,
      min: 0.1,
      max: 2,
      step: 0.1,
      description: "Animation duration for each letter in seconds.",
    },
    {
      name: "stagger",
      type: "number",
      default: 0.02,
      min: 0,
      max: 0.2,
      step: 0.01,
      description: "Delay increment between characters in seconds.",
    },
    {
      name: "direction",
      type: "select",
      default: "up",
      options: [
        { id: "up", label: "Roll Up" },
        { id: "down", label: "Roll Down" },
      ],
      description: "The direction letters roll towards.",
    },
    {
      name: "baseColor",
      type: "color",
      default: "#60a5fa",
      description: "The initial color of the text.",
    },
    {
      name: "hoverColor",
      type: "color",
      default: "#FFFFFF",
      description: "The color of the text when revealed on hover.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: true,
      description: "Whether to force the text to uppercase.",
    },
    {
      name: "animateFrom",
      type: "select",
      default: "left",
      options: [
        { id: "left", label: "Left to Right" },
        { id: "right", label: "Right to Left" },
        { id: "center", label: "Center Out" },
        { id: "hover", label: "Hover Point (Wave)" },
      ],
      description: "Determines the origin of the wave animation.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Classic Roll",
      config: {
        text: "REACTBYTES",
        duration: 0.6,
        stagger: 0.02,
        direction: "up",
        baseColor: "#60a5fa",
        hoverColor: "#FFFFFF",
        uppercase: true,
        animateFrom: "left",
      },
    },
    {
      id: "social",
      label: "Social Style",
      config: {
        text: "INSTAGRAM",
        duration: 0.8,
        stagger: 0.04,
        direction: "down",
        baseColor: "#c084fc",
        hoverColor: "#FFFFFF",
        uppercase: true,
        animateFrom: "center",
      },
    },
    {
      id: "rapid",
      label: "Rapid Kick",
      config: {
        text: "GO FAST",
        duration: 0.3,
        stagger: 0.01,
        direction: "up",
        baseColor: "#9ca3af",
        hoverColor: "#34d399",
        uppercase: true,
        animateFrom: "hover",
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
