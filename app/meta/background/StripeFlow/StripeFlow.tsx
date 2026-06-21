"use client";

import React, { useEffect, useRef } from 'react';

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
      gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  #define PI 3.14159265359
  #define TWO_PI 6.28318530718

  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;
  uniform float SEED;

  // Modifiers
  uniform float u_distortion;
  uniform float u_scale;
  uniform float u_radius;

  // Custom Palette vectors
  uniform vec3 u_palette_a;
  uniform vec3 u_palette_b;
  uniform vec3 u_palette_c;
  uniform vec3 u_palette_d;

  // Classic Perlin 3D Noise by Stefan Gustavson
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
  
  float cnoise(vec3 P){
      vec3 Pi0 = floor(P);
      vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P);
      vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;

      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);

      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);

      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);

      vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
      vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
      vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
      vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
      vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
      vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
      vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
      vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

      vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
      g000 *= norm0.x;
      g010 *= norm0.y;
      g100 *= norm0.z;
      g110 *= norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
      g001 *= norm1.x;
      g011 *= norm1.y;
      g101 *= norm1.z;
      g111 *= norm1.w;

      float n000 = dot(g000, Pf0);
      float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
      float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
      float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
      float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
      float n111 = dot(g111, Pf1);

      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
  }

  vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ){
      return a + b * cos( TWO_PI * (c * t + d));
  }

  float map(float value, float a, float b, float c, float d) {
      return c + (d - c) * ((value - a) / (b - a));
  }

  float ease(float p, float g) {
      return p < 0.5 ?
          0.5 * pow(2.*p, g) :
          1. - 0.5 * pow(2.*(1. - p), g);
  }

  void main() {
      vec2 pos = gl_FragCoord.xy;
      float dist = distance(pos, u_resolution / 2.0);
      
      // Calculate scalar field intensity based on custom radius factor
      float noiseIntensity = ease(clamp(map(dist, 0., u_radius * min(u_resolution.x, u_resolution.y), 1., 0.), 0., 1.), 5.2);
      
      // Scalar field calculation directly mimicking reference formula
      float scalarFieldOffset = u_distortion * cnoise(SEED + vec3(u_scale * pos, sin(u_time / 10.))) * noiseIntensity;
      
      // Phase cycle mapping matching original easing formulation
      float c = ease(sin(u_time / 2. + TWO_PI * scalarFieldOffset * (abs(sin(u_time / 20.)) + 0.01)) / 2.0 + 0.5, 3.0);

      gl_FragColor = vec4(palette(
          0.4 + c / 2.0,
          u_palette_a,
          u_palette_b,
          u_palette_c,
          u_palette_d
      ), 1.0);
  }
`;

interface PalettePreset {
  name: string;
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
  d: [number, number, number];
}

const PALETTES: Record<string, PalettePreset> = {
  vapor: {
    name: "Neo-Mint",
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 1.0],
    d: [0.0, 0.1, 0.2]
  },
  sunset: {
    name: "Copper Glow",
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 0.5],
    d: [0.8, 0.5, 0.3]
  },
  slate: {
    name: "Brutalist Gray",
    a: [0.5, 0.5, 0.5],
    b: [0.5, 0.5, 0.5],
    c: [1.0, 1.0, 1.0],
    d: [0.0, 0.0, 0.0]
  },
  acid: {
    name: "Indigo Acid",
    a: [0.8, 0.5, 0.4],
    b: [0.2, 0.4, 0.2],
    c: [2.0, 1.0, 1.0],
    d: [0.0, 0.25, 0.25]
  }
};

export interface StripeFlowProps {
  /** Optional foreground children contents to overlay */
  children?: React.ReactNode;
  /** Active seed for noise generation */
  seed?: number;
  /** Active distortion multiplier */
  distortion?: number;
  /** Active noise scale (density) */
  scale?: number;
  /** Active vignette radius */
  radius?: number;
  /** Active flow speed multiplier */
  speed?: number;
  /** Active color palette name */
  palette?: "vapor" | "sunset" | "slate" | "acid";
  /** Pause animation timeline */
  isPaused?: boolean;
  /** Custom wrapper CSS style classes */
  className?: string;
}

export const StripeFlow: React.FC<StripeFlowProps> = ({
  children,
  seed = 422,
  distortion = 45.0,
  scale = 0.008,
  radius = 0.8,
  speed = 1.0,
  palette = "vapor",
  isPaused = false,
  className = "relative w-full h-[600px] bg-zinc-950 overflow-hidden font-sans select-none rounded-xl border border-neutral-800",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Thread references for context synchronization
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const mouseRef = useRef<[number, number]>([0, 0]);
  const timeRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const sizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  const isVisibleRef = useRef(true);
  const isLoopingRef = useRef(false);
  const drawFrameRef = useRef<() => void>(undefined);
  const startLoopRef = useRef<() => void>(undefined);

  const currentParamsRef = useRef({
    distortion, scale, radius, speed, isPaused, palette, seed
  });

  useEffect(() => {
    currentParamsRef.current = {
      distortion, scale, radius, speed, isPaused, palette, seed
    };
    if (!isPaused && isVisibleRef.current && startLoopRef.current) {
      startLoopRef.current();
    } else if (drawFrameRef.current) {
      drawFrameRef.current();
    }
  }, [distortion, scale, radius, speed, isPaused, palette, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) {
      console.error("WebGL not supported in your browser.");
      return;
    }
    glRef.current = gl;

    // Shader builder helper
    const makeShader = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("Compilation error details: ", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = makeShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = makeShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Linking failed: ", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    // Quad construction coordinates
    const geometry = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Get location map
    const uLocs = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      time: gl.getUniformLocation(program, "u_time"),
      seed: gl.getUniformLocation(program, "SEED"),
      distortion: gl.getUniformLocation(program, "u_distortion"),
      scale: gl.getUniformLocation(program, "u_scale"),
      radius: gl.getUniformLocation(program, "u_radius"),
      palette_a: gl.getUniformLocation(program, "u_palette_a"),
      palette_b: gl.getUniformLocation(program, "u_palette_b"),
      palette_c: gl.getUniformLocation(program, "u_palette_c"),
      palette_d: gl.getUniformLocation(program, "u_palette_d"),
    };

    const resizeHandler = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const targetWidth = container.clientWidth;
      const targetHeight = container.clientHeight;

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      gl.viewport(0, 0, targetWidth, targetHeight);
      sizeRef.current = { width: targetWidth, height: targetHeight };
      if (drawFrameRef.current) drawFrameRef.current();
    };

    resizeHandler();
    window.addEventListener("resize", resizeHandler);

    const container = canvas.parentElement;
    if (!container) return;

    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      const wasVisible = isVisibleRef.current;
      isVisibleRef.current = visible;

      if (visible && !wasVisible) {
        const p = currentParamsRef.current;
        if (!p.isPaused) {
          if (startLoopRef.current) startLoopRef.current();
        } else {
          if (drawFrameRef.current) drawFrameRef.current();
        }
      }
    }, { threshold: 0 });
    observer.observe(container);

    const drawFrame = () => {
      const gl = glRef.current;
      if (!gl) return;
      const p = currentParamsRef.current;

      gl.uniform2f(uLocs.resolution, sizeRef.current.width, sizeRef.current.height);
      gl.uniform2f(uLocs.mouse, mouseRef.current[0], mouseRef.current[1]);
      gl.uniform1f(uLocs.time, timeRef.current);
      gl.uniform1f(uLocs.seed, p.seed);

      gl.uniform1f(uLocs.distortion, p.distortion);
      gl.uniform1f(uLocs.scale, p.scale);
      gl.uniform1f(uLocs.radius, p.radius);

      const chosenPalette = PALETTES[p.palette] || PALETTES.vapor;
      gl.uniform3fv(uLocs.palette_a, new Float32Array(chosenPalette.a));
      gl.uniform3fv(uLocs.palette_b, new Float32Array(chosenPalette.b));
      gl.uniform3fv(uLocs.palette_c, new Float32Array(chosenPalette.c));
      gl.uniform3fv(uLocs.palette_d, new Float32Array(chosenPalette.d));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    drawFrameRef.current = drawFrame;

    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const p = currentParamsRef.current;

      if (!isVisibleRef.current) {
        isLoopingRef.current = false;
        return;
      }

      if (p.isPaused) {
        drawFrame();
        isLoopingRef.current = false;
        return;
      }

      isLoopingRef.current = true;
      timeRef.current += delta * p.speed;
      drawFrame();
      animationFrameIdRef.current = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (!isLoopingRef.current && isVisibleRef.current) {
        lastTimeRef.current = performance.now();
        animationFrameIdRef.current = requestAnimationFrame(tick);
      }
    };

    startLoopRef.current = startLoop;

    if (!isPaused && isVisibleRef.current) {
      startLoop();
    } else {
      drawFrame();
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeHandler);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  const onPointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = [
      e.clientX - rect.left,
      e.clientY - rect.top
    ];
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = [
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top
    ];
  };

  return (
    <div className={className}>
      {/* CANVAS BACKGROUND CONTAINER */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          onMouseMove={onPointerMove}
          onTouchMove={onTouchMove}
          onTouchStart={onTouchMove}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* FOREGROUND CONTENT WRAPPER */}
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none select-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default StripeFlow;
