import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const holoCardConfig: ComponentConfig = {
  slug: "holo-card",
  name: "Holographic Card",
  category: "miscellaneous",
  tags: ["holographic", "card", "tilt", "iridescent", "3d", "hover"],
  componentPath: "app/meta/card/HoloCard/HoloCard.tsx",
  npmPackageName: "@reactbytes/holo-card",
  version: "1.0.0",
  dependencies: {
    "lucide-react": "^1.7.0",
  },
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName:
    "w-full min-h-[500px] !h-auto flex items-center justify-center bg-[#060010] rounded-[18px] border border-white/5 p-12 overflow-hidden",
  props: [
    {
      name: "image",
      type: "string",
      default:
        "https://images.unsplash.com/photo-1674849555293-9ef7e42f9048?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Nzc1ODAxODY&ixlib=rb-4.0.3&q=80",
      description: "The background image of the card.",
    },
    {
      name: "showContent",
      type: "boolean",
      default: true,
      description: "Toggles the visibility of inner card text elements.",
    },
    {
      name: "holoEffect",
      type: "select",
      default: "linear",
      options: [
        { id: "linear", label: "Linear Rainbow" },
        { id: "radial", label: "Radial Rainbow" },
        { id: "hexagonal", label: "Hexagonal Grid" },
      ],
      description: "The pattern type for the holographic effect.",
    },
    {
      name: "holoIntensity",
      type: "number",
      default: 1.0,
      min: 0.0,
      max: 2.5,
      step: 0.1,
      description: "Multiplier for the opacity of the holographic effect.",
    },
    {
      name: "colorShift",
      type: "number",
      default: 0,
      min: 0,
      max: 360,
      step: 10,
      description: "Hue rotation for the holo effect in degrees.",
    },
    {
      name: "holoRotation",
      type: "number",
      default: 133,
      min: 0,
      max: 360,
      step: 1,
      description:
        "Rotation angle for the holographic light bands (in degrees).",
    },
    {
      name: "tiltSpread",
      type: "number",
      default: 15,
      min: 0,
      max: 40,
      step: 1,
      description: "Controls the intensity of the 3D tilt effect.",
    },
    {
      name: "hoverScale",
      type: "number",
      default: 1.04,
      min: 1.0,
      max: 1.2,
      step: 0.01,
      description: "Controls the scale of the card on hover.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Operative",
      config: {
        image:
          "https://images.unsplash.com/photo-1674849555293-9ef7e42f9048?crop=entropy&cs=tinysrgb&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2Nzc1ODAxODY&ixlib=rb-4.0.3&q=80",
        showContent: true,
        tiltSpread: 15,
        hoverScale: 1.04,
        holoEffect: "linear",
        holoIntensity: 1,
        colorShift: 0,
        holoRotation: 133,
      },
    },
    {
      id: "cyber-core",
      label: "Cyber Core",
      config: {
        image:
          "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop",
        showContent: true,
        tiltSpread: 20,
        hoverScale: 1.08,
        holoEffect: "hexagonal",
        holoIntensity: 1.5,
        colorShift: 180,
        holoRotation: 45,
      },
    },
    {
      id: "minimalist-frost",
      label: "Minimalist Frost",
      config: {
        image:
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
        showContent: true,
        tiltSpread: 10,
        hoverScale: 1.02,
        holoEffect: "radial",
        holoIntensity: 0.8,
        colorShift: 240,
        holoRotation: 0,
      },
    },
    {
      id: "pure-hologram",
      label: "Pure Hologram",
      config: {
        image:
          "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2111&auto=format&fit=crop",
        showContent: false,
        tiltSpread: 25,
        hoverScale: 1.05,
        holoEffect: "radial",
        holoIntensity: 1.2,
        colorShift: 90,
        holoRotation: 90,
      },
    },
  ],
  credits: [
    {
      title: "Libraries",
      items: [
        {
          name: "Lucide React",
          role: "Icon System",
          url: "https://lucide.dev/",
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
          name: "Simey",
          role: "Original CSS Holo Logic",
          url: "https://codepen.io/simeydotme/pen/PrQKgo",
        },
      ],
    },
  ],
};
