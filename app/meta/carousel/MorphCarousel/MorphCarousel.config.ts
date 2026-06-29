import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const morphCarouselConfig: ComponentConfig = {
  slug: "morph-carousel",
  name: "Morph Carousel",
  category: "carousel",
  tags: ["carousel", "morph", "shape", "transition", "fluid"],
  componentPath: "app/meta/carousel/MorphCarousel/MorphCarousel.tsx",
  npmPackageName: "@reactbytes/morph-carousel",
  version: "1.0.0",
  dependencies: {
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
  },
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName: "!p-0 !h-auto w-full max-w-5xl",
  props: [
    {
      name: "distortion",
      type: "number",
      default: 1.0,
      min: 0,
      max: 5,
      step: 0.1,
      description: "Intensity of the morph distortion effect.",
    },
    {
      name: "transitionDuration",
      type: "number",
      default: 1200,
      min: 200,
      max: 5000,
      step: 100,
      description: "Duration of the transition in ms.",
    },
    {
      name: "scale",
      type: "number",
      default: 3.5,
      min: 0.5,
      max: 10,
      step: 0.1,
      description: "Scale of the noise pattern.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        distortion: 1.0,
        transitionDuration: 1200,
        scale: 3.5,
      },
    },
    {
      id: "liquid-high",
      label: "Liquid High",
      config: {
        distortion: 2.5,
        transitionDuration: 2000,
        scale: 5.0,
      },
    },
    {
      id: "snappy",
      label: "Snappy",
      config: {
        distortion: 0.5,
        transitionDuration: 600,
        scale: 2.0,
      },
    },
    {
      id: "subtle",
      label: "Subtle",
      config: {
        distortion: 0.3,
        transitionDuration: 1200,
        scale: 1.5,
      },
    },
    {
      id: "dreamy",
      label: "Dreamy",
      config: {
        distortion: 1.2,
        transitionDuration: 3000,
        scale: 4.0,
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
