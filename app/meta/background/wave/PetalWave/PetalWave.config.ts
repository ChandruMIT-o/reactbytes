import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const petalWaveConfig: ComponentConfig = {
  slug: "petal-wave",
  name: "Petal Wave",
  category: "background",
  tags: ["petal", "wave", "flower", "organic", "rotation"],
  componentPath: "app/meta/background/wave/PetalWave/PetalWave.tsx",
  props: [
    {
      name: "colorStart",
      type: "color",
      default: "#ef4444",
      description: "The base background/path color of the grid elements.",
    },
    {
      name: "colorEnd",
      type: "color",
      default: "#18181b",
      description: "The staggered wave animation fill color.",
    },
    {
      name: "speed",
      type: "number",
      default: 1.0,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      description:
        "Animation speed multiplier (GSAP timeScale). Controls loop speed.",
    },
    {
      name: "shape",
      type: "select",
      default: "petal",
      options: [
        { id: "petal", label: "Petal Lattice" },
        { id: "star", label: "Star Spikes" },
        { id: "diamond", label: "Diamond Grid" },
        { id: "ribbon", label: "Ribbon Wave" },
      ],
      description: "The geometry/shape preset used for path elements.",
    },
    {
      name: "staggerFrom",
      type: "select",
      default: "center",
      options: [
        { id: "center", label: "Center (Outward)" },
        { id: "start", label: "Top-Left (Forward)" },
        { id: "end", label: "Bottom-Right (Backward)" },
        { id: "edges", label: "Edges (Inward)" },
        { id: "random", label: "Random (Sparkle)" },
      ],
      description: "Where the wave ripple stagger originates.",
    },
    {
      name: "staggerAmount",
      type: "number",
      default: 6,
      min: 1.0,
      max: 15.0,
      step: 0.5,
      description: "The total staggered animation spread time in seconds.",
    },
    {
      name: "staggerEase",
      type: "select",
      default: "sine.in",
      options: [
        { id: "sine.in", label: "Sine In" },
        { id: "sine.out", label: "Sine Out" },
        { id: "sine.inOut", label: "Sine In-Out" },
        { id: "power1.in", label: "Power 1 In" },
        { id: "power1.out", label: "Power 1 Out" },
      ],
      description: "The easing function used for distribute staggering.",
    },
    {
      name: "ease",
      type: "select",
      default: "expo",
      options: [
        { id: "expo", label: "Expo (Sharp)" },
        { id: "power3.inOut", label: "Smooth Cubic" },
        { id: "sine.inOut", label: "Continuous Sine" },
        { id: "bounce.out", label: "Bouncy Elastic" },
      ],
      description: "The transitioning ease used for individual element morphs.",
    },
  ],
  presets: [
    {
      id: "crimson-ocean",
      label: "Crimson Ocean",
      config: {
        colorStart: "#ef4444",
        colorEnd: "#18181b",
        speed: 1.0,
        shape: "petal",
        staggerFrom: "center",
        staggerAmount: 6,
        staggerEase: "sine.in",
        ease: "expo",
      },
    },
    {
      id: "electric-lime",
      label: "Electric Lime",
      config: {
        colorStart: "#22c55e",
        colorEnd: "#09090b",
        speed: 1.2,
        shape: "star",
        staggerFrom: "edges",
        staggerAmount: 4.5,
        staggerEase: "power1.out",
        ease: "power3.inOut",
      },
    },
    {
      id: "sunset-horizon",
      label: "Sunset Horizon",
      config: {
        colorStart: "#f97316",
        colorEnd: "#1e1b4b",
        speed: 0.8,
        shape: "diamond",
        staggerFrom: "start",
        staggerAmount: 8,
        staggerEase: "sine.inOut",
        ease: "sine.inOut",
      },
    },
    {
      id: "cyberpunk",
      label: "Cyberpunk Glow",
      config: {
        colorStart: "#a855f7",
        colorEnd: "#172554",
        speed: 1.5,
        shape: "ribbon",
        staggerFrom: "random",
        staggerAmount: 5,
        staggerEase: "sine.in",
        ease: "bounce.out",
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
      title: "Libraries Used",
      items: [
        {
          name: "GSAP",
          role: "Animation Engine",
          url: "https://gsap.com",
        },
        {
          name: "React",
          role: "UI Framework",
          url: "https://react.dev",
        },
      ],
    },
  ],
};
