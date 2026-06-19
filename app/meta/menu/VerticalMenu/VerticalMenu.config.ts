import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const verticalMenuConfig: ComponentConfig = {
  slug: "vertical-menu",
  name: "Vertical Menu",
  category: "miscellaneous",
  componentPath: "app/meta/menu/VerticalMenu/VerticalMenu.tsx",
  containerClassName: "w-full min-h-[450px] !h-auto relative overflow-hidden flex items-center justify-end pr-12 group bg-[#060010] rounded-[18px] border border-white/5",
  props: [
    {
      name: "activeColor",
      type: "color",
      default: "#121AFF",
      description: "The text color of the selected menu item.",
    },
    {
      name: "hoverColor",
      type: "color",
      default: "#4753BF",
      description: "The text color of the hovered menu item.",
    },
    {
      name: "stiffness",
      type: "number",
      default: 300,
      min: 10,
      max: 1000,
      step: 10,
      description: "The stiffness of the spring animation.",
    },
    {
      name: "damping",
      type: "number",
      default: 30,
      min: 1,
      max: 100,
      step: 1,
      description: "The damping of the spring animation.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Classic Blue",
      config: {
        activeColor: "#121AFF",
        hoverColor: "#4753BF",
        stiffness: 300,
        damping: 30,
      },
    },
    {
      id: "slow-liquid",
      label: "Slow Liquid",
      config: {
        activeColor: "#10b981",
        hoverColor: "#059669",
        stiffness: 80,
        damping: 20,
      },
    },
    {
      id: "bouncy",
      label: "Bouncy Rose",
      config: {
        activeColor: "#f43f5e",
        hoverColor: "#e11d48",
        stiffness: 500,
        damping: 15,
      },
    },
    {
      id: "minimal-snap",
      label: "Minimal Snap",
      config: {
        activeColor: "#f59e0b",
        hoverColor: "#d97706",
        stiffness: 1000,
        damping: 50,
      },
    },
    {
      id: "electric",
      label: "Electric",
      config: {
        activeColor: "#8b5cf6",
        hoverColor: "#7c3aed",
        stiffness: 400,
        damping: 25,
      },
    },
  ],
  staticProps: {
    items: [
      { id: "home", label: "Home" },
      { id: "about", label: "About Us" },
      { id: "office", label: "Office Bearers" },
      { id: "activities", label: "ITA Activities" },
      { id: "gallery", label: "Gallery" },
      { id: "contact", label: "Contact" },
    ],
  },
  credits: [
    {
      title: "Open Source Libraries",
      items: [
        {
          name: "Framer Motion",
          role: "Animations",
          url: "https://www.framer.com/motion/",
        },
        {
          name: "Lucide React",
          role: "Icons",
          url: "https://lucide.dev/",
        },
      ],
    },
  ],
};
