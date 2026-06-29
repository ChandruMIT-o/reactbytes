import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const splitCarouselConfig: ComponentConfig = {
  slug: "split-carousel",
  name: "Split Carousel",
  category: "carousel",
  tags: ["carousel", "split", "reveal", "panels", "slide"],
  componentPath: "app/meta/carousel/SplitCarousel/SplitCarousel.tsx",
  npmPackageName: "@reactbytes/split-carousel",
  version: "1.0.0",
  dependencies: {},
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName:
    "rounded-2xl border border-white/5 bg-black min-h-[500px] !h-auto !p-0",
  props: [
    {
      name: "sensitivity",
      type: "number",
      default: 0.5,
      min: 0.1,
      max: 3.0,
      step: 0.1,
      description:
        "Controls how fast the animation advances based on mouse wheel speed.",
    },
    {
      name: "backgroundColor",
      type: "color",
      default: "#000000",
      description: "The background color of the carousel section.",
    },
    {
      name: "borderRadius",
      type: "number",
      default: 1.5,
      min: 0.0,
      max: 5.0,
      step: 0.1,
      description:
        "The border radius applied to the inner corners of the split images (in rem).",
    },
  ],
  presets: [
    {
      id: "standard",
      label: "Standard (Default)",
      config: {
        sensitivity: 0.5,
        backgroundColor: "#000000",
        borderRadius: 1.5,
      },
    },
    {
      id: "fast",
      label: "High Speed",
      config: {
        sensitivity: 1.5,
        backgroundColor: "#050505",
        borderRadius: 0,
      },
    },
    {
      id: "precise",
      label: "Precise",
      config: {
        sensitivity: 0.2,
        backgroundColor: "#111111",
        borderRadius: 3.0,
      },
    },
    {
      id: "vibrant",
      label: "Vibrant",
      config: {
        sensitivity: 0.8,
        backgroundColor: "#1a0b2e",
        borderRadius: 2.0,
      },
    },
    {
      id: "minimal",
      label: "Minimal",
      config: {
        sensitivity: 0.6,
        backgroundColor: "#000000",
        borderRadius: 0.5,
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
