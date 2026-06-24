import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const slidingMenuConfig: ComponentConfig = {
  slug: "sliding-menu",
  name: "Sliding Menu",
  category: "miscellaneous",
  tags: ["menu", "slide", "navigation", "drawer", "animated"],
  componentPath: "app/meta/menu/SlidingMenu/SlidingMenu.tsx",
  containerClassName:
    "w-full h-[550px] relative bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-center items-center",
  props: [
    {
      name: "logoText",
      type: "string",
      default: "BRAND",
      description: "Branding text displayed in the header menu bar.",
    },
    {
      name: "textColor",
      type: "color",
      default: "#ffffff",
      description:
        "Default text color for labels, headings, and branding elements.",
    },
    {
      name: "accentColor",
      type: "color",
      default: "#0055ff",
      description: "Accent color for eyebrows, link hover text shadows, etc.",
    },
    {
      name: "primaryColor",
      type: "color",
      default: "#0055ff",
      description: "Background color of the first sliding layer panel.",
    },
    {
      name: "secondaryColor",
      type: "color",
      default: "#f2eee9",
      description: "Background color of the second sliding layer panel.",
    },
    {
      name: "neutralColor",
      type: "color",
      default: "#111111",
      description: "Background color of the primary menu links drawer panel.",
    },
    {
      name: "hoverBgColor",
      type: "color",
      default: "#222222",
      description: "Background color filling the link item on mouse hover.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Blue",
      config: {
        logoText: "BRAND",
        primaryColor: "#0055ff",
        secondaryColor: "#f2eee9",
        neutralColor: "#111111",
        accentColor: "#0055ff",
        hoverBgColor: "#222222",
        textColor: "#ffffff",
      },
    },
    {
      id: "cyber",
      label: "Cyber Green",
      config: {
        logoText: "MATRIX",
        primaryColor: "#00ff66",
        secondaryColor: "#0a0a0c",
        neutralColor: "#020202",
        accentColor: "#00ff66",
        hoverBgColor: "#113311",
        textColor: "#00ff66",
      },
    },
    {
      id: "sunset",
      label: "Sunset Rose",
      config: {
        logoText: "HORIZON",
        primaryColor: "#ff5e62",
        secondaryColor: "#ff9966",
        neutralColor: "#1e131d",
        accentColor: "#ff5e62",
        hoverBgColor: "#412a3d",
        textColor: "#f5e8f4",
      },
    },
  ],
  staticProps: {
    isFixed: false,
  },
  credits: [
    {
      title: "Component Source",
      items: [
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
          name: "GSAP",
          role: "Animation Engine",
          url: "https://gsap.com/",
        },
        {
          name: "React",
          role: "UI Framework",
          url: "https://react.dev",
        },
      ],
    },
  ],
};
