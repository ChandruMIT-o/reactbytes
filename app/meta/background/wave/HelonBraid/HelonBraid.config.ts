import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const helonBraidConfig: ComponentConfig = {
  slug: "helon-braid",
  name: "Helon Braid",
  category: "background",
  tags: ["braid", "wave", "rope", "weave", "ribbon"],
  componentPath: "app/meta/background/wave/HelonBraid/HelonBraid.tsx",
  props: [
    {
      name: "spacingX",
      type: "number",
      default: 80,
      min: 30,
      max: 200,
      step: 1,
      description: "Horizontal node spacing (which defines cell columns).",
    },
    {
      name: "baseRadius",
      type: "number",
      default: 65,
      min: 20,
      max: 200,
      step: 1,
      description: "Structural blueprint arc radius and spacing factor.",
    },
    {
      name: "speed",
      type: "number",
      default: 0.05,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      description: "Base speed coefficient for wave animations.",
    },
    {
      name: "excitationMultiplier",
      type: "number",
      default: 12,
      min: 1,
      max: 30,
      step: 1,
      description: "Intensity multiplier of node-trigger excitations.",
    },
    {
      name: "baseHue",
      type: "number",
      default: 190,
      min: 0,
      max: 360,
      step: 1,
      description: "Target HSL base color hue (0-360 range).",
    },
    {
      name: "backgroundColor",
      type: "color",
      default: "#070a12",
      description:
        "Background container color (also used for masking Over/Under weaving layers).",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Preon",
      config: {
        spacingX: 80,
        baseRadius: 65,
        speed: 0.05,
        excitationMultiplier: 12,
        baseHue: 190,
        backgroundColor: "#070a12",
      },
    },
    {
      id: "cosmic",
      label: "Cosmic Braid",
      config: {
        spacingX: 120,
        baseRadius: 100,
        speed: 0.02,
        excitationMultiplier: 18,
        baseHue: 280,
        backgroundColor: "#080315",
      },
    },
    {
      id: "hyper",
      label: "Quantum Flare",
      config: {
        spacingX: 50,
        baseRadius: 40,
        speed: 0.12,
        excitationMultiplier: 25,
        baseHue: 340,
        backgroundColor: "#11020a",
      },
    },
    {
      id: "emerald",
      label: "Bio Synapse",
      config: {
        spacingX: 95,
        baseRadius: 75,
        speed: 0.04,
        excitationMultiplier: 10,
        baseHue: 140,
        backgroundColor: "#020f08",
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "Helon Braid Grid",
          role: "Creative Developer",
          url: "https://reactbytes.dev",
        },
      ],
    },
    {
      title: "Open Source Libraries",
      items: [
        {
          name: "React",
          role: "UI Library",
          url: "https://react.dev",
        },
        {
          name: "Canvas API",
          role: "Rendering Engine",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
        },
      ],
    },
  ],
};
