import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const superstructureConfig: ComponentConfig = {
  slug: "superstructure",
  name: "Superstructure Mesh",
  tags: ["superstructure", "space", "geometric", "grid", "cosmic"],
  category: "background",
  componentPath: "app/meta/background/space/Superstructure.tsx",
  showDemoByDefault: true,
  demoVariant: "hero",
  description: "A highly optimized, interactive icosahedron wireframe cage background component with 2.5D vertex displacement and morphable gradient fields.",
  npmPackageName: "@reactbytes/superstructure",
  version: "1.0.0",
  dependencies: {
    "three": "^0.150.0"
  },
  peerDependencies: {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  props: [
    {
      name: "startColor",
      type: "color",
      default: "#ff00ff",
      description: "The starting hex color of the mesh gradient interpolation.",
    },
    {
      name: "endColor",
      type: "color",
      default: "#8080ff",
      description: "The ending hex color of the mesh gradient interpolation.",
    },
    {
      name: "bgColor",
      type: "color",
      default: "#010c05",
      description: "Clear background hex color of the WebGL canvas.",
    },
    {
      name: "radius",
      type: "number",
      default: 900,
      min: 100,
      max: 2000,
      step: 50,
      description:
        "The radius of the icosahedron cage geometry enclosing the camera.",
    },
    {
      name: "detail",
      type: "number",
      default: 20,
      min: 2,
      max: 40,
      step: 1,
      description:
        "Subdivision detail factor of the icosahedron lattice. Higher numbers increase line resolution.",
    },
    {
      name: "opacity",
      type: "number",
      default: 0.25,
      min: 0.05,
      max: 1.0,
      step: 0.05,
      description: "Line opacity of the wireframe structure mesh.",
    },
    {
      name: "speed",
      type: "number",
      default: 1.0,
      min: 0.1,
      max: 4.0,
      step: 0.1,
      description:
        "Animation speed multiplier of the vertex displacement oscillation.",
    },
    {
      name: "enableControls",
      type: "boolean",
      default: true,
      description: "Enables camera drag/mouse orbiting interaction.",
    },
    {
      name: "autoRotate",
      type: "boolean",
      default: false,
      description:
        "Slowly rotates the camera around the structure center automatically.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Emerald Lattice (Default)",
      config: {
        startColor: "#ff00ff",
        endColor: "#8080ff",
        bgColor: "#010c05",
        radius: 900,
        detail: 20,
        opacity: 0.25,
        speed: 1.0,
        enableControls: true,
        autoRotate: false,
      },
    },
    {
      id: "cyber",
      label: "Cyber Portal",
      config: {
        startColor: "#00ffff",
        endColor: "#ff0055",
        bgColor: "#050508",
        radius: 900,
        detail: 24,
        opacity: 0.35,
        speed: 1.5,
        enableControls: true,
        autoRotate: true,
      },
    },
    {
      id: "void",
      label: "True Void",
      config: {
        startColor: "#ffffff",
        endColor: "#333333",
        bgColor: "#000000",
        radius: 900,
        detail: 12,
        opacity: 0.15,
        speed: 0.5,
        enableControls: true,
        autoRotate: false,
      },
    },
  ],
  credits: [
    {
      title: "Component Source",
      items: [
        {
          name: "ChandruMIT-o",
          role: "Design & Development",
          url: "https://github.com/ChandruMIT-o/",
        },
      ],
    },
    {
      title: "Libraries",
      items: [
        {
          name: "Three.js",
          role: "WebGL 3D Rendering Framework",
          url: "https://threejs.org/",
        },
      ],
    },
  ],
};
