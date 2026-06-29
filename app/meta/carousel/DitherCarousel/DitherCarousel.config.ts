import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const ditherCarouselConfig: ComponentConfig = {
  slug: "dither-carousel",
  name: "Dither Carousel",
  category: "carousel",
  tags: ["carousel", "dither", "pixel", "retro", "transition"],
  componentPath: "app/meta/carousel/DitherCarousel/DitherCarousel.tsx",
  npmPackageName: "@reactbytes/dither-carousel",
  version: "1.0.0",
  dependencies: {
    "lucide-react": "^1.7.0",
  },
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName:
    "w-full relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8 min-h-[480px] bg-black !p-0",
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
      description:
        "Time delay (in milliseconds) between slide rotations in autoplay mode.",
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
      description:
        "Duration of the radial sweep dither transition (in milliseconds).",
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
      title: "Libraries",
      items: [
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
