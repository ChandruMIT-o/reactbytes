import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const malakorSingularityConfig: ComponentConfig = {
  slug: "malakor-singularity",
  name: "Malakor Singularity",
  category: "miscellaneous",
  tags: ["animation", "orb", "webgl", "interactive", "canvas"],
  componentPath: "app/meta/misc/MalakorSingularity/MalakorSingularity.tsx",
  npmPackageName: "@reactbytes/malakor-singularity",
  version: "1.0.0",
  dependencies: {},
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName:
    "w-full h-[600px] relative overflow-hidden flex items-center justify-center p-2",
  props: [
    {
      name: "hoverColor",
      type: "color",
      default: "#0b52ff",
      description:
        "Hex color representing the electric kinetic friction cursor trail.",
    },
    {
      name: "baseColor",
      type: "color",
      default: "#ffffff",
      description:
        "Hex color representing the background noise/singularity base intensity.",
    },
    {
      name: "speed",
      type: "number",
      default: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      description: "Animation/time modulation speed multiplier.",
    },
    {
      name: "complexity",
      type: "number",
      default: 24,
      min: 1,
      max: 30,
      step: 1,
      description: "The detail level of the fractal spiral iterations.",
    },
    {
      name: "noiseStrength",
      type: "number",
      default: 1.0,
      min: 0.0,
      max: 5.0,
      step: 0.1,
      description: "Amplitude of the spatial distortion noise.",
    },
    {
      name: "mouseSpring",
      type: "number",
      default: 0.085,
      min: 0.01,
      max: 0.5,
      step: 0.01,
      description: "Interpolation factor for mouse follow speed.",
    },
    {
      name: "hoverSensitivity",
      type: "number",
      default: 1.5,
      min: 0.0,
      max: 5.0,
      step: 0.1,
      description: "Sensitivity of the hover velocity pulse effect.",
    },
    {
      name: "singularityPower",
      type: "number",
      default: 5.0,
      min: 1.0,
      max: 10.0,
      step: 0.5,
      description: "Exponent controlling the radial falloff / core density.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Electric Blue (Default)",
      config: {
        hoverColor: "#0b52ff",
        baseColor: "#ffffff",
        speed: 1.0,
        complexity: 24,
        noiseStrength: 1.0,
        mouseSpring: 0.085,
        hoverSensitivity: 1.5,
        singularityPower: 5.0,
      },
    },
    {
      id: "purple",
      label: "Xenon Purple",
      config: {
        hoverColor: "#a855f7",
        baseColor: "#3b0764",
        speed: 1.5,
        complexity: 18,
        noiseStrength: 1.5,
        mouseSpring: 0.05,
        hoverSensitivity: 2.0,
        singularityPower: 6.0,
      },
    },
    {
      id: "green",
      label: "Aether Green",
      config: {
        hoverColor: "#10b981",
        baseColor: "#064e3b",
        speed: 0.5,
        complexity: 30,
        noiseStrength: 0.5,
        mouseSpring: 0.12,
        hoverSensitivity: 1.0,
        singularityPower: 4.0,
      },
    },
    {
      id: "solar-flare",
      label: "Solar Flare",
      config: {
        hoverColor: "#f97316",
        baseColor: "#ef4444",
        speed: 2.5,
        complexity: 28,
        noiseStrength: 2.0,
        mouseSpring: 0.1,
        hoverSensitivity: 2.5,
        singularityPower: 3.0,
      },
    },
    {
      id: "deep-void",
      label: "Deep Void",
      config: {
        hoverColor: "#06b6d4",
        baseColor: "#090d16",
        speed: 0.2,
        complexity: 12,
        noiseStrength: 0.8,
        mouseSpring: 0.03,
        hoverSensitivity: 0.5,
        singularityPower: 8.0,
      },
    },
  ],
  staticProps: {
    className:
      "relative w-full h-full bg-black overflow-hidden select-none cursor-crosshair rounded-xl",
  },
  credits: [
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
      title: "Libraries",
      items: [
        {
          name: "WebGL",
          role: "Graphics Pipeline",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
        },
      ],
    },
  ],
};