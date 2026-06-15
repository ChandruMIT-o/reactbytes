export const loaderProps = [
  {
    title: "Core Props",
    props: [
      {
        name: "cells",
        type: "number",
        defaultValue: "4.0",
        description: "Number of horizontal columns or cells in the visual grid.",
      },
      {
        name: "stripes",
        type: "number",
        defaultValue: "40.0",
        description: "Density frequency of simplex noise stripes.",
      },
      {
        name: "speed",
        type: "number",
        defaultValue: "0.5",
        description: "Speed multiplier for the organic flowing animation.",
      },
      {
        name: "chromatic",
        type: "number",
        defaultValue: "0.1",
        description: "RGB shift intensity creating the chromatic aberration offset.",
      },
      {
        name: "isPlaying",
        type: "boolean",
        defaultValue: "true",
        description: "Toggle to pause or play the dynamic WebGL rendering loop.",
      },
      {
        name: "dpr",
        type: "number",
        defaultValue: "1.5",
        description: "Resolution multiplier (Device Pixel Ratio scale factor).",
      },
    ],
  },
  {
    title: "Styling Props",
    props: [
      {
        name: "colorBg",
        type: "string",
        defaultValue: "'#121212'",
        description: "Hex color code for the deep base shader layer.",
      },
      {
        name: "colorFg",
        type: "string",
        defaultValue: "'#000000'",
        description: "Hex color code for the foreground simplex noise ripples.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "''",
        description: "Additional CSS classes for custom container sizing and styling.",
      },
    ],
  },
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

// ==========================================
// GLSL Shaders (Modified for dynamic Uniforms)
// ==========================================

const VERTEX_SHADER_SOURCE = \`#version 300 es
in vec3 position;
in vec2 uv;
out vec2 v_uv;

void main() {
  gl_Position = vec4(position, 1.0);
  v_uv = uv;
}
\`;

const FRAGMENT_SHADER_SOURCE = \`#version 300 es
precision highp float;
  
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frame;

// Custom adjustment uniforms
uniform float u_cells;
uniform float u_stripes;
uniform float u_speed;
uniform float u_chromatic;
uniform vec3 u_color_bg;
uniform vec3 u_color_fg;
  
in vec2 v_uv;
out vec4 colour;
  
// Simplex 3D Noise 
// by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1. + 3.0 * C.xxx;

  // Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients (N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  // mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

vec2 getScreenSpace() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
  return uv;
}

void main() {
  vec2 uv = getScreenSpace();
  
  // Custom horizontal speed scaling
  uv.x += -900.0 + u_time * u_speed; 
  
  // Setup dynamic grid and noise scale using controlled uniforms
  float cells = u_cells;
  float stripes = u_stripes;
  float x_scaled = uv.x * cells;
  
  // Get the Integer ID (0, 1, 2...) and the Fractional part (0.0 to 1.0)
  float id = floor(x_scaled);
  float local_x = fract(x_scaled);
  
  // Create a blend mask based on local_x
  float blend = smoothstep(0.85, 1.0, local_x);
  
  // Calculate a "Continuous ID"
  float smooth_id = (id + blend) * 0.15;
  
  // Simplex noise
  float noise_z = u_time * u_speed + smooth_id;
  float n = snoise(vec3(uv * 2.0, noise_z)) * 0.5 + snoise(vec3(uv * 0.5 + 1.0, noise_z));
  
  float ng = n * stripes; 
  float aa = fwidth(sin(ng)); 
  
  // Apply chromatic aberration with controlled offsets
  float r = smoothstep(0.0, aa, sin(ng));
  float g = smoothstep(0.0, aa, sin(ng + u_chromatic));
  float b = smoothstep(0.0, aa, sin(ng + u_chromatic * 2.0));
  
  // Mix dynamic foreground & background theme colors
  vec3 baseMask = vec3(r, g, b);
  vec3 finalColor = mix(u_color_bg, u_color_fg, baseMask);
  
  colour = vec4(finalColor, 1.0);
}
\`;

// Helper: Convert HEX to RGB Array [0.0 - 1.0]
const hexToRgb = (hex: string): [number, number, number] => {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255 || 0;
  return [r, g, b];
};

export interface VelvetNoiseProps {
  cells?: number;
  stripes?: number;
  speed?: number;
  chromatic?: number;
  colorBg?: string;
  colorFg?: string;
  isPlaying?: boolean;
  dpr?: number;
  className?: string;
  children?: React.ReactNode;
}

export const VelvetNoise: React.FC<VelvetNoiseProps> = ({
  cells = 4.0,
  stripes = 40.0,
  speed = 0.5,
  chromatic = 0.1,
  colorBg = "#121212",
  colorFg = "#000000",
  isPlaying = true,
  dpr = 1.5,
  className = "",
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use refs for the animation loop to access latest state without rebuilding
  const paramsRef = useRef({
    cells,
    stripes,
    speed,
    chromatic,
    colorBg,
    colorFg,
    isPlaying,
    dpr,
  });

  useEffect(() => {
    paramsRef.current = {
      cells,
      stripes,
      speed,
      chromatic,
      colorBg,
      colorFg,
      isPlaying,
      dpr,
    };
  }, [cells, stripes, speed, chromatic, colorBg, colorFg, isPlaying, dpr]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) {
      console.error("WebGL2 context not supported on this browser/device.");
      return;
    }

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error: ", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fs = compileShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
    if (!vs || !fs) {
      console.error("Failed to compile vertex or fragment shaders.");
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(\`Program linking error: \${gl.getProgramInfoLog(program)}\`);
      return;
    }

    gl.useProgram(program);

    const vertices = new Float32Array([
      -1.0, -1.0, 0.0, 0.0, 0.0,
       3.0, -1.0, 0.0, 2.0, 0.0,
      -1.0,  3.0, 0.0, 0.0, 2.0
    ]);

    const vertexArray = gl.createVertexArray();
    const buffer = gl.createBuffer();
    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 5 * 4, 0);

    const uvLoc = gl.getAttribLocation(program, "uv");
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 5 * 4, 3 * 4);

    const uLocs = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      time: gl.getUniformLocation(program, "u_time"),
      frame: gl.getUniformLocation(program, "u_frame"),
      cells: gl.getUniformLocation(program, "u_cells"),
      stripes: gl.getUniformLocation(program, "u_stripes"),
      speed: gl.getUniformLocation(program, "u_speed"),
      chromatic: gl.getUniformLocation(program, "u_chromatic"),
      colorBg: gl.getUniformLocation(program, "u_color_bg"),
      colorFg: gl.getUniformLocation(program, "u_color_fg"),
    };

    let timeValue = 0;
    let frameValue = 0;
    let lastTimestamp = performance.now();
    let animationFrameId: number;

    const resizeCanvas = () => {
      const currentDpr = paramsRef.current.dpr;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      
      const targetWidth = Math.floor(displayWidth * currentDpr);
      const targetHeight = Math.floor(displayHeight * currentDpr);

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        gl.viewport(0, 0, targetWidth, targetHeight);
      }
    };

    const render = (now: number) => {
      const delta = now - lastTimestamp;
      lastTimestamp = now;

      resizeCanvas();

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (paramsRef.current.isPlaying) {
        timeValue += delta * 0.001;
        frameValue += 1.0;
      }

      gl.uniform2f(uLocs.resolution, canvas.width, canvas.height);
      gl.uniform1f(uLocs.time, timeValue);
      gl.uniform1f(uLocs.frame, frameValue);

      gl.uniform1f(uLocs.cells, paramsRef.current.cells);
      gl.uniform1f(uLocs.stripes, paramsRef.current.stripes);
      gl.uniform1f(uLocs.speed, paramsRef.current.speed);
      gl.uniform1f(uLocs.chromatic, paramsRef.current.chromatic);

      const rgbBg = hexToRgb(paramsRef.current.colorBg);
      const rgbFg = hexToRgb(paramsRef.current.colorFg);
      gl.uniform3f(uLocs.colorBg, rgbBg[0], rgbBg[1], rgbBg[2]);
      gl.uniform3f(uLocs.colorFg, rgbFg[0], rgbFg[1], rgbFg[2]);

      gl.bindVertexArray(vertexArray);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteVertexArray(vertexArray);
    };
  }, []);

  const hasHeight = className.includes("h-") || className.includes("height-");

  return (
    <div className={\`relative overflow-hidden w-full \${hasHeight ? "" : "h-full"} \${className}\`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
        title="Interactive WebGL Simplex Noise Background"
      />
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default VelvetNoise;`;

export const creditsData = [
  {
    title: "Component Source",
    items: [
      {
        name: "Ian McEwan, Stefan Gustavson",
        role: "Simplex 3D Noise GLSL algorithm",
        url: "https://github.com/stegu/webgl-noise",
      },
      {
        name: "React Bytes",
        role: "Collection",
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
      {
        name: "WebGL2",
        role: "Renderer API",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
      },
    ],
  },
];
