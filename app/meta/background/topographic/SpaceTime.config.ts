import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const spaceTimeConfig: ComponentConfig = {
  slug: "spacetime",
  name: "Spacetime Grid",
  category: "background",
  componentPath: "app/meta/background/topographic/SpaceTime.tsx",
  props: [
    {
      name: "loopDuration",
      type: "number",
      default: 1200,
      min: 400,
      max: 3000,
      step: 50,
      description: "Speed of the infinite loop in milliseconds.",
    },
    {
      name: "strokeColor",
      type: "color",
      default: "#00e5ff",
      description: "Hex color for the neon topographic grid lines.",
    },
    {
      name: "bgColor",
      type: "color",
      default: "#020205",
      description: "Background color of the space canvas.",
    },
    {
      name: "strokeWidth",
      type: "number",
      default: 4,
      min: 1,
      max: 12,
      step: 1,
      description: "Thickness of grid lines in pixels.",
    },
    {
      name: "parallaxAmount",
      type: "number",
      default: 0.04,
      min: 0.0,
      max: 0.2,
      step: 0.01,
      description: "Intensity of 3D parallax hover effect (movement scale).",
    },
    {
      name: "warpStrength",
      type: "number",
      default: -8,
      min: -20,
      max: 20,
      step: 1,
      description: "Intensity and direction of the time-reverse click warp force.",
    },
    {
      name: "distortionScale",
      type: "number",
      default: 7,
      min: 0,
      max: 30,
      step: 1,
      description: "Wobble distortion scale applied to the topographic lines.",
    },
    {
      name: "glowIntensity",
      type: "number",
      default: 0.4,
      min: 0.0,
      max: 1.0,
      step: 0.05,
      description: "Intensity scale (0 to 1) of drop shadows and ambient glows.",
    },
    {
      name: "noiseEnabled",
      type: "boolean",
      default: true,
      description: "Enables a static cyberpunk analog noise overlay pattern.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Spacetime Grid",
      config: {
        loopDuration: 1200,
        strokeColor: "#00e5ff",
        bgColor: "#020205",
        strokeWidth: 4,
        parallaxAmount: 0.04,
        warpStrength: -8,
        distortionScale: 7,
        glowIntensity: 0.4,
        noiseEnabled: true,
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
      title: "Open Source Libraries",
      items: [
        {
          name: "React",
          role: "UI Framework",
          url: "https://react.dev",
        },
        {
          name: "Tailwind CSS",
          role: "Styling",
          url: "https://tailwindcss.com",
        },
      ],
    },
  ],
};
