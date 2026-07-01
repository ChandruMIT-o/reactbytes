import { ComponentConfig } from "@/app/registry/ComponentDatabase";

export const singularityConfig: ComponentConfig = {
  slug: "singularity",
  name: "Schwarzschild",
  category: "background",
  tags: [
    "gravitational",
    "lensing",
    "halo",
    "disk",
    "streaks",
    "procedural",
    "noise",
    "blackhole"
  ],
  showDemoByDefault: true,
  demoVariant: "text",
  componentPath: "app/meta/background/space/Singularity.tsx",
  npmPackageName: "@reactbytes/singularity",
  version: "1.0.1",
  description: "A premium responsive 3D black hole Schwarzschild singularity background component utilizing Three.js and custom GLSL noise shaders.",
  dependencies: {
    three: "^0.184.0",
  },
  peerDependencies: {
    react: "^18.0.0",
  },
  props: [
    {
      name: "compress",
      type: "number",
      default: 2.5,
      min: 0.2,
      max: 2.5,
      step: 0.05,
      description:
        "Accretion disk coordinate compression multiplier, pulling/pushing disk particles relative to event horizon.",
    },
    {
      name: "morph",
      type: "number",
      default: 0.0,
      min: 0.0,
      max: 10.0,
      step: 0.1,
      description:
        "Accretion disk turbulence/wave morph intensity based on procedural 3D noise.",
    },
    {
      name: "intensity",
      type: "number",
      default: 5,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      description:
        "Radiation glow luminosity/brightness of the gravitational lensing halo and disk streaks.",
    },
    {
      name: "orbitScale",
      type: "number",
      default: 0.1,
      min: 0.1,
      max: 6.0,
      step: 0.1,
      description:
        "Rotational orbit speed scaling factor for accretion disk streamers.",
    },
    {
      name: "rotateSpeed",
      type: "number",
      default: 1.8,
      min: 0.0,
      max: 5.0,
      step: 0.1,
      description:
        "Auto-rotation speed of the viewport coordinate system around the singularity core.",
    },
    {
      name: "camDist",
      type: "number",
      default: 68,
      min: 25,
      max: 180,
      step: 1,
      description:
        "Radial orbit distance of the viewport camera from the center Schwarzschild singularity.",
    },
    {
      name: "camPhi",
      type: "number",
      default: 0.15,
      min: 0.15,
      max: 1.52,
      step: 0.05,
      description:
        "Vertical latitude inclination angle (in radians) of the orbital camera.",
    },
    {
      name: "colorBase",
      type: "color",
      default: "#ff0040",
      description:
        "Base color used to tint the gravitational lens and emission jets.",
    },
  ],
  presets: [
    {
      id: "default",
      label: "Relativistic Collapse",
      config: {
        morph: 0.0,
        compress: 2.5,
        intensity: 5,
        orbitScale: 0.1,
        rotateSpeed: 1.8,
        colorBase: "#ff0040",
        camDist: 68,
        camPhi: 0.15,
      },
    },
    {
      id: "stable",
      label: "Stable Singularity",
      config: {
        morph: 0.1,
        compress: 1.0,
        intensity: 1.0,
        orbitScale: 1.0,
        rotateSpeed: 0.4,
        colorBase: "#00f2ff",
        camDist: 80,
        camPhi: 1.2,
      },
    },
    {
      id: "turbulence",
      label: "Accretion Turbulence",
      config: {
        morph: 4.5,
        compress: 1.15,
        intensity: 1.4,
        orbitScale: 1.8,
        rotateSpeed: 1.5,
        colorBase: "#ff9900",
        camDist: 95,
        camPhi: 1.35,
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
      title: "3D Graphics & Physics",
      items: [
        {
          name: "Three.js",
          role: "3D Render Pipeline",
          url: "https://threejs.org",
        },
        {
          name: "Schwarzschild Metric",
          role: "Physics Inspiration",
          url: "https://en.wikipedia.org/wiki/Schwarzschild_metric",
        },
      ],
    },
  ],
};
