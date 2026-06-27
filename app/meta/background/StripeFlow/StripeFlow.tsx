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

  // Hex Colors converted to RGB vectors
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;

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
      
      // Scalar field calculation
      float scalarFieldOffset = u_distortion * cnoise(SEED + vec3(u_scale * pos, sin(u_time / 10.))) * noiseIntensity;
      
      // Phase cycle mapping oscillating between 0.0 and 1.0
      float c = ease(sin(u_time / 2. + TWO_PI * scalarFieldOffset * (abs(sin(u_time / 20.)) + 0.01)) / 2.0 + 0.5, 3.0);

      // Blend between the three hex colors
      vec3 color = mix(u_color1, u_color2, smoothstep(0.0, 0.5, c));
      color = mix(color, u_color3, smoothstep(0.5, 1.0, c));

      gl_FragColor = vec4(color, 1.0);
  }
`;

// Helper to convert hex to WebGL-friendly RGB (0.0 - 1.0)
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : [0, 0, 0];
};

export interface StripeFlowProps {
  children?: React.ReactNode;
  seed?: number;
  distortion?: number;
  scale?: number;
  radius?: number;
  speed?: number;
  isPaused?: boolean;
  className?: string;
  // Intuitive Hex Colors
  color1?: string;
  color2?: string;
  color3?: string;
}

export const StripeFlow: React.FC<StripeFlowProps> = ({
  children,
  seed = 422,
  distortion = 45.0,
  scale = 0.008,
  radius = 0.8,
  speed = 1.0,
  isPaused = false,
  className = "relative w-full h-[600px] bg-zinc-950 overflow-hidden font-sans select-none rounded-xl border border-neutral-800",
  // Default neo-mint aesthetic
  color1 = "#1a2a6c",
  color2 = "#b21f1f",
  color3 = "#fdbb2d",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    distortion, scale, radius, speed, isPaused, seed, color1, color2, color3
  });

  useEffect(() => {
    currentParamsRef.current = {
      distortion, scale, radius, speed, isPaused, seed, color1, color2, color3
    };
    if (!isPaused && isVisibleRef.current && startLoopRef.current) {
      startLoopRef.current();
    } else if (drawFrameRef.current) {
      drawFrameRef.current();
    }
  }, [distortion, scale, radius, speed, isPaused, seed, color1, color2, color3]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;
    glRef.current = gl;

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

    const geometry = new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      -1.0, 1.0,
      1.0, -1.0,
      1.0, 1.0,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uLocs = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      time: gl.getUniformLocation(program, "u_time"),
      seed: gl.getUniformLocation(program, "SEED"),
      distortion: gl.getUniformLocation(program, "u_distortion"),
      scale: gl.getUniformLocation(program, "u_scale"),
      radius: gl.getUniformLocation(program, "u_radius"),
      color1: gl.getUniformLocation(program, "u_color1"),
      color2: gl.getUniformLocation(program, "u_color2"),
      color3: gl.getUniformLocation(program, "u_color3"),
    };

    const container = canvas.parentElement;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const targetWidth = entry.contentRect.width;
        const targetHeight = entry.contentRect.height;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        gl.viewport(0, 0, targetWidth, targetHeight);
        sizeRef.current = { width: targetWidth, height: targetHeight };

        if (drawFrameRef.current) drawFrameRef.current();
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting;
      const wasVisible = isVisibleRef.current;
      isVisibleRef.current = visible;

      if (visible && !wasVisible) {
        const p = currentParamsRef.current;
        if (!p.isPaused && startLoopRef.current) startLoopRef.current();
      }
    }, { threshold: 0 });
    intersectionObserver.observe(container);

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

      // Map parsed Hex directly into shader
      gl.uniform3fv(uLocs.color1, new Float32Array(hexToRgb(p.color1)));
      gl.uniform3fv(uLocs.color2, new Float32Array(hexToRgb(p.color2)));
      gl.uniform3fv(uLocs.color3, new Float32Array(hexToRgb(p.color3)));

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    drawFrameRef.current = drawFrame;

    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const p = currentParamsRef.current;

      if (!isVisibleRef.current || p.isPaused) {
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
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  const onPointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = [e.clientX - rect.left, e.clientY - rect.top];
  };

  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = [e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top];
  };

  return (
    <div className={className}>
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          onMouseMove={onPointerMove}
          onTouchMove={onTouchMove}
          onTouchStart={onTouchMove}
          className="absolute inset-0 w-full h-full block"
        />
      </div>
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none select-none">
          {children}
        </div>
      )}
    </div>
  );
};

export default StripeFlow;