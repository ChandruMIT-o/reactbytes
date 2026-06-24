import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const endlessMotionFooterConfig: ComponentConfig = {
  slug: "endless-motion-footer",
  name: "Endless Motion Footer",
  category: "miscellaneous",
  tags: ["footer", "marquee", "motion", "infinite", "scroll"],
  componentPath: "app/meta/footer/EndlessMotionFooter/EndlessMotionFooter.tsx",
  containerClassName:
    "w-full h-[400px] relative overflow-hidden flex items-center justify-center rounded-xl border border-white/5 bg-[#0b84ff] shadow-xl",
  props: [
    {
      name: "text",
      type: "string",
      default: "React Bytes",
      description:
        "The repeated text string to display across scrolling lines.",
    },
    {
      name: "mode",
      type: "select",
      default: "internal",
      options: [
        { id: "internal", label: "Self-Contained (Internal)" },
        { id: "page-footer", label: "Infinite Page Footer" },
      ],
      description:
        "The scroll behavior mode. 'internal' sets self-contained scrolling, while 'page-footer' hooks into page scroll.",
    },
    {
      name: "minScale",
      type: "number",
      default: 0.5,
      min: 0.1,
      max: 1.0,
      step: 0.05,
      description:
        "The final scale multiplier for the text as it is scrolled into view (from 1 down to minScale).",
    },
    {
      name: "lineCount",
      type: "number",
      default: 5,
      min: 2,
      max: 8,
      step: 1,
      description:
        "The number of lines displayed in each scroll loop group (increases vertical height).",
    },
    {
      name: "infinite",
      type: "boolean",
      default: true,
      description:
        "Enables Lenis smooth scrolling with an infinite viewport scroll loop.",
    },
    {
      name: "autoScroll",
      type: "boolean",
      default: true,
      description:
        "Enables an automatic marquee-style scrolling drift when the user is not actively scrolling.",
    },
    {
      name: "autoScrollSpeed",
      type: "number",
      default: 1.0,
      min: 0.2,
      max: 4.0,
      step: 0.1,
      description:
        "Speed of the auto-scrolling marquee drift in pixels per frame.",
    },
    {
      name: "textColor",
      type: "color",
      default: "#e8e5d8",
      description: "The CSS text color of the repeated lines.",
    },
    {
      name: "bgColor",
      type: "color",
      default: "#0b84ff",
      description: "The CSS background color of the footer section.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Classic Ocean",
      config: {
        text: "React Bytes",
        bgColor: "#0b84ff",
        textColor: "#e8e5d8",
        minScale: 0.5,
        lineCount: 5,
        infinite: true,
        autoScroll: true,
        autoScrollSpeed: 1,
        mode: "internal",
      },
    },
    {
      id: "cyberpunk",
      label: "Cyberpunk Acid",
      config: {
        text: "NEON SIGNAL",
        bgColor: "#0c0c0e",
        textColor: "#39ff14",
        minScale: 0.3,
        lineCount: 6,
        infinite: true,
        autoScroll: true,
        autoScrollSpeed: 2.5,
        mode: "internal",
      },
    },
    {
      id: "crimson",
      label: "Crimson Phantom",
      config: {
        text: "GLITCH IN VOID",
        bgColor: "#800000",
        textColor: "#ffffff",
        minScale: 0.6,
        lineCount: 4,
        infinite: true,
        autoScroll: true,
        autoScrollSpeed: 1.5,
        mode: "internal",
      },
    },
    {
      id: "monochrome",
      label: "Monochrome Sleek",
      config: {
        text: "MINIMALISM",
        bgColor: "#ffffff",
        textColor: "#111111",
        minScale: 0.4,
        lineCount: 5,
        infinite: false,
        autoScroll: false,
        autoScrollSpeed: 0,
        mode: "internal",
      },
    },
  ],
  credits: [],
  staticProps: {
    className: "absolute inset-0 w-full h-full z-0",
  },
};
