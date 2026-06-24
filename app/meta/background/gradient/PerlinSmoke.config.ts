import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const perlinSmokeConfig: ComponentConfig = {
  slug: "perlin-smoke",
  name: "Perlin Smoke",
  category: "background",
  tags: ["perlin", "smoke", "noise", "fog", "wisp"],
  componentPath: "app/meta/background/gradient/PerlinSmoke.tsx",
  props: [
    {
      name: "baseColor",
      type: "color",
      default: "#1e1e1e",
      description: "Base color of the smoke effect (hex format).",
    },
    {
      name: "speed",
      type: "number",
      default: 0.08,
      min: 0,
      max: 0.2,
      step: 0.01,
      description: "Speed at which the smoke evolves over time.",
    },
    {
      name: "turbulence",
      type: "number",
      default: 0.5,
      min: 0,
      max: 1.0,
      step: 0.01,
      description: "Amount of noise and distortion applied to the smoke.",
    },
    {
      name: "milk",
      type: "number",
      default: 0.4,
      min: 0,
      max: 1.0,
      step: 0.01,
      description:
        "How 'milky' or white the brighter parts of the smoke should be.",
    },
    {
      name: "eco",
      type: "boolean",
      default: true,
      description:
        "Enables eco mode which dynamically changes resolution to save power.",
    },
    {
      name: "maxFPS",
      type: "number",
      default: 50,
      min: 30,
      max: 120,
      step: 1,
      description: "Maximum frames per second cap.",
    },
    {
      name: "mouseInteraction",
      type: "number",
      default: 0.5,
      min: 0,
      max: 2.0,
      step: 0.1,
      description: "Strength of the mouse pushing effect on the smoke.",
    },
  ],
  presets: [
    {
      id: "balanced",
      label: "Balanced",
      config: {
        baseColor: "#1e1e1e",
        speed: 0.08,
        turbulence: 0.5,
        milk: 0.4,
        eco: true,
        maxFPS: 50,
        mouseInteraction: 0.5,
      },
    },
    {
      id: "high",
      label: "High Performance",
      config: {
        baseColor: "#321e46",
        speed: 0.12,
        turbulence: 0.7,
        milk: 0.5,
        eco: false,
        maxFPS: 60,
        mouseInteraction: 0.8,
      },
    },
    {
      id: "eco",
      label: "Eco Friendly",
      config: {
        baseColor: "#000000",
        speed: 0.04,
        turbulence: 0.3,
        milk: 0.2,
        eco: true,
        maxFPS: 45,
        mouseInteraction: 0.3,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "React Bytes",
          role: "Collection",
          url: "https://reactbytes.dev",
        },
      ],
    },
    {
      title: "Technologies",
      items: [
        {
          name: "WebGL 2",
          role: "Graphics API",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
        },
      ],
    },
  ],
};
