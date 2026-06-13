export const loaderProps = [
  {
    title: "Grid Layout Props",
    props: [
      {
        name: "cols",
        type: "number",
        defaultValue: "9",
        description: "Number of columns in the dot grid mesh.",
      },
      {
        name: "rows",
        type: "number",
        defaultValue: "9",
        description: "Number of rows in the dot grid mesh.",
      },
      {
        name: "spacing",
        type: "number",
        defaultValue: "56",
        description: "Distance in pixels between adjacent dot grid nodes.",
      },
      {
        name: "baseRadius",
        type: "number",
        defaultValue: "12",
        description: "Resting size (radius in pixels) of the individual grid dots.",
      },
    ],
  },
  {
    title: "Elasticity & Force Props",
    props: [
      {
        name: "springK",
        type: "number",
        defaultValue: "0.09",
        description: "Spring stiffness / restoring tension constant.",
      },
      {
        name: "damp",
        type: "number",
        defaultValue: "0.78",
        description: "Friction / damping factor applied to node velocities.",
      },
      {
        name: "gravityRadius",
        type: "number",
        defaultValue: "210",
        description: "Influence radius of cursor interaction, in pixels.",
      },
      {
        name: "gravityMax",
        type: "number",
        defaultValue: "20",
        description: "Max displacement force toward (positive) or away from (negative) cursor.",
      },
    ],
  },
  {
    title: "Ripple Wave Mechanics Props",
    props: [
      {
        name: "rowDelay",
        type: "number",
        defaultValue: "0.055",
        description: "Delay in seconds for wave propagation between consecutive rows.",
      },
      {
        name: "bounceAmp",
        type: "number",
        defaultValue: "12",
        description: "Base amplitude (strength) of wave displacement ripples.",
      },
      {
        name: "decay",
        type: "number",
        defaultValue: "4.2",
        description: "Exponential decay rate of the wave envelope over time.",
      },
      {
        name: "freq",
        type: "number",
        defaultValue: "13.0",
        description: "Oscillation frequency of ripples, in radians per second.",
      },
      {
        name: "colSpread",
        type: "number",
        defaultValue: "0.65",
        description: "Lateral Gaussian dispersion factor across columns.",
      },
    ],
  },
  {
    title: "Aesthetics & Visual Props",
    props: [
      {
        name: "blur",
        type: "number",
        defaultValue: "8",
        description: "CSS blur filter radius in pixels, driving the gooey liquid merge effect.",
      },
      {
        name: "contrast",
        type: "number",
        defaultValue: "28",
        description: "CSS contrast filter threshold applied to sharpen blurred edges.",
      },
      {
        name: "dotColor",
        type: "string",
        defaultValue: "'#ffffff'",
        description: "Fill color hex code of the gooey grid dots.",
      },
      {
        name: "bgColor",
        type: "string",
        defaultValue: "'#000000'",
        description: "Substrate background color hex code.",
      },
      {
        name: "autoDrops",
        type: "boolean",
        defaultValue: "true",
        description: "Whether periodic spontaneous raindrop ripples are enabled.",
      },
    ],
  },
];

export const componentCode = "";

export const creditsData = [
  {
    title: "Component Source",
    items: [
      {
        name: "Jean-Philippe Belley",
        role: "Original Creator",
        url: "https://jeanphilippebelley.com/",
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
