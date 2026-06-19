import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const listCarouselConfig: ComponentConfig = {
  slug: "list-carousel",
  name: "List Carousel",
  category: "carousel",
  componentPath: "app/meta/carousel/ListCarousel/ListCarousel.tsx",
  containerClassName: "h-[600px] w-full rounded-xl border border-rb-neutral-4 shadow-2xl !p-0",
  props: [
    {
      name: "defaultBg",
      type: "string",
      default: "https://assets.codepen.io/7558/bw-blurry-005.webp",
      description: "The background image displayed when no item is hovered.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Atmospheric Mono",
      config: {
        defaultBg: "https://assets.codepen.io/7558/bw-blurry-005.webp",
      },
    },
    {
      id: "vibrant",
      label: "Vibrant Abstract",
      config: {
        defaultBg: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
      },
    },
    {
      id: "dark",
      label: "Deep Midnight",
      config: {
        defaultBg: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop",
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "JP Belley",
          role: "Visual Designer",
          url: "https://jeanphilippebelley.com/",
        },
        {
          name: "React Bytes",
          role: "Collection",
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
          name: "Tailwind CSS",
          role: "Styling",
          url: "https://tailwindcss.com",
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
