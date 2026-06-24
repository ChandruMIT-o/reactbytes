import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const rotaryCarouselConfig: ComponentConfig = {
  slug: "rotary-carousel",
  name: "Rotary Dial Carousel",
  category: "carousel",
  tags: ["carousel", "rotary", "spin", "wheel", "3d"],
  componentPath: "app/meta/carousel/RotaryCarousel/RotaryCarousel.tsx",
  containerClassName:
    "w-full min-h-[520px] flex items-center justify-center relative bg-black/80 border border-white/5 rounded-2xl overflow-hidden !p-6",
  props: [
    {
      name: "ringDiameter",
      type: "number",
      default: 360,
      min: 280,
      max: 440,
      step: 10,
      description: "Diameter of the circular dial in pixels.",
    },
    {
      name: "springTension",
      type: "number",
      default: 0.24,
      min: 0.08,
      max: 0.45,
      step: 0.02,
      description:
        "Snappy mechanical spring tension coefficient (0.05 to 0.50).",
    },
    {
      name: "springDamping",
      type: "number",
      default: 0.38,
      min: 0.15,
      max: 0.65,
      step: 0.02,
      description:
        "Snap settlement dampening friction coefficient (0.10 to 0.70).",
    },
    {
      name: "visualizerLines",
      type: "number",
      default: 240,
      min: 60,
      max: 360,
      step: 10,
      description:
        "Density of visualizer radial line bars (number of bars plotted).",
    },
    {
      name: "visualizerAmp",
      type: "number",
      default: 1.2,
      min: 0.4,
      max: 2.5,
      step: 0.1,
      description: "Amplitude multiplier of the visualizer bars.",
    },
    {
      name: "visualizerSpread",
      type: "number",
      default: 1.5,
      min: 0.5,
      max: 3.0,
      step: 0.1,
      description:
        "Angular glow flare spread of visualizer bars around tracker handle.",
    },
    {
      name: "autoPlaySpeed",
      type: "number",
      default: 12,
      min: 4,
      max: 35,
      step: 1,
      description: "Progression rotation ticks per frame during idle autoplay.",
    },
    {
      name: "waveMode",
      type: "select",
      default: "surge",
      options: [
        { id: "surge", label: "Surge" },
        { id: "ambient", label: "Ambient" },
        { id: "silent", label: "Silent" },
      ],
      description:
        "Visualizer logic mode that drives the heights calculation formula.",
    },
    {
      name: "secondaryColor",
      type: "color",
      default: "#3b82f6",
      description: "Primary visualizer HSL/RGB glow color.",
    },
    {
      name: "bgSolidColor",
      type: "color",
      default: "#05020a",
      description: "Dial core bezel background solid color.",
    },
    {
      name: "isPlaying",
      type: "boolean",
      default: false,
      description: "Whether the dial carousel autoplays when idle.",
    },
    {
      name: "enableSynth",
      type: "boolean",
      default: false,
      description:
        "Whether the interactive FM tone synthesizer is enabled on dial jog.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Obsidian",
      config: {
        springTension: 0.24,
        springDamping: 0.38,
        ringDiameter: 360,
        visualizerLines: 240,
        visualizerAmp: 1.2,
        visualizerSpread: 1.5,
        autoPlaySpeed: 12,
        isPlaying: false,
        waveMode: "surge",
        secondaryColor: "#3b82f6",
        bgSolidColor: "#05020a",
        enableSynth: true,
      },
    },
    {
      id: "cyan",
      label: "Quantum Cyan",
      config: {
        springTension: 0.3,
        springDamping: 0.45,
        ringDiameter: 380,
        visualizerLines: 300,
        visualizerAmp: 1.5,
        visualizerSpread: 1.2,
        autoPlaySpeed: 18,
        isPlaying: true,
        waveMode: "surge",
        secondaryColor: "#06b6d4",
        bgSolidColor: "#02050c",
        enableSynth: true,
      },
    },
    {
      id: "amethyst",
      label: "Deep Amethyst",
      config: {
        springTension: 0.18,
        springDamping: 0.3,
        ringDiameter: 340,
        visualizerLines: 180,
        visualizerAmp: 0.9,
        visualizerSpread: 1.8,
        autoPlaySpeed: 8,
        isPlaying: false,
        waveMode: "ambient",
        secondaryColor: "#a855f7",
        bgSolidColor: "#040108",
        enableSynth: false,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "Rotary Dial visualizer",
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
          name: "Lucide React",
          role: "Icons",
          url: "https://lucide.dev",
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
      title: "Core Stack",
      items: [
        {
          name: "Next.js 16",
          role: "Framework",
          url: "https://nextjs.org",
        },
        {
          name: "Tailwind CSS v4",
          role: "Styling Engine",
          url: "https://tailwindcss.com",
        },
        {
          name: "Framer Motion",
          role: "Animation Library",
          url: "https://framer.com/motion",
        },
      ],
    },
  ],
};
