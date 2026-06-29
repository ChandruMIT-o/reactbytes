import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const shinyButtonConfig: ComponentConfig = {
  slug: "shiny-button",
  name: "Shiny CTA",
  category: "miscellaneous",
  tags: ["button", "shiny", "cta", "gradient", "hover", "gleam"],
  componentPath: "app/meta/buttons/ShinyButton/ShinyButton.tsx",
  npmPackageName: "@reactbytes/shiny-cta",
  version: "1.0.0",
  dependencies: {
    "framer-motion": "^12.38.0",
  },
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  context_from_dev:
    "A sleek, glowing call-to-action button featuring animated gradients rotating around its border. Requires modern CSS support for CSS.registerProperty. Best used for critical action items such as signups or waitlist forms.",
  containerClassName:
    "w-full min-h-[400px] flex items-center justify-center p-12 bg-black rounded-[32px] border border-white/5 relative overflow-hidden group",
  props: [
    {
      name: "text",
      type: "string",
      default: "Join the waitlist",
      description: "Label displayed on the button.",
    },
    {
      name: "duration",
      type: "number",
      default: 3,
      min: 0.5,
      max: 10.0,
      step: 0.5,
      description: "Rotation speed of the border gradient in seconds.",
    },
    {
      name: "highlightColor",
      type: "color",
      default: "rgb(0, 0, 255)",
      description: "Primary color for the border and shimmer energy.",
    },
    {
      name: "highlightSubtleColor",
      type: "color",
      default: "#8484ff",
      description:
        "Secondary color used for high-intensity highlights on hover.",
    },
    {
      name: "baseColor",
      type: "color",
      default: "#000000",
      description: "Background color of the button.",
    },
    {
      name: "textColor",
      type: "color",
      default: "#ffffff",
      description: "Color of the label text.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Blue Plasma",
      config: {
        text: "Join the waitlist",
        highlightColor: "rgb(0, 0, 255)",
        highlightSubtleColor: "#8484ff",
        duration: 3,
        baseColor: "#000000",
        textColor: "#ffffff",
      },
    },
    {
      id: "emerald-pulse",
      label: "Emerald Pulse",
      config: {
        text: "Join the waitlist",
        highlightColor: "rgb(0, 255, 100)",
        highlightSubtleColor: "#a7f3d0",
        duration: 2,
        baseColor: "#022c22",
        textColor: "#ffffff",
      },
    },
    {
      id: "amber-glow",
      label: "Amber Glow",
      config: {
        text: "Join the waitlist",
        highlightColor: "rgb(255, 165, 0)",
        highlightSubtleColor: "#fde68a",
        duration: 4,
        baseColor: "#1c0a00",
        textColor: "#ffffff",
      },
    },
    {
      id: "crimson-rush",
      label: "Crimson Rush",
      config: {
        text: "Join the waitlist",
        highlightColor: "rgb(255, 0, 80)",
        highlightSubtleColor: "#fda4af",
        duration: 1.5,
        baseColor: "#2d000a",
        textColor: "#ffffff",
      },
    },
    {
      id: "monochrome",
      label: "Silver Blade",
      config: {
        text: "Join the waitlist",
        highlightColor: "rgb(255, 255, 255)",
        highlightSubtleColor: "#d4d4d8",
        duration: 5,
        baseColor: "#09090b",
        textColor: "#ffffff",
      },
    },
  ],
  credits: [
    {
      title: "Libraries",
      items: [
        {
          name: "Framer Motion",
          role: "Animation Library",
          url: "https://framer.com/motion",
        },
      ],
    },
    {
      title: "Project Author",
      items: [
        {
          name: "ChandruMIT-o",
          role: "Creator & Lead Designer",
          url: "https://github.com/ChandruMIT-o",
        },
      ],
    },
    {
      title: "Inspiration",
      items: [
        {
          name: "Ryan Mulligan",
          role: "Article Reference",
          url: "https://ryanmulligan.dev/blog/css-property-new-style/",
        },
      ],
    },
  ],
};
