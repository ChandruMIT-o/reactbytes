import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const iridescentGradientConfig: ComponentConfig = {
  slug: "iridescent-gradient",
  name: "Iridescent Gradient",
  category: "background",
  tags: ["iridescent", "gradient", "rainbow", "holographic", "color"],
  componentPath: "app/meta/background/gradient/IridescentGradient.tsx",
  showDemoByDefault: true,
  demoVariant: "hero",
  description: "A dynamic React background component featuring a fluid, shifting holographic rainbow animation with highly customizable blur, opacity, and speed controls.",
  npmPackageName: "@reactbytes/iridescent-gradient",
  version: "1.0.0",
  dependencies: {
    "framer-motion": "^12.0.0"
  },
  peerDependencies: {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  props: [
    {
      name: "title",
      type: "string",
      default: "An awesome title",
      description: "The title text to display in the center.",
    },
    {
      name: "switchText",
      type: "string",
      default: "switch bg",
      description: "The text for the switch label.",
    },
    {
      name: "bgColor",
      type: "color",
      default: "",
      description:
        "The background color. Defaults to #000 (dark) or #fff (light) depending on the switch state if not provided.",
    },
    {
      name: "animationDuration",
      type: "string",
      default: "60s",
      description: "Controls the speed of the shifting gradient (e.g., '30s', '60s').",
    },
    {
      name: "blurAmount",
      type: "string",
      default: "20px",
      description: "Controls the intensity of the background blur (e.g., '15px', '20px').",
    },
    {
      name: "opacity",
      type: "number",
      default: 1,
      description: "Optional explicit override for the background layer opacity (0 to 1).",
    },
    {
      name: "checked",
      type: "boolean",
      default: true,
      description: "Whether the dark mode is active.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        title: "An awesome title",
        switchText: "switch bg",
        bgColor: "",
        animationDuration: "60s",
        blurAmount: "20px",
        opacity: 1,
        checked: true,
      },
    },
    {
      id: "dreamy-aurora",
      label: "Dreamy Aurora",
      config: {
        title: "Ethereal Dreams",
        switchText: "Toggle Light",
        bgColor: "",
        animationDuration: "120s", // Ultra slow drift
        blurAmount: "45px",       // Highly dispersed, soft glow
        opacity: 0.8,
        checked: true,
      },
    },
    {
      id: "cyber-sharp",
      label: "Cyber Sharp",
      config: {
        title: "NEON OVERDRIVE",
        switchText: "System Override",
        bgColor: "#0a0a16",       // Custom deep cyber blue-black
        animationDuration: "15s",  // Fast, high energy
        blurAmount: "8px",         // Sharp geometric ribbing visible
        opacity: 1,
        checked: true,
      },
    },
    {
      id: "ghostly-mist",
      label: "Ghostly Mist",
      config: {
        title: "Subtle Textures",
        switchText: "Reveal",
        bgColor: "",
        animationDuration: "90s",
        blurAmount: "30px",
        opacity: 0.3,              // Very faint background presence
        checked: false,            // Defaulting to light mode variant
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
};