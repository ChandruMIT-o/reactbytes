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
  props: [
    {
      name: "compress",
      type: "number",
      default: 1.0,
      min: 0.2,
      max: 2.5,
      step: 0.05,
      description:
        "Accretion disk coordinate compression multiplier, pulling/pushing disk particles relative to event horizon.",
    },
    {
      name: "morph",
      type: "number",
      default: 0.1,
      min: 0.0,
      max: 10.0,
      step: 0.1,
      description:
        "Accretion disk turbulence/wave morph intensity based on procedural 3D noise.",
    },
    {
      name: "intensity",
      type: "number",
      default: 1.0,
      min: 0.1,
      max: 5.0,
      step: 0.1,
      description:
        "Radiation glow luminosity/brightness of the gravitational lensing halo and disk streaks.",
    },
    {
      name: "orbitScale",
      type: "number",
      default: 1.0,
      min: 0.1,
      max: 6.0,
      step: 0.1,
      description:
        "Rotational orbit speed scaling factor for accretion disk streamers.",
    },
    {
      name: "rotateSpeed",
      type: "number",
      default: 0.4,
      min: 0.0,
      max: 5.0,
      step: 0.1,
      description:
        "Auto-rotation speed of the viewport coordinate system around the singularity core.",
    },
    {
      name: "camDist",
      type: "number",
      default: 80,
      min: 25,
      max: 180,
      step: 1,
      description:
        "Radial orbit distance of the viewport camera from the center Schwarzschild singularity.",
    },
    {
      name: "camPhi",
      type: "number",
      default: 1.2,
      min: 0.15,
      max: 1.52,
      step: 0.05,
      description:
        "Vertical latitude inclination angle (in radians) of the orbital camera.",
    },
    {
      name: "colorBase",
      type: "color",
      default: "#00f2ff",
      description:
        "Base color used to tint the gravitational lens and emission jets.",
    },
  ],
  presets: [
    {
      id: "default",
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
    {
      id: "collapse",
      label: "Relativistic Collapse",
      config: {
        morph: 0.8,
        compress: 0.38,
        intensity: 3.5,
        orbitScale: 4.5,
        rotateSpeed: 4.0,
        colorBase: "#ff0040",
        camDist: 55,
        camPhi: 1.5,
      },
    },
  ],
  credits: [
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
    {
      title: "Development Team",
      items: [
        {
          name: "React Bytes",
          role: "Attribution and Licensing",
          url: "https://reactbytes.dev",
        },
      ],
    },
  ],
};
