import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const fallDownConfig: ComponentConfig = {
  slug: "fall-down",
  name: "Fall Down",
  category: "text",
  componentPath: "app/meta/text/TextEnter/FallDown.tsx",
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
