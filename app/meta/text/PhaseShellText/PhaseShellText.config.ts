import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const phaseShellTextConfig: ComponentConfig = {
  slug: "phase-shell-text",
  name: "Phase Shell Text",
  category: "text",
  componentPath: "app/meta/text/PhaseShellText/PhaseShellText.tsx",
  props: [
    {
      name: "text",
      type: "string",
      default: "PHASE",
      description: "The word/text to render and animate.",
    },
    {
      name: "fontSize",
      type: "number",
      default: 95,
      min: 40,
      max: 140,
      step: 5,
      description: "Font size in pixels defining absolute container boundaries.",
    },
    {
      name: "impactForce",
      type: "number",
      default: 1.3,
      min: 0.1,
      max: 4.0,
      step: 0.1,
      description: "Multiplier applied to cursor deflection force on characters.",
    },
    {
      name: "influenceRadius",
      type: "number",
      default: 80,
      min: 30,
      max: 200,
      step: 5,
      description: "Distance threshold around pointer position.",
    },
    {
      name: "coreColor",
      type: "color",
      default: "#ffffff",
      description: "Foreground color of the primary solid text hulls.",
    },
    {
      name: "inertialColor",
      type: "color",
      default: "rgba(129, 140, 248, 0.5)",
      description: "Color of the middle inertial displacement shell.",
    },
    {
      name: "tensionColor",
      type: "color",
      default: "rgba(6, 182, 212, 0.4)",
      description: "Color of the outer tension spring shell.",
    },
  ],
  presets: [
    {
      id: "chronographic",
      label: "Chronographic (Default)",
      config: {
        text: "PHASE",
        fontSize: 95,
        coreColor: "#ffffff",
        inertialColor: "rgba(129, 140, 248, 0.5)",
        tensionColor: "rgba(6, 182, 212, 0.4)",
        impactForce: 1.3,
        influenceRadius: 80,
      },
    },
    {
      id: "heavy",
      label: "Heavy Latency",
      config: {
        text: "HEAVY",
        fontSize: 90,
        coreColor: "#f43f5e",
        inertialColor: "rgba(244, 63, 94, 0.6)",
        tensionColor: "rgba(251, 146, 60, 0.45)",
        impactForce: 0.8,
        influenceRadius: 100,
      },
    },
    {
      id: "volatile",
      label: "High Frequency",
      config: {
        text: "VOLATILE",
        fontSize: 80,
        coreColor: "#10b981",
        inertialColor: "rgba(16, 185, 129, 0.4)",
        tensionColor: "#38bdf8",
        impactForce: 2.2,
        influenceRadius: 70,
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
