import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const variableWeightTextConfig: ComponentConfig = {
  slug: "variable-weight",
  name: "Variable Weight",
  category: "text",
  tags: ["weight", "font", "variable", "typography", "animation"],
  componentPath: "app/meta/text/TextEnter/VariableWeightText.tsx",
  props: [
    {
      name: "text",
      type: "string",
      default: "VARIABLE OUTFIT",
      description: "The text to animate.",
    },
    {
      name: "uppercase",
      type: "boolean",
      default: true,
      description: "Whether to force the text to uppercase.",
    },
    {
      name: "pulse",
      type: "boolean",
      default: false,
      description: "Whether the weight shift should loop indefinitely.",
    },
    {
      name: "duration",
      type: "number",
      default: 0.8,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: "Animation time for each character (seconds).",
    },
    {
      name: "stagger",
      type: "number",
      default: 0.1,
      min: 0,
      max: 0.5,
      step: 0.01,
      description: "Delay multiplication between characters (seconds).",
    },
    {
      name: "initialWeight",
      type: "number",
      default: 100,
      min: 100,
      max: 900,
      step: 100,
      description: "Starting font weight (100-900).",
    },
    {
      name: "targetWeight",
      type: "number",
      default: 900,
      min: 100,
      max: 900,
      step: 100,
      description: "Final font weight (100-900).",
    },
    {
      name: "color",
      type: "color",
      default: "#E8EAF0",
      description: "Hex color for the text.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Default Bold",
      config: {
        text: "VARIABLE OUTFIT",
        initialWeight: 100,
        targetWeight: 900,
        duration: 0.8,
        stagger: 0.1,
        pulse: false,
        color: "#E8EAF0",
        uppercase: true,
      },
    },
    {
      id: "pulse",
      label: "Breathing Cycle",
      config: {
        text: "BREATHING",
        initialWeight: 100,
        targetWeight: 800,
        duration: 2.0,
        stagger: 0.2,
        pulse: true,
        color: "#A78BFA",
        uppercase: true,
      },
    },
    {
      id: "rapid",
      label: "Rapid Wave",
      config: {
        text: "VELOCITY",
        initialWeight: 200,
        targetWeight: 700,
        duration: 0.4,
        stagger: 0.05,
        pulse: false,
        color: "#2DD4BF",
        uppercase: true,
      },
    },
  ],
  credits: [
    {
      title: "Novel Concept",
      items: [
        {
          name: "Variable Fonts API",
          role: "Tech Underlying",
          url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_fonts_guide",
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
          name: "Framer Motion",
          role: "Animations",
          url: "https://www.framer.com/motion/",
        },
      ],
    },
  ],
  staticProps: {
    textClassName: "text-7xl tracking-tighter",
  },
};
