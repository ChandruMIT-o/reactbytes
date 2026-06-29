"use client";

import React, { useEffect, useRef } from 'react';

// ==========================================
// WebGL Shader Sources
// ==========================================

const VERTEX_SHADER_SOURCE = `
attribute vec3 position;
void main(void){
  gl_Position = vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float u_hover_pulse;  // Dynamic friction/velocity from cursor movement
uniform vec3 u_hover_color;   // Normalized RGB color for hover trail

// Dynamic controlling parameters
uniform vec3 u_base_color;
uniform float u_speed;
uniform float u_complexity;
uniform float u_noise_strength;
uniform float u_singularity_power;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 rotate2d(vec2 p, float angle){
  return mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
}

void main(void) {
  // Center coordinates
  vec2 p = vec2(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  
  // Map mouse coordinates
  vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
  
  // Warp coordinate center based on spring position and hover pulse stretching
  p -= m * (0.28 + u_hover_pulse * 0.45);

  float l = length(p);
  
  // Time modulation speeds up during active high-speed hovering
  float speed_mod = (time * u_speed) + (u_hover_pulse * 2.0);

  // Maximum loop bound is 32.0; we break early if i > u_complexity
  for (float i = 1.0; i < 32.0; i++) {
    if (i > u_complexity) break;
    p = rotate2d(p, i + speed_mod / 10.0);
    float offset = 0.5 / i;
    p.x += offset * sin(i * p.y + speed_mod) + u_noise_strength * noise(vec2(l + speed_mod * 0.8));
    p.y += offset * cos(i * p.x + speed_mod) + u_noise_strength * noise(vec2(l + speed_mod * 0.8));
  }
  
  l = pow(l, u_singularity_power) + l + l + l;
  
  // Spatial intensity calculation
  float intensity = l - noise(p * 2.0 + speed_mod) + sin(l + speed_mod) - 1.0;
  
  // Base colored output
  vec3 col = u_base_color * intensity;
  
  // Cooling electric friction trail when moving cursor quickly
  vec3 hover_flare = u_hover_color * max(0.0, intensity) * u_hover_pulse * 2.52;
  
  gl_FragColor = vec4(col + hover_flare, 1.0);
}
`;

// Helper: Convert HEX color to normalized RGB
const hexToRgb = (hex: string): [number, number, number] => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255,
    ]
    : [1.0, 1.0, 1.0];
};

export interface MalakorSingularityProps {
  /** Color of hover trails (Hex string, e.g. '#0b52ff') */
  hoverColor?: string;
  /** Color of the main singularity (Hex string, e.g. '#ffffff') */
  baseColor?: string;
  /** Speed multiplier for animation (0.1 to 5.0) */
  speed?: number;
  /** Complexity of shader loops (1 to 30) */
  complexity?: number;
  /** Noise distortion strength (0.0 to 5.0) */
  noiseStrength?: number;
  /** Spring stiffness/damping speed for mouse follow (0.01 to 0.5) */
  mouseSpring?: number;
  /** Multiplier for hover trail sensitivity (0.0 to 5.0) */
  hoverSensitivity?: number;
  /** Singularity core tightness (1.0 to 10.0) */
  singularityPower?: number;
  /** Custom wrapper CSS classes */
  className?: string;
}

export const MalakorSingularity: React.FC<MalakorSingularityProps> = ({
  hoverColor = "#0b52ff",
  baseColor = "#ffffff",
  speed = 1.0,
  complexity = 24,
  noiseStrength = 1.0,
  mouseSpring = 0.085,
  hoverSensitivity = 1.5,
  singularityPower = 5.0,
  className = "relative w-full h-[600px] bg-black overflow-hidden select-none cursor-crosshair rounded-xl",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const uniformsRef = useRef<{ [key: string]: WebGLUniformLocation | null }>({});

  // Dynamic coordinate references for spring physics
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const currentMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const lastMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Interactivity values fed to shader uniforms
  const hoverPulseRef = useRef<number>(0.0);

  const timeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const hoverColorRGBRef = useRef<[number, number, number]>(hexToRgb(hoverColor));
  const baseColorRGBRef = useRef<[number, number, number]>(hexToRgb(baseColor));
  const speedRef = useRef<number>(speed);
  const complexityRef = useRef<number>(complexity);
  const noiseStrengthRef = useRef<number>(noiseStrength);
  const mouseSpringRef = useRef<number>(mouseSpring);
  const hoverSensitivityRef = useRef<number>(hoverSensitivity);
  const singularityPowerRef = useRef<number>(singularityPower);

  useEffect(() => {
    hoverColorRGBRef.current = hexToRgb(hoverColor);
  }, [hoverColor]);

  useEffect(() => {
    baseColorRGBRef.current = hexToRgb(baseColor);
  }, [baseColor]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    complexityRef.current = complexity;
  }, [complexity]);

  useEffect(() => {
    noiseStrengthRef.current = noiseStrength;
  }, [noiseStrength]);

  useEffect(() => {
    mouseSpringRef.current = mouseSpring;
  }, [mouseSpring]);

  useEffect(() => {
    hoverSensitivityRef.current = hoverSensitivity;
  }, [hoverSensitivity]);

  useEffect(() => {
    singularityPowerRef.current = singularityPower;
  }, [singularityPower]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;
    glRef.current = gl;

    const buildShader = (src: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    };

    const vs = buildShader(VERTEX_SHADER_SOURCE, gl.VERTEX_SHADER);
    const fs = buildShader(FRAGMENT_SHADER_SOURCE, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    // Uniform setup
    uniformsRef.current = {
      time: gl.getUniformLocation(program, 'time'),
      mouse: gl.getUniformLocation(program, 'mouse'),
      resolution: gl.getUniformLocation(program, 'resolution'),
      hoverPulse: gl.getUniformLocation(program, 'u_hover_pulse'),
      hoverColor: gl.getUniformLocation(program, 'u_hover_color'),
      baseColor: gl.getUniformLocation(program, 'u_base_color'),
      speed: gl.getUniformLocation(program, 'u_speed'),
      complexity: gl.getUniformLocation(program, 'u_complexity'),
      noiseStrength: gl.getUniformLocation(program, 'u_noise_strength'),
      singularityPower: gl.getUniformLocation(program, 'u_singularity_power')
    };

    const position = [
      -1.0, 1.0, 0.0,
      1.0, 1.0, 0.0,
      -1.0, -1.0, 0.0,
      1.0, -1.0, 0.0
    ];
    const index = [
      0, 2, 1,
      1, 2, 3
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 3, gl.FLOAT, false, 0, 0);

    // Dynamic resize handling via ResizeObserver
    const handleResize = (w: number, h: number) => {
      if (!canvas || !gl) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const w = width || canvas.clientWidth || 300;
        const h = height || canvas.clientHeight || 150;
        handleResize(w, h);
      }
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    } else {
      resizeObserver.observe(canvas);
    }

    // ==========================================
    // Render Loop
    // ==========================================
    const renderLoop = () => {
      if (!gl || !canvas) return;

      timeRef.current = (Date.now() - startTimeRef.current) * 0.001;

      // 1. Calculate spring physics interpolation for mouse tracking
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * mouseSpringRef.current;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * mouseSpringRef.current;

      // 2. Calculate instantaneous mouse velocity/friction for the hover warp flare
      const dx = targetMouseRef.current.x - lastMouseRef.current.x;
      const dy = targetMouseRef.current.y - lastMouseRef.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      lastMouseRef.current = { ...targetMouseRef.current };

      // Add velocity directly to the hover pulse effect and decay smoothly
      hoverPulseRef.current = hoverPulseRef.current * 0.9 + velocity * hoverSensitivityRef.current;
      hoverPulseRef.current = Math.min(Math.max(hoverPulseRef.current, 0.0), 1.0);

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Load variables into GPU
      gl.uniform1f(uniformsRef.current.time, timeRef.current);
      gl.uniform2f(uniformsRef.current.mouse, currentMouseRef.current.x, currentMouseRef.current.y);
      gl.uniform2f(uniformsRef.current.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniformsRef.current.hoverPulse, hoverPulseRef.current);
      gl.uniform3f(
        uniformsRef.current.hoverColor,
        hoverColorRGBRef.current[0],
        hoverColorRGBRef.current[1],
        hoverColorRGBRef.current[2]
      );
      gl.uniform3f(
        uniformsRef.current.baseColor,
        baseColorRGBRef.current[0],
        baseColorRGBRef.current[1],
        baseColorRGBRef.current[2]
      );
      gl.uniform1f(uniformsRef.current.speed, speedRef.current);
      gl.uniform1f(uniformsRef.current.complexity, complexityRef.current);
      gl.uniform1f(uniformsRef.current.noiseStrength, noiseStrengthRef.current);
      gl.uniform1f(uniformsRef.current.singularityPower, singularityPowerRef.current);

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      gl.flush();

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    targetMouseRef.current = { x, y };
  };

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />
    </div>
  );
};

export default MalakorSingularity;