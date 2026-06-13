export const loaderProps = [
  {
    title: "Core Simulation Props",
    props: [
      {
        name: "renderMode",
        type: "'dots' | 'circles' | 'constellation' | 'hybrid'",
        defaultValue: "'dots'",
        description: "The aesthetic representation style of the particles or grid structures.",
      },
      {
        name: "colorTheme",
        type: "'monochrome' | 'solarized' | 'nebula' | 'cyberpunk'",
        defaultValue: "'monochrome'",
        description: "Curated harmonious color palette preset applied to render elements.",
      },
      {
        name: "isPlaying",
        type: "boolean",
        defaultValue: "true",
        description: "Whether the animation loop is running or paused.",
      },
    ],
  },
  {
    title: "Sizing & Spacing Props",
    props: [
      {
        name: "minRadius",
        type: "number",
        defaultValue: "6",
        description: "Minimum particle exclusion/spacing radius.",
      },
      {
        name: "maxRadius",
        type: "number",
        defaultValue: "35",
        description: "Maximum particle exclusion/spacing radius.",
      },
      {
        name: "maxParticles",
        type: "number",
        defaultValue: "800",
        description: "Upper limit of active particles on screen.",
      },
    ],
  },
  {
    title: "Noise Field Props",
    props: [
      {
        name: "noiseScale",
        type: "number",
        defaultValue: "0.003",
        description: "Zoom level/frequency of the 2D gradient noise field.",
      },
      {
        name: "noiseStrength",
        type: "number",
        defaultValue: "1.8",
        description: "Force strength of the noise field applied to particle velocities.",
      },
      {
        name: "driftSpeed",
        type: "number",
        defaultValue: "0.015",
        description: "Evolution rate/speed of the vector field over time.",
      },
    ],
  },
  {
    title: "Cursor Influence Props",
    props: [
      {
        name: "mouseInfluence",
        type: "'repel' | 'attract' | 'scaleUp' | 'scaleDown' | 'none'",
        defaultValue: "'repel'",
        description: "How the pointer alters particle positioning or local scaling.",
      },
      {
        name: "mouseRadius",
        type: "number",
        defaultValue: "180",
        description: "Exclusion/attraction zone radius around the cursor.",
      },
      {
        name: "mouseIntensity",
        type: "number",
        defaultValue: "1.0",
        description: "Force strength / intensity multiplier of the cursor interaction.",
      },
    ],
  },
];

export const componentCode = `// Component source code omitted as requested by the user. Please refer directly to app/meta/background/dotted/PoissonNoise.tsx`;

export const creditsData = [
  {
    title: "Component Source",
    items: [
      {
        name: "Poisson Disc Noise Engine",
        role: "Visual Simulation",
        url: "https://reactbytes.dev",
      },
    ],
  },
  {
    title: "Open Source Libraries",
    items: [
      {
        name: "React",
        role: "UI Library",
        url: "https://react.dev",
      },
      {
        name: "Canvas API",
        role: "Rendering Engine",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
      },
    ],
  },
];
