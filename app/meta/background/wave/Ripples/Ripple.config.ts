import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const rippleConfig: ComponentConfig = {
  slug: "ripple",
  name: "Interactive Ripple",
  category: "background",
  tags: ["ripple", "wave", "interactive", "mouse", "water", "click"],
  componentPath: "app/meta/background/wave/Ripples/Ripple.tsx",
  showDemoByDefault: true,
  demoVariant: "hero",
  props: [
    {
      name: "zoom",
      type: "number",
      default: 1.5,
      min: 0.5,
      max: 4.0,
      step: 0.05,
      description:
        "Zoom level of the ripple waves. Lower value results in visually larger wave patterns.",
    },
    {
      name: "speed",
      type: "number",
      default: 0.25,
      min: 0.05,
      max: 1.5,
      step: 0.01,
      description: "Speed multiplier of the wave movement.",
    },
    {
      name: "threadsFreq",
      type: "number",
      default: 28.0,
      min: 5.0,
      max: 60.0,
      step: 1.0,
      description:
        "Frequency / density of the interactive line threads in the wave mesh.",
    },
    {
      name: "brightness",
      type: "number",
      default: 1.8,
      min: 0.5,
      max: 4.0,
      step: 0.1,
      description:
        "Brightness / luminance multiplier of the shader output color.",
    },
    {
      name: "mouseInfluence",
      type: "number",
      default: 0.8,
      min: 0.0,
      max: 2.5,
      step: 0.05,
      description:
        "Distortion and wave-bending force relative to mouse movement.",
    },
    {
      name: "clickToSpike",
      type: "boolean",
      default: true,
      description:
        "Enables temporary high-intensity ripple shockwaves when clicking on the canvas.",
    },
    {
      name: "colorBase",
      type: "color",
      default: "#2673ff",
      description: "Base color used to tint the shader wave color.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Deep Cosmic",
      config: {
        zoom: 1.4,
        speed: 0.25,
        threadsFreq: 24.0,
        brightness: 1.8,
        mouseInfluence: 0.9,
        clickToSpike: true,
        colorBase: "#2673ff",
      },
    },
    {
      id: "cyberpunk",
      label: "Cyber Neon",
      config: {
        zoom: 1.8,
        speed: 0.45,
        threadsFreq: 38.0,
        brightness: 2.2,
        mouseInfluence: 1.2,
        clickToSpike: true,
        colorBase: "#ff1a99",
      },
    },
    {
      id: "emerald",
      label: "Emerald Silk",
      config: {
        zoom: 1.1,
        speed: 0.15,
        threadsFreq: 18.0,
        brightness: 1.4,
        mouseInfluence: 0.5,
        clickToSpike: true,
        colorBase: "#1ae666",
      },
    },
    {
      id: "solar",
      label: "Solar Flare",
      config: {
        zoom: 2.0,
        speed: 0.5,
        threadsFreq: 45.0,
        brightness: 2.5,
        mouseInfluence: 1.5,
        clickToSpike: true,
        colorBase: "#ff8000",
      },
    },
    {
      id: "monochrome",
      label: "Liquid Platinum",
      config: {
        zoom: 1.5,
        speed: 0.2,
        threadsFreq: 30.0,
        brightness: 1.6,
        mouseInfluence: 0.8,
        clickToSpike: true,
        colorBase: "#e6f2ff",
      },
    },
  ],
  credits: [
    {
      title: "Shader Design",
      items: [
        {
          name: "React Bytes",
          role: "Component and Preset Author",
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
          name: "WebGL",
          role: "Graphics API",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
        },
      ],
    },
  ],
};
