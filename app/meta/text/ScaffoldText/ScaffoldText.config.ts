import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const scaffoldTextConfig: ComponentConfig = {
  slug: "scaffold-text",
  name: "Scaffold Text",
  category: "text",
  componentPath: "app/meta/text/ScaffoldText/ScaffoldText.tsx",
  props: [
    {
      name: "text",
      type: "string",
      default: "SCAFFOLD",
      description: "The word/text to render and assemble.",
    },
    {
      name: "animationState",
      type: "select",
      default: "enter",
      options: [
        { id: "enter", label: "Enter (Assembly)" },
        { id: "stable", label: "Stable (Interactive)" },
        { id: "exit", label: "Exit (Collapse)" },
      ],
      description: "Lifecycle stage of assembly/collapse animation.",
    },
    {
      name: "fontSize",
      type: "number",
      default: 80,
      min: 40,
      max: 140,
      step: 5,
      description: "Scale of typography size in pixels.",
    },
    {
      name: "transitionSpeed",
      type: "number",
      default: 0.04,
      min: 0.005,
      max: 0.15,
      step: 0.005,
      description: "Assembly animation speed coefficient.",
    },
    {
      name: "influenceRadius",
      type: "number",
      default: 65,
      min: 30,
      max: 200,
      step: 5,
      description: "Distance threshold for cursor repulsion interaction.",
    },
    {
      name: "color",
      type: "color",
      default: "#ffffff",
      description: "Foreground color of stable character vectors.",
    },
    {
      name: "scaffoldColor",
      type: "color",
      default: "rgba(14, 165, 233, 0.4)",
      description: "Color of temporary scaffolding framework lines.",
    },
  ],
  presets: [
    {
      id: "cyber",
      label: "Cyber Scaffolding (Default)",
      config: {
        text: "SCAFFOLD",
        animationState: "enter",
        fontSize: 80,
        color: "#ffffff",
        scaffoldColor: "rgba(14, 165, 233, 0.4)",
        transitionSpeed: 0.04,
        influenceRadius: 65,
      },
    },
    {
      id: "fast",
      label: "Fast Assembly",
      config: {
        text: "ASSEMBLE",
        animationState: "enter",
        fontSize: 75,
        color: "#39ff14",
        scaffoldColor: "rgba(57, 255, 20, 0.45)",
        transitionSpeed: 0.09,
        influenceRadius: 50,
      },
    },
    {
      id: "slow",
      label: "Slow Blueprint",
      config: {
        text: "BLUEPRINT",
        animationState: "enter",
        fontSize: 70,
        color: "#fef08a",
        scaffoldColor: "rgba(234, 179, 8, 0.25)",
        transitionSpeed: 0.015,
        influenceRadius: 80,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "React Bytes",
          role: "Author",
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
      ],
    },
  ],
  staticProps: {},
};
