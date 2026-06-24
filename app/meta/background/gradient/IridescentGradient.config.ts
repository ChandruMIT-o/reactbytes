import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const iridescentGradientConfig: ComponentConfig = {
  slug: "iridescent-gradient",
  name: "Iridescent Gradient",
  category: "background",
  tags: ["iridescent", "gradient", "rainbow", "holographic", "color"],
  componentPath: "app/meta/background/gradient/IridescentGradient.tsx",
  props: [
    {
      name: "title",
      type: "string",
      default: "An awesome title",
      description: "The title text to display in the center.",
    },
    {
      name: "switchText",
      type: "string",
      default: "switch bg",
      description: "The text for the switch label.",
    },
    {
      name: "stripeColor",
      type: "color",
      default: "#ffffff",
      description: "The color of the stripes (hex or CSS color).",
    },
    {
      name: "bgColor",
      type: "color",
      default: "",
      description:
        "The background color. Defaults to stripeColor if not provided.",
    },
    {
      name: "checked",
      type: "boolean",
      default: true,
      description: "Whether the dark mode is active.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Style",
      config: {
        title: "An awesome title",
        switchText: "switch bg",
        stripeColor: "#ffffff",
        bgColor: "",
        checked: true,
      },
    },
  ],
  credits: [
    {
      title: "Component Inspiration",
      items: [
        {
          name: "Paco Coursey",
          role: "Original Concept",
          url: "https://paco.me/",
        },
        {
          name: "ReactBytes",
          role: "Implementation",
          url: "https://reactbytes.com",
        },
      ],
    },
  ],
};
