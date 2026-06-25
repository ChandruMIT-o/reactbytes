import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const scrollWarpConfig: ComponentConfig = {
  slug: "scroll-warp",
  name: "Scroll Warp",
  category: "background",
  componentPath: "app/meta/background/space/ScrollWarp/ScrollWarp.tsx",
  showDemoByDefault: true,
  demoVariant: "hero",
  props: [
    {
      name: "numStars",
      type: "number",
      default: 1900,
      min: 100,
      max: 5000,
      step: 100,
      description: "Number of stars in the scene.",
    },
    {
      name: "baseTrailLength",
      type: "number",
      default: 2,
      min: 0,
      max: 10,
      step: 1,
      description: "Base length of the star trails when not in warp.",
    },
    {
      name: "maxTrailLength",
      type: "number",
      default: 30,
      min: 10,
      max: 150,
      step: 5,
      description: "Maximum length of the star trails during full warp.",
    },
    {
      name: "starColor",
      type: "color",
      default: "#d1ffff",
      description: "Color of the stars in HEX format.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Classic Clarity",
      config: {
        numStars: 1900,
        baseTrailLength: 2,
        maxTrailLength: 30,
        starColor: "#d1ffff",
      },
    },
    {
      id: "hyperdrive",
      label: "Hyperdrive Warp",
      config: {
        numStars: 3000,
        baseTrailLength: 5,
        maxTrailLength: 100,
        starColor: "#a0e0ff",
      },
    },
    {
      id: "nebula",
      label: "Cosmic Nebula",
      config: {
        numStars: 1500,
        baseTrailLength: 1,
        maxTrailLength: 45,
        starColor: "#ff5500",
      },
    },
    {
      id: "void",
      label: "Silent Void",
      config: {
        numStars: 500,
        baseTrailLength: 1,
        maxTrailLength: 20,
        starColor: "#ffffff",
      },
    },
  ],
  credits: [
    {
      title: "Implementation & Integration",
      items: [
        {
          name: "ReactBytes",
          role: "Author",
          url: "https://github.com/ReactBytes",
        },
      ],
    },
  ],
};
