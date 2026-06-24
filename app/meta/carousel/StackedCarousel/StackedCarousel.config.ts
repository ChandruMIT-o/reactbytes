import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const stackedCarouselConfig: ComponentConfig = {
  slug: "stacked-carousel",
  name: "Stacked Carousel",
  category: "carousel",
  tags: ["carousel", "stacked", "deck", "cards", "3d"],
  componentPath: "app/meta/carousel/StackedCarousel/StackedCarousel.tsx",
  containerClassName: "min-h-[500px] !h-auto !p-0",
  props: [
    {
      name: "autoRotateInterval",
      type: "number",
      default: 5000,
      min: 1000,
      max: 15000,
      step: 500,
      description: "Time in milliseconds between automatic card rotations.",
    },
    {
      name: "showPagination",
      type: "boolean",
      default: true,
      description: "Whether to show the pagination dots at the bottom.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Standard (Default)",
      config: {
        autoRotateInterval: 5000,
        showPagination: true,
      },
    },
    {
      id: "fast",
      label: "Fast Pace",
      config: {
        autoRotateInterval: 2500,
        showPagination: true,
      },
    },
    {
      id: "dramatic",
      label: "Dramatic",
      config: {
        autoRotateInterval: 10000,
        showPagination: true,
      },
    },
    {
      id: "minimal",
      label: "Minimalist",
      config: {
        autoRotateInterval: 5000,
        showPagination: false,
      },
    },
    {
      id: "manual",
      label: "Manual Only",
      config: {
        autoRotateInterval: 999999,
        showPagination: true,
      },
    },
  ],
  credits: [
    {
      title: "Inspiration",
      items: [
        {
          name: "Apple iPad Pro",
          role: "Design Reference",
          url: "https://www.apple.com/ipad-pro/",
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
