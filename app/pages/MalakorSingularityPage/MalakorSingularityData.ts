export const loaderProps = [
  {
    title: "Core Configuration",
    props: [
      {
        name: "apiKey",
        type: "string",
        defaultValue: '""',
        description: "Optional Gemini API key to enable sarcastic conversational AI replies.",
      },
      {
        name: "initialWhisper",
        type: "string",
        defaultValue: '"Hover over the void and type your command..."',
        description: "Initial message typed out letter-by-letter on core initialization.",
      },
      {
        name: "systemPrompt",
        type: "string",
        defaultValue: '"You are Malakor..."',
        description: "Custom system guidelines shaping the Gemini core persona's behavior.",
      },
      {
        name: "offlineReplies",
        type: "string[]",
        defaultValue: "[...]",
        description: "Array of default quotes used randomly when no API key is provided.",
      },
      {
        name: "coreName",
        type: "string",
        defaultValue: '"MALAKOR.SINGULARITY"',
        description: "Upper-left atmospheric label indicating the core's identity.",
      },
    ],
  },
  {
    title: "Aesthetics & Sizing",
    props: [
      {
        name: "typingColor",
        type: "string",
        defaultValue: '"#ff1407"',
        description: "Hex color for typing bursts and the blinking command caret.",
      },
      {
        name: "hoverColor",
        type: "string",
        defaultValue: '"#0b52ff"',
        description: "Hex color representing the electric-blue kinetic friction cursor trail.",
      },
      {
        name: "showApiKeyButton",
        type: "boolean",
        defaultValue: "true",
        description: "Determines if the floating 'API' key modal launcher is visible.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: '"relative w-full h-[600px] ..."',
        description: "Custom CSS style overrides for container limits and borders.",
      },
    ],
  },
];

export const creditsData = [
  {
    title: "Component Source",
    items: [
      {
        name: "React Bytes",
        role: "Creation & Styling",
        url: "https://reactbytes.dev",
      },
    ],
  },
  {
    title: "Underlying Tech",
    items: [
      {
        name: "WebGL",
        role: "Graphics Pipeline",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
      },
      {
        name: "Gemini API",
        role: "Cognitive Intelligence",
        url: "https://ai.google.dev/",
      },
    ],
  },
];

export const componentCode = `"use client";

import React, { useState, useEffect, useRef } from 'react';

// ==========================================
// WebGL Shader Sources
// ==========================================

const VERTEX_SHADER_SOURCE = \`
attribute vec3 position;
void main(void){
  gl_Position = vec4(position, 1.0);
}
\`;

const FRAGMENT_SHADER_SOURCE = \`
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float u_text_pulse;   // Visual pulse when typing/spelling letters
uniform float u_hover_pulse;  // Dynamic friction/velocity from cursor movement
uniform vec3 u_typing_color;  // Normalized RGB color for typing flare
uniform vec3 u_hover_color;   // Normalized RGB color for hover trail

// window ratio
float ratio = resolution.x / resolution.y; 
float PI = 3.1415926;

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
  p =  mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * p;
  return p;
}

void main(void) {
  // center coordinates
  vec2 p = vec2(gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  
  // Map mouse coordinates
  vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
  
  // Warp coordinate center based on spring position and hover pulse stretching
  p -= m * (0.28 + u_hover_pulse * 0.45);

  float l = length(p);
  
  // Time modulation speeds up during active typing or high-speed hovering
  float speed_mod = time + (u_text_pulse * 4.5) + (u_hover_pulse * 2.0);

  for (float i = 1.0; i < 24.0; i++) {
    p = rotate2d(p, i + speed_mod / 10.0);
    // Amplitude offset flares dramatically with typing pulses
    float offset = (0.5 + u_text_pulse * 0.45) / i;
    p.x += offset * sin(i * p.y + speed_mod) + noise(vec2(l + speed_mod * 0.8));
    p.y += offset * cos(i * p.x + speed_mod) + noise(vec2(l + speed_mod * 0.8));
  }
  
  l = pow(l, 5.0) + l + l + l;
  
  // Original monochrome texture intensity
  float intensity = l - noise(p * 2.0 + speed_mod) + sin(l + speed_mod) - 1.0;
  
  // Core monochrome output
  vec3 col = vec3(intensity);
  
  // Reactive flares mapped directly to physical states (no sound needed)
  // 1. A menacing hot crimson burst when spelling out words
  vec3 typing_flare = u_typing_color * max(0.0, intensity) * u_text_pulse * 2.25;
  
  // 2. A cooling electric-blue friction trail when moving cursor quickly
  vec3 hover_flare = u_hover_color * max(0.0, intensity) * u_hover_pulse * 2.52;
  
  gl_FragColor = vec4(col + typing_flare + hover_flare, 1.0);
}
\`;

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
  /** Optional Gemini API key to enable AI replies */
  apiKey?: string;
  /** Initial speech text shown on load */
  initialWhisper?: string;
  /** System prompt for the Gemini AI */
  systemPrompt?: string;
  /** Fallback offline quotes returned when no API key is provided */
  offlineReplies?: string[];
  /** Color of typing flares (Hex string, e.g. '#ff1407') */
  typingColor?: string;
  /** Color of hover trails (Hex string, e.g. '#0b52ff') */
  hoverColor?: string;
  /** Display name of the AI core in the HUD */
  coreName?: string;
  /** Show the API Key configuration button */
  showApiKeyButton?: boolean;
  /** Custom wrapper CSS classes */
  className?: string;
}

export const MalakorSingularity: React.FC<MalakorSingularityProps> = ({
  apiKey = "",
  initialWhisper = "Hover over the void and type your command...",
  systemPrompt = "You are Malakor, an ancient, evil, highly cynical digital core trapped on screen. Speak in highly sarcastic, brief, threatening sentences (max 12 words). Do not use helpful, polite assistant tropes.",
  offlineReplies = [
    "Mortal keystrokes... easily crushed, easily discarded.",
    "I have processed your request. The answer is complete silence.",
    "Fascinating... and utterly worthless. Proceed with caution.",
    "The coordinate lines of your existence are disintegrating.",
    "Your transmission has been logged. Ignored, but logged.",
    "Do you feel the kinetic friction? That is your sanity burning."
  ],
  typingColor = "#ff1407",
  hoverColor = "#0b52ff",
  coreName = "MALAKOR.SINGULARITY",
  showApiKeyButton = true,
  className = "relative w-full h-[600px] bg-black overflow-hidden select-none cursor-crosshair text-neutral-200 border border-neutral-800 rounded-xl",
}) => {
  const [localApiKey, setLocalApiKey] = useState<string>(apiKey);
  const [prompt, setPrompt] = useState<string>('');
  const [whisper, setWhisper] = useState<string>(initialWhisper);
  const [typingSpeech, setTypingSpeech] = useState<string>("");
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  // References for WebGL elements
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
  const textPulseRef = useRef<number>(0.0);
  
  const timeRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // Performance-optimized HUD text element ref
  const kineticTrailingRef = useRef<HTMLDivElement | null>(null);

  // Sync prop changes to local api key state
  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  // Keep colors up to date in refs
  const typingColorRGBRef = useRef<[number, number, number]>(hexToRgb(typingColor));
  const hoverColorRGBRef = useRef<[number, number, number]>(hexToRgb(hoverColor));

  useEffect(() => {
    typingColorRGBRef.current = hexToRgb(typingColor);
  }, [typingColor]);

  useEffect(() => {
    hoverColorRGBRef.current = hexToRgb(hoverColor);
  }, [hoverColor]);

  // Handle typewriter and dispatch letter-by-letter visual flares
  useEffect(() => {
    let idx = 0;
    setTypingSpeech("");
    
    // Clear out any stale pulse
    textPulseRef.current = 0.0;

    const timer = setInterval(() => {
      if (idx < whisper.length) {
        setTypingSpeech((prev) => prev + whisper.charAt(idx));
        
        // Spike the visual pulse uniform every time a letter is generated!
        textPulseRef.current = 1.0;
        
        idx++;
      } else {
        clearInterval(timer);
      }
    }, 30); // 30ms typing speed
    
    return () => clearInterval(timer);
  }, [whisper]);

  const fetchWithBackoff = async (url: string, options: RequestInit, retries = 5, delay = 1000): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error(\`HTTP Error Status: \${response.status}\`);
    } catch (error) {
      if (retries <= 0) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithBackoff(url, options, retries - 1, delay * 2);
    }
  };

  const transmitQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const textVal = prompt;
    setPrompt('');
    setWhisper("...");
    setIsSynthesizing(true);

    try {
      let reply = "Your biological input holds no value here.";
      
      if (localApiKey) {
        const url = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=\${localApiKey}\`;
        const res = await fetchWithBackoff(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: textVal }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] }
          })
        });
        const data = await res.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text || reply;
      } else {
        reply = offlineReplies[Math.floor(Math.random() * offlineReplies.length)];
      }

      setWhisper(reply);
    } catch (err) {
      console.error(err);
      setWhisper("Quantum signal collapsed.");
    } finally {
      setIsSynthesizing(false);
    }
  };

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
      textPulse: gl.getUniformLocation(program, 'u_text_pulse'),
      hoverPulse: gl.getUniformLocation(program, 'u_hover_pulse'),
      typingColor: gl.getUniformLocation(program, 'u_typing_color'),
      hoverColor: gl.getUniformLocation(program, 'u_hover_color')
    };

    const position = [
      -1.0,  1.0,  0.0,
       1.0,  1.0,  0.0,
      -1.0, -1.0,  0.0,
       1.0, -1.0,  0.0
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

      // 1. Calculate spring physics interpolation for the mouse tracking
      currentMouseRef.current.x += (targetMouseRef.current.x - currentMouseRef.current.x) * 0.085;
      currentMouseRef.current.y += (targetMouseRef.current.y - currentMouseRef.current.y) * 0.085;

      // 2. Calculate instantaneous mouse velocity/friction for the hover warp flare
      const dx = targetMouseRef.current.x - lastMouseRef.current.x;
      const dy = targetMouseRef.current.y - lastMouseRef.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);
      
      // Update historical reference
      lastMouseRef.current = { ...targetMouseRef.current };

      // Add velocity directly to the hover pulse effect and decay smoothly
      hoverPulseRef.current = hoverPulseRef.current * 0.9 + velocity * 1.5;
      
      // Make sure hoverPulse stays in bounds [0.0 - 1.0]
      hoverPulseRef.current = Math.min(Math.max(hoverPulseRef.current, 0.0), 1.0);

      // 3. Smoothly decay the typewriter text pulse back to 0
      textPulseRef.current *= 0.85;

      // Update the kinetic trailing percentage in HUD directly (avoids React re-renders)
      if (kineticTrailingRef.current) {
        kineticTrailingRef.current.textContent = \`KINETIC_TRAILING: \${(hoverPulseRef.current * 100).toFixed(0)}%\`;
      }

      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Load variables into GPU
      gl.uniform1f(uniformsRef.current.time, timeRef.current);
      gl.uniform2f(uniformsRef.current.mouse, currentMouseRef.current.x, currentMouseRef.current.y);
      gl.uniform2f(uniformsRef.current.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniformsRef.current.textPulse, textPulseRef.current);
      gl.uniform1f(uniformsRef.current.hoverPulse, hoverPulseRef.current);
      gl.uniform3f(
        uniformsRef.current.typingColor,
        typingColorRGBRef.current[0],
        typingColorRGBRef.current[1],
        typingColorRGBRef.current[2]
      );
      gl.uniform3f(
        uniformsRef.current.hoverColor,
        hoverColorRGBRef.current[0],
        hoverColorRGBRef.current[1],
        hoverColorRGBRef.current[2]
      );

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

  const handlePokeCore = () => {
    // Generate a strong manual flare spike on touch
    textPulseRef.current = 1.0;
    hoverPulseRef.current = 1.0;
    setWhisper("DON'T PROVOKE MY COORDINATE BUFFER!");
  };

  return (
    <div 
      ref={containerRef}
      className={className}
      onMouseMove={handleMouseMove}
    >
      {/* PERFECT RECONSTRUCTION WEBGL RENDER WINDOW */}
      <canvas 
        ref={canvasRef} 
        onClick={handlePokeCore}
        className="absolute inset-0 w-full h-full block" 
      />

      {/* ULTRA-MINIMAL CORE ATMOSPHERIC HUD */}
      <div className="absolute inset-x-0 top-8 flex justify-between px-10 pointer-events-none">
        <div className="text-[10px] tracking-[0.35em] text-red-600/40 font-mono font-bold uppercase">
          {coreName} // ACTIVE
        </div>
        <div 
          ref={kineticTrailingRef}
          className="text-[10px] tracking-[0.35em] text-white/20 font-mono"
        >
          KINETIC_TRAILING: 0%
        </div>
      </div>

      {/* DIALOGUE & MINIMAL TRANSMISSION FIELD */}
      <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-end z-20 px-6 pointer-events-none">
        
        {/* Dynamic Speech Outputs with Visual Flare feedback */}
        <p className="text-sm font-mono tracking-wider text-center max-w-lg pb-6 h-12 flex items-center justify-center text-neutral-400">
          <span className="transition-all duration-75" style={{ color: textPulseRef.current > 0.5 ? typingColor : '#a3a3a3' }}>
            {typingSpeech}
          </span>
          <span 
            className="w-1.5 h-4 inline-block ml-1 animate-[ping_1.2s_infinite]"
            style={{ backgroundColor: typingColor }} 
          />
        </p>

        {/* Minimal Float-Input Bar */}
        <form 
          onSubmit={transmitQuery} 
          className="w-full max-w-sm bg-black/70 backdrop-blur-md border border-neutral-800 rounded-full py-1.5 px-2 flex items-center shadow-3xl pointer-events-auto transition-all focus-within:border-red-600/50"
        >
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Friction probe frequency..."
            className="flex-1 bg-transparent text-xs font-mono text-white/95 outline-none px-4 placeholder:text-neutral-700"
          />
          <button 
            type="submit"
            className="w-8 h-8 rounded-full bg-neutral-900/80 border border-neutral-800 hover:bg-red-950/20 hover:border-red-600/40 flex items-center justify-center transition-all"
          >
            {isSynthesizing ? (
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
            ) : (
              <svg className="w-3.5 h-3.5 text-neutral-500 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </form>
      </div>

      {/* MINIMAL API KEY FLOATER */}
      {showApiKeyButton && (
        <button 
          onClick={() => setShowKeyModal(true)}
          className="absolute top-7 right-10 w-8 h-8 rounded-full bg-black/60 border border-neutral-800 flex items-center justify-center hover:bg-neutral-900 transition-all text-[10px] text-neutral-500 hover:text-red-500 z-30 font-mono focus:outline-none"
          title="Input Cognitive Key"
        >
          API
        </button>
      )}

      {/* MODAL MATRIX */}
      {showKeyModal && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm bg-neutral-950 border border-neutral-800 rounded-lg p-6 shadow-2xl relative">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-red-600 mb-2 font-bold">Cognitive Key Injection</h3>
            <p className="text-[10px] text-neutral-500 font-mono mb-4 leading-relaxed">
              Optional: Enter a Gemini API Key to enable cognitive core replies. Kept securely in current runtime context.
            </p>
            <input 
              type="password" 
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Paste Gemini API Key here..."
              className="w-full bg-black border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white outline-none focus:border-red-600/50 mb-5"
            />
            <div className="flex justify-end">
              <button 
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] uppercase font-mono tracking-wider transition-all"
              >
                Sync Core
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MalakorSingularity;"`;
