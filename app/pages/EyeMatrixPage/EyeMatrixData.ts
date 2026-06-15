export const loaderProps = [
  {
    title: "Layout Props",
    props: [
      {
        name: "eyeCount",
        type: "number",
        defaultValue: "180",
        description: "Number of packed eye nodes in the viewport grid.",
      },
      {
        name: "padding",
        type: "number",
        defaultValue: "4",
        description: "Horizontal/vertical spacing offset separating neighboring nodes.",
      },
      {
        name: "minRadius",
        type: "number",
        defaultValue: "12",
        description: "Minimum radius limit of randomly generated eye circles.",
      },
      {
        name: "maxRadius",
        type: "number",
        defaultValue: "65",
        description: "Maximum radius limit of randomly generated eye circles.",
      },
      {
        name: "paletteKey",
        type: "'monochromeDark' | 'monochromeLight' | 'monochromeMixed'",
        defaultValue: "'monochromeDark'",
        description: "Flat monochrome color profile configuration.",
      },
      {
        name: "customBg",
        type: "string",
        defaultValue: "''",
        description: "Hex override for the background layer.",
      },
    ],
  },
  {
    title: "Iris Props",
    props: [
      {
        name: "scleraScale",
        type: "number",
        defaultValue: "0.65",
        description: "Scale of the white eyeball globe relative to node size.",
      },
      {
        name: "pupilScale",
        type: "number",
        defaultValue: "0.45",
        description: "Scale of the pupil iris relative to eyeball size.",
      },
      {
        name: "pupilStyle",
        type: "'normal' | 'cat' | 'sparkle' | 'ring'",
        defaultValue: "'normal'",
        description: "Visual shape geometry style of the pupil.",
      },
    ],
  },
  {
    title: "Physics & Animation Props",
    props: [
      {
        name: "physicsStiffness",
        type: "number",
        defaultValue: "0.12",
        description: "Stiffness tension factor of the spring wiggling.",
      },
      {
        name: "physicsDamping",
        type: "number",
        defaultValue: "0.78",
        description: "Friction resistance damping of pupil inertia wiggles.",
      },
      {
        name: "blinkingEnabled",
        type: "boolean",
        defaultValue: "true",
        description: "Toggles organic blinking behavior.",
      },
      {
        name: "blinkRate",
        type: "number",
        defaultValue: "0.015",
        description: "Probability threshold of triggering close eyelids on each frame loop.",
      },
      {
        name: "interactiveMode",
        type: "'mouse' | 'wander' | 'vortex'",
        defaultValue: "'mouse'",
        description: "Target tracking mode of the eyeballs.",
      },
      {
        name: "flatBorderEnabled",
        type: "boolean",
        defaultValue: "true",
        description: "Renders solid outlines around eye body structures.",
      },
    ],
  },
];

export const componentCode = "";

export const creditsData = [
  {
    title: "Layout Engine",
    items: [
      {
        name: "D3.js (d3-hierarchy)",
        role: "Siblings packer solver",
        url: "https://d3js.org/d3-hierarchy/pack",
      },
      {
        name: "Inigo Quilez",
        role: "Spring-elastic wiggles inspiration",
        url: "https://iquilezles.org/",
      },
    ],
  },
];
