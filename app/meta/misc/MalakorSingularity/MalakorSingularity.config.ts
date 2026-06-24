import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const malakorSingularityConfig: ComponentConfig = {
  slug: "malakor-singularity",
  name: "Malakor Singularity",
  category: "miscellaneous",
  tags: ["singularity", "orb", "dark", "energy", "vortex"],
  componentPath: "app/meta/misc/MalakorSingularity/MalakorSingularity.tsx",
  containerClassName:
    "w-full h-[600px] relative overflow-hidden flex items-center justify-center p-2",
  props: [
    {
      name: "coreName",
      type: "string",
      default: "MALAKOR.SINGULARITY",
      description:
        "Upper-left atmospheric label indicating the core's identity.",
    },
    {
      name: "initialWhisper",
      type: "string",
      default: "Hover over the void and type your command...",
      description:
        "Initial message typed out letter-by-letter on core initialization.",
    },
    {
      name: "apiKey",
      type: "string",
      default: "",
      description:
        "Optional Gemini API key to enable sarcastic conversational AI replies.",
    },
    {
      name: "typingColor",
      type: "color",
      default: "#ff1407",
      description:
        "Hex color for typing bursts and the blinking command caret.",
    },
    {
      name: "hoverColor",
      type: "color",
      default: "#0b52ff",
      description:
        "Hex color representing the electric-blue kinetic friction cursor trail.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Malakor (Default)",
      config: {
        coreName: "MALAKOR.SINGULARITY",
        typingColor: "#ff1407",
        hoverColor: "#0b52ff",
        initialWhisper: "Hover over the void and type your command...",
      },
    },
    {
      id: "xenon",
      label: "Xenon Core",
      config: {
        coreName: "XENON.CORE",
        typingColor: "#2dd4bf",
        hoverColor: "#a855f7",
        initialWhisper: "Injecting quantum signals into the Xenon Core...",
      },
    },
    {
      id: "aether",
      label: "Aether Void",
      config: {
        coreName: "AETHER.VOID",
        typingColor: "#e11d48",
        hoverColor: "#10b981",
        initialWhisper: "Whisper into the cosmic aether...",
      },
    },
  ],
  staticProps: {
    showApiKeyButton: false,
    className:
      "relative w-full h-full bg-black overflow-hidden select-none cursor-crosshair text-neutral-200 border border-neutral-800 rounded-xl",
  },
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "React Bytes",
          role: "Creation & Styling",
          url: "https://reactbytes.dev",
        },
      ],
    },
    {
      title: "Underlying Tech",
      items: [
        {
          name: "WebGL",
          role: "Graphics Pipeline",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
        },
        {
          name: "Gemini API",
          role: "Cognitive Intelligence",
          url: "https://ai.google.dev/",
        },
      ],
    },
  ],
};
