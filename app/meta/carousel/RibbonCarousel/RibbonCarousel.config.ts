import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const ribbonCarouselConfig: ComponentConfig = {
  slug: "ribbon-carousel",
  name: "Ribbon Carousel",
  category: "carousel",
  tags: ["carousel", "sinuous", "wave", "vertical", "ribbon", "inertia", "kinetic"],
  componentPath: "app/meta/carousel/RibbonCarousel/RibbonCarousel.tsx",
  npmPackageName: "@reactbytes/ribbon-carousel",
  version: "1.0.0",
  dependencies: {},
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName:
    "w-full min-h-[650px] flex items-center justify-center relative bg-neutral-950 border border-neutral-900 rounded-2xl overflow-hidden !p-0",
  props: [
    {
      name: "sensitivity",
      type: "number",
      default: 0.003,
      min: 0.001,
      max: 0.01,
      step: 0.001,
      description: "Scrolling sensitivity velocity multiplier for the vertical path timeline.",
    },
    {
      name: "damping",
      type: "number",
      default: 0.1,
      min: 0.02,
      max: 0.4,
      step: 0.01,
      description:
        "Linear interpolation smoothing factor. Lower values mean a smoother catch-up with heavier premium scroll weight.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Balanced Inertia",
      config: {
        sensitivity: 0.003,
        damping: 0.1,
      },
    },
    {
      id: "snappy",
      label: "Snappy Track",
      config: {
        sensitivity: 0.005,
        damping: 0.2,
      },
    },
    {
      id: "fluid",
      label: "Ultra Liquid",
      config: {
        sensitivity: 0.002,
        damping: 0.05,
      },
    },
  ],
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
  ],
};