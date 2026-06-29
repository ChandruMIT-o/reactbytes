import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const stackedCardCarouselConfig: ComponentConfig = {
  slug: "stacked-card-carousel",
  name: "Stacked Card Carousel",
  category: "carousel",
  tags: ["carousel", "cards", "stack", "slide", "3d"],
  componentPath:
    "app/meta/carousel/StackedCardCarousel/StackedCardCarousel.tsx",
  npmPackageName: "@reactbytes/stacked-card-carousel",
  version: "1.0.0",
  dependencies: {
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
  },
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName:
    "rounded-3xl border border-white/5 bg-zinc-950 min-h-[600px] !h-auto !p-0",
  props: [
    {
      name: "cardWidth",
      type: "number",
      default: 320,
      min: 200,
      max: 600,
      step: 10,
      description: "Width of each individual card in pixels.",
    },
    {
      name: "cardHeight",
      type: "number",
      default: 440,
      min: 300,
      max: 800,
      step: 10,
      description: "Height of each individual card in pixels.",
    },
  ],
  presets: [
    {
      id: "classic",
      label: "Classic (Default)",
      config: {
        cardWidth: 320,
        cardHeight: 440,
      },
    },
    {
      id: "compact",
      label: "Compact",
      config: {
        cardWidth: 280,
        cardHeight: 380,
      },
    },
    {
      id: "tall",
      label: "Tall & Elegant",
      config: {
        cardWidth: 300,
        cardHeight: 500,
      },
    },
    {
      id: "wide",
      label: "Large Display",
      config: {
        cardWidth: 400,
        cardHeight: 400,
      },
    },
    {
      id: "dramatic",
      label: "Dramatic Scale",
      config: {
        cardWidth: 450,
        cardHeight: 600,
      },
    },
  ],
  credits: [
    {
      title: "Libraries",
      items: [
        {
          name: "Framer Motion",
          role: "Animation Library",
          url: "https://framer.com/motion",
        },
        {
          name: "Lucide React",
          role: "Icon System",
          url: "https://lucide.dev/",
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
  ],
};
