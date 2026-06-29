import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const fallDownConfig: ComponentConfig = {
  slug: "fall-down",
  name: "Fall Down",
  category: "text",
  tags: ["fall", "drop", "entrance", "animation", "gravity", "stagger"],
  componentPath: "app/meta/text/TextEnter/FallDown.tsx",
  npmPackageName: "@reactbytes/fall-down",
  version: "1.0.0",
  peerDependencies: {
    "framer-motion": "^12.38.0"
  },
  props: [
    {
      name: "text",
      type: "string",
      default: "All Hail Rameez",
      description: "The text to display and animate.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: false,
      description: "Whether to force uppercase text.",
    },
    {
      name: "loop",
      type: "boolean",
      default: false,
      description: "Whether the animation should loop.",
    },
    {
      name: "duration",
      type: "number",
      default: 0.5,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: "Duration of the animation for each character in seconds.",
    },
    {
      name: "stagger",
      type: "number",
      default: 0.045,
      min: 0,
      max: 0.5,
      step: 0.005,
      description: "Delay between each character's animation in seconds.",
    },
    {
      name: "initialY",
      type: "number",
      default: -60,
      min: -400,
      max: 0,
      step: 10,
      description: "Initial vertical offset.",
    },
    {
      name: "color",
      type: "color",
      default: "#E8EAF0",
      description: "Hex color or any valid CSS color.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        text: "All Hail Rameez",
        duration: 0.5,
        stagger: 0.045,
        initialY: -60,
        color: "#E8EAF0",
        loop: false,
        uppercase: false,
      },
    },
    {
      id: "dramatic",
      label: "Dramatic Drop",
      config: {
        text: "REACTION",
        duration: 0.8,
        stagger: 0.08,
        initialY: -200,
        color: "#FF4D4D",
        loop: true,
        uppercase: true,
      },
    },
    {
      id: "cascade",
      label: "Soft Cascade",
      config: {
        text: "WATERFALL",
        duration: 1.2,
        stagger: 0.03,
        initialY: -40,
        color: "#4DFFB8",
        loop: false,
        uppercase: true,
      },
    },
    {
      id: "rapid",
      label: "Rapid Entry",
      config: {
        text: "FASTEST",
        duration: 0.3,
        stagger: 0.02,
        initialY: -100,
        color: "#4D96FF",
        loop: false,
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
    {
      title: "Inspiration",
      items: [
        {
          name: "JP Belley",
          role: "Visual Designer",
          url: "https://jeanphilippebelley.com/",
        },
      ],
    }
  ],
  staticProps: {
    textClassName: "text-[clamp(3rem,10cqw,5rem)] tracking-tighter text-center",
  },
};
