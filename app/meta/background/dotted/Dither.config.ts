import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const ditherConfig: ComponentConfig = {
  slug: "dither",
  name: "Dither Mesh",
  category: "background",
  componentPath: "app/meta/background/dotted/Dither.tsx",
  showDemoByDefault: true,
  demoVariant: "hero",
  npmPackageName: "@reactbytes/dither",
  version: "1.0.0",
  dependencies: {
    "gsap": ">=3.12.0",
  },
  peerDependencies: {
    "react": ">=18.0.0"
  },
  description: "An optimized, canvas-based Dither animation component using Perlin noise and GSAP for fluid, organic movement.",
  props: [
    {
      name: "spacing",
      type: "number",
      default: 10,
      min: 5,
      max: 30,
      step: 1,
      description: "The space between each dot in pixels.",
    },
    {
      name: "scale",
      type: "number",
      default: 450,
      min: 100,
      max: 800,
      step: 10,
      description: "The frequency scale of the Perlin noise wave. Larger values give smoother wave movements.",
    },
    {
      name: "intensity",
      type: "number",
      default: 7,
      min: 1,
      max: 20,
      step: 1,
      description: "The multiplier for Perlin noise heights, dictating the maximum dot size amplitude.",
    },
    {
      name: "duration",
      type: "number",
      default: 2,
      min: 0.5,
      max: 10,
      step: 0.5,
      description: "Loop duration of the GSAP stagger animation in seconds.",
    },
    {
      name: "stagger",
      type: "number",
      default: 4,
      min: 1,
      max: 15,
      step: 0.5,
      description: "The overall delay spread across the stagger effect grid.",
    },
    {
      name: "colorLight",
      type: "color",
      default: "#2299ee",
      description: "The primary color representing the inner glowing core of the dots.",
    },
    {
      name: "colorDark",
      type: "color",
      default: "#0022aa",
      description: "The secondary color representing the outer blur layer of the dots.",
    },
    {
      name: "colorBg",
      type: "color",
      default: "#000055",
      description: "The background canvas color.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Matrix",
      config: {
        spacing: 10,
        scale: 450,
        intensity: 7,
        duration: 2,
        stagger: 4,
        colorLight: "#2299ee",
        colorDark: "#0022aa",
        colorBg: "#000055",
      },
    },
    {
      id: "inferno",
      label: "Inferno Grid",
      config: {
        spacing: 8,
        scale: 250,
        intensity: 9,
        duration: 1.5,
        stagger: 3.5,
        colorLight: "#ff4400",
        colorDark: "#660000",
        colorBg: "#110000",
      },
    },
    {
      id: "acid",
      label: "Acid Rain",
      config: {
        spacing: 12,
        scale: 300,
        intensity: 6,
        duration: 3,
        stagger: 6,
        colorLight: "#00ff00",
        colorDark: "#003300",
        colorBg: "#000000",
      },
    },
    {
      id: "ghost",
      label: "Ghost Wave",
      config: {
        spacing: 14,
        scale: 600,
        intensity: 12,
        duration: 4,
        stagger: 8,
        colorLight: "#aaaaaa",
        colorDark: "#222222",
        colorBg: "#0c0c0c",
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
      title: "Libraries",
      items: [
        {
          name: "GSAP",
          role: "Animation Engine",
          url: "https://greensock.com/gsap/",
        },
      ],
    },
  ],
};
