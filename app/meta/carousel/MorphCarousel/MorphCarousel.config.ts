import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const morphCarouselConfig: ComponentConfig = {
  slug: "morph-carousel",
  name: "Morph Carousel",
  category: "carousel",
  componentPath: "app/meta/carousel/MorphCarousel/MorphCarousel.tsx",
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
      title: "Tech Stack",
      items: [
        {
          name: "WebGL 2.0",
          role: "Rendering Engine",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
        },
        {
          name: "Framer Motion",
          role: "Animations",
          url: "https://www.framer.com/motion/",
        },
        {
          name: "Lucide React",
          role: "Icons",
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
