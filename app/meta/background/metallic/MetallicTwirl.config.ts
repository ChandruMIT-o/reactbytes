import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const metallicTwirlConfig: ComponentConfig = {
  slug: "metallic-twirl",
  name: "Metallic Twirl",
  category: "background",
  tags: ["metallic", "twirl", "chrome", "shine", "swirl"],
  componentPath: "app/meta/background/metallic/MetallicTwirl.tsx",
  showDemoByDefault: true,
  demoVariant: "card",
  props: [
    {
      name: "speed",
      type: "number",
      default: 0.2,
      min: 0.01,
      max: 2.0,
      step: 0.01,
      description:
        "Controls the temporal flow of the shader and overall speed of the rotation.",
    },
    {
      name: "zoom",
      type: "number",
      default: 15.0,
      min: 1.0,
      max: 40.0,
      step: 1.0,
      description:
        "Sets the coordinate space scale, effectively zooming in or out of the pattern.",
    },
    {
      name: "symmetry",
      type: "number",
      default: 18.0,
      min: 2.0,
      max: 50.0,
      step: 1.0,
      description:
        "Determines the number of folds or rotational repetitions in the kaleidoscope effect.",
    },
    {
      name: "amplitude",
      type: "number",
      default: 1.9,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      description:
        "The intensity/amplitude multiplier used when mapping the calculated color back to the palette.",
    },
  ],
  presets: [
    {
      id: "classic",
      label: "Classic Metallic",
      config: {
        speed: 0.2,
        zoom: 15.0,
        symmetry: 18.0,
        amplitude: 1.9,
      },
    },
    {
      id: "copper",
      label: "Copper Coils",
      config: {
        speed: 0.1,
        zoom: 20.0,
        symmetry: 24.0,
        amplitude: 3.5,
      },
    },
    {
      id: "hyperspace",
      label: "Hyperspace Rift",
      config: {
        speed: 1.0,
        zoom: 5.0,
        symmetry: 4.0,
        amplitude: 1.0,
      },
    },
    {
      id: "mandala",
      label: "Chrome Mandala",
      config: {
        speed: 0.05,
        zoom: 30.0,
        symmetry: 36.0,
        amplitude: 2.2,
      },
    },
    {
      id: "liquid-prism",
      label: "Liquid Prism",
      config: {
        speed: 0.4,
        zoom: 10.0,
        symmetry: 8.0,
        amplitude: 0.8,
      },
    },
  ],
  credits: [
    {
      title: "Component Origin",
      items: [
        {
          name: "React Bytes",
          role: "Implementation",
          url: "https://reactbytes.dev",
        },
      ],
    },
    {
      title: "Technologies",
      items: [
        {
          name: "WebGL 2",
          role: "Graphics API",
          url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
        },
      ],
    },
  ],
};
