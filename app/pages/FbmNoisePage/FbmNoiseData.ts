export const loaderProps = [
  {
    title: "Core Props",
    props: [
      {
        name: "complex",
        type: "boolean",
        defaultValue: "false",
        description: "Enables layered multi-octave FBM noise calculations for detailed fluid details.",
      },
      {
        name: "scale",
        type: "number",
        defaultValue: "3.0",
        description: "Pattern scale zoom multiplier for the noise landscapes.",
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "0.1",
        description: "Rate of time flow progression in vector movements.",
      },
      {
        name: "mouseInfluence",
        type: "number",
        defaultValue: "0.5",
        description: "Pointer warp impact strength scaling dynamic coordinate offsets.",
      },
      {
        name: "brightness",
        type: "number",
        defaultValue: "1.0",
        description: "Global brightness intensity multiplier.",
      },
      {
        name: "seed",
        type: "number",
        defaultValue: "43758.5453123",
        description: "Seed coordinate offset for the random generator algorithms.",
      },
      {
        name: "paused",
        type: "boolean",
        defaultValue: "false",
        description: "Halts vector flow movement simulation.",
      },
    ],
  },
  {
    title: "Styling Props",
    props: [
      {
        name: "colorR",
        type: "number",
        defaultValue: "1.0",
        description: "Red color channel bias factor.",
      },
      {
        name: "colorG",
        type: "number",
        defaultValue: "1.0",
        description: "Green color channel bias factor.",
      },
      {
        name: "colorB",
        type: "number",
        defaultValue: "1.0",
        description: "Blue color channel bias factor.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "''",
        description: "Additional CSS styles and layout classes.",
      },
    ],
  },
];

export const componentCode = "";

export const creditsData = [
  {
    title: "Shader Conception",
    items: [
      {
        name: "Inigo Quilez",
        role: "Noise Algorithms Creator",
        url: "https://iquilezles.org/",
      },
      {
        name: "Three.js Contributors",
        role: "WebGL Abstraction Framework",
        url: "https://threejs.org/",
      },
    ],
  },
];
