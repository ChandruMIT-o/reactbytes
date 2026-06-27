import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const blackHoleConfig: ComponentConfig = {
  slug: "black-hole",
  name: "Spacetime Black Hole",
  category: "background",
  tags: ["black hole", "space", "gravity", "vortex", "particles", "monochrome"],
  componentPath: "app/meta/background/space/BlackHole.tsx",
  description: "A high-contrast monochromatic spacetime tunnel background featuring pulsing concentric discs, static line grids, and masked square dust particles interacting via hardware CSS blend modes and a Web Audio sub-hum synthesizer.",
  npmPackageName: "@reactbytes/black-hole",
  version: "1.1.0",
  dependencies: {},
  peerDependencies: {
    react: "^18.0.0",
  },
  showDemoByDefault: true,
  demoVariant: "text",
  props: [
    {
      name: "speed",
      type: "number",
      default: 1.0,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      description:
        "Speed multiplier for the concentric disc pulse progression and radiation particle timeline.",
    },
    {
      name: "soundEnabled",
      type: "boolean",
      default: false,
      description:
        "Toggles a continuous space-hum synthesized audio layer using Web Audio API low-frequency oscillators.",
    },
    {
      name: "particleCount",
      type: "number",
      default: 100,
      min: 10,
      max: 500,
      step: 10,
      description:
        "Total number of simulated radiation particles in the event horizon field.",
    },
    {
      name: "bgColor",
      type: "color",
      default: "#141414",
      description:
        "Ambient background color of the spacetime simulation.",
    },
    {
      name: "lineColor",
      type: "color",
      default: "#444444",
      description:
        "Hex color of the concentric coordinate grid lines.",
    },
    {
      name: "particleColor",
      type: "color",
      default: "#ffffff",
      description:
        "Hex color of the radiation particles drawn around the black hole.",
    },
    {
      name: "glowColor",
      type: "color",
      default: "#a900ff",
      description:
        "Singularity core blending overlay color (event horizon shadow).",
    },
    {
      name: "auraColor",
      type: "color",
      default: "#00f8f1",
      description:
        "Primary neon color of the gravitational distortion field aura.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Standard Singularity",
      config: {
        speed: 1.0,
        soundEnabled: false,
        particleCount: 100,
        bgColor: "#141414",
        lineColor: "#444444",
        particleColor: "#ffffff",
        glowColor: "#a900ff",
        auraColor: "#00f8f1",
      },
    },
    {
      id: "accelerated",
      label: "Kinetic Compression",
      config: {
        speed: 2.2,
        soundEnabled: false,
        particleCount: 200,
        bgColor: "#0d0a12",
        lineColor: "#5e3a8c",
        particleColor: "#d2b4ff",
        glowColor: "#8a2be2",
        auraColor: "#ff007f",
      },
    },
    {
      id: "resonant",
      label: "Resonating Core",
      config: {
        speed: 0.6,
        soundEnabled: true,
        particleCount: 60,
        bgColor: "#02090b",
        lineColor: "#1f4a4e",
        particleColor: "#7efcf6",
        glowColor: "#005f73",
        auraColor: "#0a9396",
      },
    },
    {
      id: "overloaded",
      label: "Gravitational Collapse",
      config: {
        speed: 3.0,
        soundEnabled: true,
        particleCount: 300,
        bgColor: "#0c0202",
        lineColor: "#5a1111",
        particleColor: "#ff9e9e",
        glowColor: "#b7094c",
        auraColor: "#ff4747",
      },
    },
    {
      id: "corona",
      label: "Solar Corona",
      config: {
        speed: 1.2,
        soundEnabled: false,
        particleCount: 150,
        bgColor: "#0f0802",
        lineColor: "#5c3d14",
        particleColor: "#ffeaa7",
        glowColor: "#e67e22",
        auraColor: "#f1c40f",
      },
    },
    {
      id: "monochrome",
      label: "Monochrome Matrix",
      config: {
        speed: 0.8,
        soundEnabled: false,
        particleCount: 120,
        bgColor: "#000000",
        lineColor: "#333333",
        particleColor: "#ffffff",
        glowColor: "#111111",
        auraColor: "#555555",
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