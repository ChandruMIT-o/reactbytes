import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const ditherCarouselConfig: ComponentConfig = {
  slug: "dither-carousel",
  name: "Dither Carousel",
  category: "carousel",
  componentPath: "app/meta/carousel/DitherCarousel/DitherCarousel.tsx",
  containerClassName: "w-full relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 min-h-[480px] bg-black !p-0",
  props: [
    {
      name: "autoPlay",
      type: "boolean",
      default: false,
      description: "Whether the slides should automatically rotate.",
    },
    {
      name: "autoPlayInterval",
      type: "number",
      default: 5500,
      min: 1500,
      max: 10000,
      step: 500,
      description: "Time delay (in milliseconds) between slide rotations in autoplay mode.",
    },
    {
      name: "ditherResolution",
      type: "select",
      default: "medium",
      options: [
        { id: "retro", label: "Retro (Broad Pixels)" },
        { id: "medium", label: "Medium Pixel Grain" },
        { id: "high", label: "Fine Pixel Detail" },
      ],
      description: "Resolution of the dither canvas buffer.",
    },
    {
      name: "colorMode",
      type: "select",
      default: "champagne",
      options: [
        { id: "color", label: "16-Bit Quantized Color" },
        { id: "mono", label: "1-Bit High Contrast Mono" },
        { id: "cyberpunk", label: "Cyberpunk Emerald" },
        { id: "gameboy", label: "Classic Gameboy" },
        { id: "amber", label: "Amber CRT Terminal" },
        { id: "champagne", label: "Noir & Champagne Gold" },
        { id: "nordic", label: "Nordic Mist" },
        { id: "rose", label: "Rose Quartz" },
        { id: "emerald", label: "Midnight Emerald" },
      ],
      description: "The visual style and palette applied to the dither shader.",
    },
    {
      name: "transitionDuration",
      type: "number",
      default: 800,
      min: 500,
      max: 6000,
      step: 250,
      description: "Duration of the radial sweep dither transition (in milliseconds).",
    },
  ],
  presets: [
    {
      id: "champagne",
      label: "Noir & Champagne Gold",
      config: {
        autoPlay: true,
        autoPlayInterval: 5000,
        ditherResolution: "medium",
        colorMode: "champagne",
        transitionDuration: 3500,
      },
    },
    {
      id: "nordic",
      label: "Nordic Ice Mist",
      config: {
        autoPlay: true,
        autoPlayInterval: 5500,
        ditherResolution: "medium",
        colorMode: "nordic",
        transitionDuration: 4000,
      },
    },
    {
      id: "cyberpunk",
      label: "Cyberpunk Hacker Console",
      config: {
        autoPlay: true,
        autoPlayInterval: 4000,
        ditherResolution: "retro",
        colorMode: "cyberpunk",
        transitionDuration: 2500,
      },
    },
    {
      id: "gameboy",
      label: "Classic retro Gameboy",
      config: {
        autoPlay: true,
        autoPlayInterval: 4500,
        ditherResolution: "retro",
        colorMode: "gameboy",
        transitionDuration: 3000,
      },
    },
    {
      id: "color-hd",
      label: "16-Bit Retro Color",
      config: {
        autoPlay: true,
        autoPlayInterval: 6000,
        ditherResolution: "high",
        colorMode: "color",
        transitionDuration: 5000,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "Antigravity",
          role: "Design & Retro Rendering Logic",
          url: "https://reactbytes.dev",
        },
        {
          name: "React Bytes",
          role: "Component Ecosystem",
          url: "https://reactbytes.dev",
        },
      ],
    },
    {
      title: "Retro Graphics & Algorithms",
      items: [
        {
          name: "Ordered Dithering (Bayer Matrix)",
          role: "Pixel Quantization & Half-tone Math",
          url: "https://en.wikipedia.org/wiki/Ordered_dithering",
        },
        {
          name: "WebGL 2 and Canvas double-buffering",
          role: "Sweep wave particle engines",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
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
