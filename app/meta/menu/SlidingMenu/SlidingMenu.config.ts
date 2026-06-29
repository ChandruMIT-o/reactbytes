import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const slidingMenuConfig: ComponentConfig = {
  slug: "sliding-menu",
  name: "Sliding Menu",
  category: "miscellaneous",
  tags: ["menu", "slide", "navigation", "drawer", "animated"],
  componentPath: "app/meta/menu/SlidingMenu/SlidingMenu.tsx",
  npmPackageName: "@reactbytes/sliding-menu",
  version: "1.0.0",
  dependencies: {
    gsap: "^3.15.0",
  },
  peerDependencies: {
    react: "^19.0.0",
    "react-dom": "^19.0.0",
  },
  containerClassName:
    "w-full h-[550px] relative bg-zinc-950 rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-center items-center",
  props: [
    {
      name: "textColor",
      type: "color",
      default: "#ffffff",
      description: "Default text color for labels, headings, and toggle controls.",
    },
    {
      name: "accentColor",
      type: "color",
      default: "#0055ff",
      description: "Accent color for line numbers, active details, and text shadows.",
    },
    {
      name: "primaryColor",
      type: "color",
      default: "#0055ff",
      description: "Background color of the first staggered decorative sliding panel.",
    },
    {
      name: "secondaryColor",
      type: "color",
      default: "#f2eee9",
      description: "Background color of the second staggered decorative sliding panel.",
    },
    {
      name: "neutralColor",
      type: "color",
      default: "#111111",
      description: "Main background color of the core links drawer canvas layer.",
    },
    {
      name: "hoverBgColor",
      type: "color",
      default: "#222222",
      description: "Background block fill color applied behind a link item on hover.",
    },
    {
      name: "duration",
      type: "number",
      default: 0.7,
      min: 0.2,
      max: 2.0,
      step: 0.1,
      description: "Total runtime speed in seconds for the panel opening and closing transitions.",
    },
    {
      name: "panelWidth",
      type: "string",
      default: "w-full [@container_(min-width:480px)]:w-[28em] [@container_(min-width:1024px)]:w-[35em]",
      description: "Responsive width classes matching parent container context query rules.",
    },
    {
      name: "borderRadius",
      type: "string",
      default: "rounded-none [@container_(min-width:768px)]:rounded-l-2xl",
      description: "Boundary clipping curvature classes applied across inner backing layers.",
    },
    {
      name: "linkFontSize",
      type: "string",
      default: "text-[2.75em] [@container_(min-width:480px)]:text-[3.5em] [@container_(min-width:768px)]:text-[4.5em] [@container_(min-width:1025px)]:text-[5.625em]",
      description: "Scale rules tracking contextual typography layout sizing variations.",
    },
    {
      name: "fontFamily",
      type: "string",
      default: "font-sans",
      description: "Core structural interface custom layout typography class context parameter.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Blue",
      config: {
        primaryColor: "#0055ff",
        secondaryColor: "#f2eee9",
        neutralColor: "#111111",
        accentColor: "#0055ff",
        hoverBgColor: "#222222",
        textColor: "#ffffff",
        duration: 0.7,
        panelWidth: "w-full [@container_(min-width:480px)]:w-[28em] [@container_(min-width:1024px)]:w-[35em]",
        borderRadius: "rounded-none [@container_(min-width:768px)]:rounded-l-2xl",
        linkFontSize: "text-[2.75em] [@container_(min-width:480px)]:text-[3.5em] [@container_(min-width:768px)]:text-[4.5em] [@container_(min-width:1025px)]:text-[5.625em]",
        fontFamily: "font-sans",
      },
    },
    {
      id: "cyber",
      label: "Cyber Green",
      config: {
        primaryColor: "#00ff66",
        secondaryColor: "#0a0a0c",
        neutralColor: "#020202",
        accentColor: "#00ff66",
        hoverBgColor: "#113311",
        textColor: "#00ff66",
        duration: 0.6,
        panelWidth: "w-full [@container_(min-width:480px)]:w-[24em] [@container_(min-width:1024px)]:w-[30em]",
        borderRadius: "rounded-none",
        linkFontSize: "text-[2.5em] [@container_(min-width:480px)]:text-[3em] [@container_(min-width:768px)]:text-[4em]",
        fontFamily: "font-mono",
      },
    },
    {
      id: "sunset",
      label: "Sunset Rose",
      config: {
        primaryColor: "#ff5e62",
        secondaryColor: "#ff9966",
        neutralColor: "#1e131d",
        accentColor: "#ff5e62",
        hoverBgColor: "#412a3d",
        textColor: "#f5e8f4",
        duration: 0.8,
        panelWidth: "w-full [@container_(min-width:480px)]:w-[28em] [@container_(min-width:1024px)]:w-[35em]",
        borderRadius: "rounded-none [@container_(min-width:768px)]:rounded-l-3xl",
        linkFontSize: "text-[2.75em] [@container_(min-width:480px)]:text-[3.5em] [@container_(min-width:768px)]:text-[4.5em] [@container_(min-width:1025px)]:text-[5.625em]",
        fontFamily: "font-sans",
      },
    },
  ],
  staticProps: {
    isFixed: false,
  },
  credits: [
    {
      title: "Libraries",
      items: [
        {
          name: "GSAP",
          role: "Animation Engine",
          url: "https://gsap.com/",
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