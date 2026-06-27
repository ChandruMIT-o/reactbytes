/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useRef, useState } from "react";

// --- CUSTOM FONTS & STYLE OVERRIDES (INJECTED DIRECTLY) ---
const customStyles = `  
  /* Grid Animation */
  @keyframes pulse-grid {
    0%, 100% { opacity: 0.15; }
    50% { opacity: 0.35; }
  }
  .animated-grid {
    animation: pulse-grid 8s ease-in-out infinite;
  }
`;

// --- PRESET PALETTES ---
const PALETTES: Record<string, number[][]> = {
  midnight: [
    [0.15, 0.35, 0.65],
    [0.20, 0.45, 0.75],
    [0.25, 0.58, 0.85],
    [0.30, 0.70, 0.90],
    [0.45, 0.80, 0.95],
    [0.55, 0.88, 1.00],
    [0.70, 0.93, 1.00],
    [0.85, 0.98, 1.00]
  ],
  aurora: [
    [0.05, 0.35, 0.45],
    [0.10, 0.48, 0.50],
    [0.15, 0.62, 0.55],
    [0.25, 0.72, 0.58],
    [0.40, 0.82, 0.60],
    [0.55, 0.88, 0.64],
    [0.72, 0.93, 0.70],
    [0.85, 0.98, 0.82]
  ],
  sirocco: [
    [0.35, 0.30, 0.25],
    [0.50, 0.38, 0.30],
    [0.65, 0.48, 0.34],
    [0.78, 0.56, 0.38],
    [0.88, 0.66, 0.42],
    [0.94, 0.75, 0.46],
    [0.98, 0.84, 0.55],
    [1.00, 0.92, 0.68]
  ],
  volcanic: [
    [0.25, 0.12, 0.15],
    [0.42, 0.18, 0.20],
    [0.60, 0.25, 0.24],
    [0.75, 0.34, 0.28],
    [0.88, 0.46, 0.32],
    [0.96, 0.58, 0.38],
    [1.00, 0.72, 0.45],
    [1.00, 0.88, 0.55]
  ],
  monochrome: [
    [0.15, 0.15, 0.18],
    [0.25, 0.25, 0.28],
    [0.38, 0.38, 0.42],
    [0.50, 0.50, 0.55],
    [0.65, 0.65, 0.70],
    [0.78, 0.78, 0.82],
    [0.88, 0.88, 0.92],
    [0.98, 0.98, 1.00]
  ]
};

interface PresetConfig {
  name: string;
  palette: string;
  flowSpeed: number;
  fieldGain: number;
  bgU: number;
  bgV: number;
  wander: number;
  erase: number;
  particles: number;
}

const PRESETS: Record<string, PresetConfig> = {
  mistral: {
    name: "Mistral Surge",
    palette: "midnight",
    flowSpeed: 3.1,
    fieldGain: 0.45,
    bgU: 0.06,
    bgV: 0.02,
    wander: 0.024,
    erase: 0.06,
    particles: 15000
  },
  sirocco: {
    name: "Sirocco Dust",
    palette: "sirocco",
    flowSpeed: 2.4,
    fieldGain: 0.4,
    bgU: -0.015,
    bgV: -0.045,
    wander: 0.022,
    erase: 0.08,
    particles: 12000
  },
  aurora: {
    name: "Boreal Flow",
    palette: "aurora",
    flowSpeed: 1.8,
    fieldGain: 0.35,
    bgU: 0.03,
    bgV: -0.01,
    wander: 0.012,
    erase: 0.04,
    particles: 18000
  },
  storm: {
    name: "Winter Gale",
    palette: "volcanic",
    flowSpeed: 3.8,
    fieldGain: 0.55,
    bgU: 0.08,
    bgV: -0.03,
    wander: 0.035,
    erase: 0.12,
    particles: 22000
  },
  zen: {
    name: "Zenith Drift",
    palette: "monochrome",
    flowSpeed: 1.2,
    fieldGain: 0.22,
    bgU: 0.015,
    bgV: 0.0,
    wander: 0.005,
    erase: 0.03,
    particles: 8000
  }
};

export interface PressureSystem {
  id: string;
  x: number;
  y: number;
  spin: number;
  r: number;
  strength: number;
  name: string;
  targetX: number;
  targetY: number;
  targetSpin: number;
  targetR: number;
  targetStrength: number;
  baseR: number;
  baseStrength: number;
  displayX: number;
  displayY: number;
  phaseX: number;
  phaseY: number;
  phaseStrength: number;
  phaseRadius: number;
}

export interface SimState {
  w: number;
  h: number;
  dpr: number;
  pw: number;
  ph: number;
  aspect: number;
  gridW: number;
  gridH: number;
  fieldRow: number;
  frame: number;
  flowSpeed: number;
  fieldGain: number;
  bgU: number;
  bgV: number;
  wander: number;
  erase: number;
  particlesCount: number;
  running: boolean;
  rafId: number;
  lastT: number;
  lastStep: number;
  fboA: WebGLFramebuffer | null;
  fboB: WebGLFramebuffer | null;
  texA: WebGLTexture | null;
  texB: WebGLTexture | null;
  read: { tex: WebGLTexture | null; fbo: WebGLFramebuffer | null } | null;
  write: { tex: WebGLTexture | null; fbo: WebGLFramebuffer | null } | null;
  systems: PressureSystem[];
}

export interface ShaderDetails {
  quadProgram: WebGLProgram | null;
  lineProgram: WebGLProgram | null;
  quad: {
    buffer?: WebGLBuffer | null;
    aPos?: number;
    uTex?: WebGLUniformLocation | null;
    uBg?: WebGLUniformLocation | null;
    uKeep?: WebGLUniformLocation | null;
    uMode?: WebGLUniformLocation | null;
  };
  lines: {
    positionBuffer?: WebGLBuffer | null;
    colorBuffer?: WebGLBuffer | null;
    aPos?: number;
    aColor?: number;
    uAspect?: WebGLUniformLocation | null;
  };
}

export interface ParticlesArrays {
  xs: Float32Array | null;
  ys: Float32Array | null;
  pxs: Float32Array | null;
  pys: Float32Array | null;
  ages: Float32Array | null;
  lifes: Float32Array | null;
  bins: Uint8Array | null;
  linePositions: Float32Array | null;
  lineColors: Float32Array | null;
}

export interface GridField {
  fieldU: Float32Array | null;
  fieldV: Float32Array | null;
  fieldB: Uint8Array | null;
}

export interface AtmosphericDriftProps {
  /** Optional foreground children contents to overlay */
  children?: React.ReactNode;
  /** Rendering alignment grid overlay state */
  showGrid?: boolean;
  /** Audio synthesizer engine enablement */
  audioEnabled?: boolean;
  /** Active wind preset */
  preset?: "mistral" | "sirocco" | "aurora" | "storm" | "zen";
  /** Active color spectrum mapping */
  palette?: "midnight" | "aurora" | "sirocco" | "volcanic" | "monochrome";
  /** Active particle count */
  particleCount?: number;
  /** Active flow speed */
  flowSpeed?: number;
  /** Active trail persistence (retention) */
  trailPersistence?: number;
  /** Active wind wobble (dissipation) */
  windWobble?: number;
  /** Custom wrapper CSS style classes */
  className?: string;
  /** Callback triggered when a new pressure system is spawned or systems are cleared */
  onSystemsChange?: (systems: { id: string; name: string; spin: number }[]) => void;
  /** Next pressure system type to place when clicking */
  nextPlacementType?: "high" | "low";
  /** Callback triggered when the next placement type swaps automatically */
  onPlacementTypeChange?: (type: "high" | "low") => void;
}

export interface AtmosphericDriftRef {
  clearAllSystems: () => void;
  deleteSystem: (id: string) => void;
}

export const AtmosphericDrift = React.forwardRef<AtmosphericDriftRef, AtmosphericDriftProps>(({
  children,
  showGrid = true,
  audioEnabled = false,
  preset = "mistral",
  palette,
  particleCount,
  flowSpeed,
  trailPersistence,
  windWobble,
  className = "relative w-full h-[600px] bg-[#07090e] overflow-hidden font-sans-custom select-none text-white rounded-xl border border-neutral-800",
  onSystemsChange,
  nextPlacementType,
  onPlacementTypeChange,
}, ref) => {
  // WebGL & Canvas References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthRef = useRef<any>(null);

  const activePreset = preset || "mistral";
  const defaultPresetConfig = PRESETS[activePreset];

  const stateRef = useRef<SimState>({
    w: 1,
    h: 1,
    dpr: 1,
    pw: 1,
    ph: 1,
    aspect: 1,
    gridW: 1,
    gridH: 1,
    fieldRow: 0,
    frame: 0,
    flowSpeed: flowSpeed !== undefined ? flowSpeed : defaultPresetConfig.flowSpeed,
    fieldGain: defaultPresetConfig.fieldGain,
    bgU: defaultPresetConfig.bgU,
    bgV: defaultPresetConfig.bgV,
    wander: windWobble !== undefined ? windWobble : defaultPresetConfig.wander,
    erase: trailPersistence !== undefined ? 1.0 - trailPersistence : defaultPresetConfig.erase,
    particlesCount: particleCount !== undefined ? particleCount : defaultPresetConfig.particles,
    running: true,
    rafId: 0,
    lastT: 0,
    lastStep: 0,
    fboA: null,
    fboB: null,
    texA: null,
    texB: null,
    read: null,
    write: null,
    systems: []
  });

  // Shader Variables and Buffers
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const shadersRef = useRef<ShaderDetails>({
    quadProgram: null,
    lineProgram: null,
    quad: {},
    lines: {}
  });

  // Float Arrays for Simulation
  const particlesArraysRef = useRef<ParticlesArrays>({
    xs: null,
    ys: null,
    pxs: null,
    pys: null,
    ages: null,
    lifes: null,
    bins: null,
    linePositions: null,
    lineColors: null
  });

  const fieldRef = useRef<GridField>({
    fieldU: null,
    fieldV: null,
    fieldB: null
  });

  // Controlled Palette Mapping State
  const [currentPalette, setCurrentPalette] = useState<string>(palette || defaultPresetConfig.palette);

  // Placement State Tracker: Fallback to local state if not controlled
  const [internalPlacementType, setInternalPlacementType] = useState<"high" | "low">("high");
  const actualPlacementType = nextPlacementType || internalPlacementType;

  // Setup Ambient Audio Engine
  const toggleAmbientWind = (on: boolean) => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      // 2 seconds of pinkish noise
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 2.5;
      filter.frequency.value = 400;

      const gain = ctx.createGain();
      gain.gain.value = 0.0;

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(0);

      synthRef.current = { ctx, source, filter, gain };
    }

    const synth = synthRef.current;
    if (synth) {
      if (on) {
        if (synth.ctx.state === "suspended") {
          synth.ctx.resume();
        }
        synth.gain.gain.setTargetAtTime(0.08, synth.ctx.currentTime, 0.8);
      } else {
        synth.gain.gain.setTargetAtTime(0.0, synth.ctx.currentTime, 0.5);
      }
    }
  };

  // Safe vector pool reallocation
  const reallocateParticles = (count: number) => {
    const arrays = particlesArraysRef.current;
    arrays.xs = new Float32Array(count);
    arrays.ys = new Float32Array(count);
    arrays.pxs = new Float32Array(count);
    arrays.pys = new Float32Array(count);
    arrays.ages = new Float32Array(count);
    arrays.lifes = new Float32Array(count);
    arrays.bins = new Uint8Array(count);
    arrays.linePositions = new Float32Array(count * 4);
    arrays.lineColors = new Float32Array(count * 8);

    const aspect = stateRef.current.aspect || 1.6;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * aspect;
      const y = Math.random();
      arrays.xs[i] = x;
      arrays.ys[i] = y;
      arrays.pxs[i] = x;
      arrays.pys[i] = y;
      arrays.ages[i] = Math.random() * 3.9;
      arrays.lifes[i] = 1.15 + Math.random() * 2.75;
      arrays.bins[i] = 0;
    }

    const gl = glRef.current;
    const { lines } = shadersRef.current;
    if (gl && lines.positionBuffer && lines.colorBuffer) {
      gl.bindBuffer(gl.ARRAY_BUFFER, lines.positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, arrays.linePositions.byteLength, gl.DYNAMIC_DRAW);
      gl.bindBuffer(gl.ARRAY_BUFFER, lines.colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, arrays.lineColors.byteLength, gl.DYNAMIC_DRAW);
    }
  };

  // WebGL & Pipeline Lifecycle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false
    }) as WebGLRenderingContext | null;
    if (!gl) return;
    glRef.current = gl;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
      }
      return s;
    };

    const link = (vs: string, fs: string) => {
      const p = gl.createProgram();
      if (!p) return null;
      const vsShader = compile(gl.VERTEX_SHADER, vs);
      const fsShader = compile(gl.FRAGMENT_SHADER, fs);
      if (!vsShader || !fsShader) return null;
      gl.attachShader(p, vsShader);
      gl.attachShader(p, fsShader);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(p));
      }
      return p;
    };

    const quadVs = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;
    const quadFs = `
      precision mediump float;
      uniform sampler2D u_tex;
      uniform vec3 u_bg;
      uniform float u_keep;
      uniform float u_mode;
      varying vec2 v_uv;
      void main() {
        vec3 c = texture2D(u_tex, v_uv).rgb;
        vec3 faded = mix(u_bg, c, u_keep);
        vec3 outColor = mix(c, faded, u_mode);
        gl_FragColor = vec4(outColor, 1.0);
      }
    `;

    const lineVs = `
      attribute vec2 a_pos;
      attribute vec4 a_color;
      uniform float u_aspect;
      varying vec4 v_color;
      void main() {
        float x = (a_pos.x / u_aspect) * 2.0 - 1.0;
        float y = 1.0 - a_pos.y * 2.0;
        gl_Position = vec4(x, y, 0.0, 1.0);
        v_color = a_color;
      }
    `;
    const lineFs = `
      precision mediump float;
      varying vec4 v_color;
      void main() {
        gl_FragColor = v_color;
      }
    `;

    const quadProgram = link(quadVs, quadFs);
    const lineProgram = link(lineVs, lineFs);
    if (!quadProgram || !lineProgram) return;

    shadersRef.current.quadProgram = quadProgram;
    shadersRef.current.lineProgram = lineProgram;

    shadersRef.current.quad = {
      buffer: gl.createBuffer(),
      aPos: gl.getAttribLocation(quadProgram, "a_pos"),
      uTex: gl.getUniformLocation(quadProgram, "u_tex"),
      uBg: gl.getUniformLocation(quadProgram, "u_bg"),
      uKeep: gl.getUniformLocation(quadProgram, "u_keep"),
      uMode: gl.getUniformLocation(quadProgram, "u_mode")
    };

    const quadBuf = shadersRef.current.quad.buffer;
    if (quadBuf) {
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    }

    shadersRef.current.lines = {
      positionBuffer: gl.createBuffer(),
      colorBuffer: gl.createBuffer(),
      aPos: gl.getAttribLocation(lineProgram, "a_pos"),
      aColor: gl.getAttribLocation(lineProgram, "a_color"),
      uAspect: gl.getUniformLocation(lineProgram, "u_aspect")
    };

    reallocateParticles(stateRef.current.particlesCount);

    const buildFbos = (w: number, h: number) => {
      const createTex = () => {
        const t = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        return t;
      };

      const createFbo = (t: WebGLTexture | null) => {
        const f = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, f);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
        return f;
      };

      if (stateRef.current.texA) gl.deleteTexture(stateRef.current.texA);
      if (stateRef.current.texB) gl.deleteTexture(stateRef.current.texB);
      if (stateRef.current.fboA) gl.deleteFramebuffer(stateRef.current.fboA);
      if (stateRef.current.fboB) gl.deleteFramebuffer(stateRef.current.fboB);

      const texA = createTex();
      const texB = createTex();
      const fboA = createFbo(texA);
      const fboB = createFbo(texB);

      stateRef.current.texA = texA;
      stateRef.current.texB = texB;
      stateRef.current.fboA = fboA;
      stateRef.current.fboB = fboB;

      stateRef.current.read = { tex: texA, fbo: fboA };
      stateRef.current.write = { tex: texB, fbo: fboB };

      gl.bindFramebuffer(gl.FRAMEBUFFER, fboA);
      gl.clearColor(0.04, 0.05, 0.07, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
      gl.clearColor(0.04, 0.05, 0.07, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
    };

    const rebuildGridField = (w: number, h: number) => {
      const step = 28;
      const gw = Math.max(2, Math.ceil(w / step));
      const gh = Math.max(2, Math.ceil(h / step));
      stateRef.current.gridW = gw;
      stateRef.current.gridH = gh;
      stateRef.current.fieldRow = 0;

      const total = gw * gh;
      fieldRef.current.fieldU = new Float32Array(total);
      fieldRef.current.fieldV = new Float32Array(total);
      fieldRef.current.fieldB = new Uint8Array(total);
    };

    // Responsive handling using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const w = width || canvas.clientWidth || 300;
        const h = height || canvas.clientHeight || 150;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const pw = Math.floor(w * dpr);
        const ph = Math.floor(h * dpr);

        stateRef.current.w = w;
        stateRef.current.h = h;
        stateRef.current.dpr = dpr;
        stateRef.current.pw = pw;
        stateRef.current.ph = ph;
        stateRef.current.aspect = w / h;

        canvas.width = pw;
        canvas.height = ph;

        buildFbos(pw, ph);
        rebuildGridField(w, h);
      }
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    } else {
      resizeObserver.observe(canvas);
    }

    stateRef.current.running = true;
    stateRef.current.lastT = performance.now();
    stateRef.current.lastStep = 0;

    const frame = (now: number) => {
      if (!stateRef.current.running) return;
      stateRef.current.rafId = requestAnimationFrame(frame);

      const targetFps = 45;
      const frameMs = 1000 / targetFps;
      const elapsed = now - stateRef.current.lastStep;
      if (elapsed < frameMs) return;
      stateRef.current.lastStep = now - (elapsed % frameMs);

      let dt = (now - stateRef.current.lastT) * 0.001;
      stateRef.current.lastT = now;
      if (!Number.isFinite(dt) || dt < 0 || dt > 0.1) {
        dt = 1 / targetFps;
      }

      stateRef.current.frame++;

      stepAtmosphere(dt);
      calculateDynamicGrid();
      simulateParticles(dt);
      renderWebGL();
    };

    stateRef.current.rafId = requestAnimationFrame(frame);

    return () => {
      stateRef.current.running = false;
      cancelAnimationFrame(stateRef.current.rafId);
      resizeObserver.disconnect();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        synthRef.current = null;
      }
    };
  }, []);

  // Sync props to simulator state dynamically
  useEffect(() => {
    const config = PRESETS[activePreset];
    if (config) {
      if (palette === undefined) {
        setCurrentPalette(config.palette);
      }
      if (flowSpeed === undefined) {
        stateRef.current.flowSpeed = config.flowSpeed;
      }
      if (trailPersistence === undefined) {
        stateRef.current.erase = config.erase;
      }
      if (windWobble === undefined) {
        stateRef.current.wander = config.wander;
      }
      if (particleCount === undefined) {
        stateRef.current.particlesCount = config.particles;
        reallocateParticles(config.particles);
      }
      stateRef.current.bgU = config.bgU;
      stateRef.current.bgV = config.bgV;
      stateRef.current.fieldRow = 0;
    }
  }, [activePreset]);

  useEffect(() => {
    if (palette !== undefined) {
      setCurrentPalette(palette);
    }
  }, [palette]);

  useEffect(() => {
    if (flowSpeed !== undefined) {
      stateRef.current.flowSpeed = flowSpeed;
    }
  }, [flowSpeed]);

  useEffect(() => {
    if (trailPersistence !== undefined) {
      stateRef.current.erase = 1.0 - trailPersistence;
    }
  }, [trailPersistence]);

  useEffect(() => {
    if (windWobble !== undefined) {
      stateRef.current.wander = windWobble;
    }
  }, [windWobble]);

  useEffect(() => {
    if (particleCount !== undefined) {
      stateRef.current.particlesCount = particleCount;
      reallocateParticles(particleCount);
    }
  }, [particleCount]);

  useEffect(() => {
    toggleAmbientWind(audioEnabled);
  }, [audioEnabled]);

  // Expose methods via ref for parent to clear or delete pressure systems
  React.useImperativeHandle(ref, () => ({
    clearAllSystems,
    deleteSystem
  }));

  // Atmosphere simulation steps
  const stepAtmosphere = (dt: number) => {
    const sState = stateRef.current;
    const systems = sState.systems;
    const time = performance.now() * 0.001;
    const driftEase = Math.min(1.0, dt * 0.35);

    systems.forEach((s) => {
      const wobbleX = Math.sin(time * 0.075 + s.phaseX) * sState.wander;
      const wobbleY = Math.cos(time * 0.068 + s.phaseY) * sState.wander;
      const tx = Math.max(0.05, Math.min(sState.aspect - 0.05, s.targetX + wobbleX));
      const ty = Math.max(0.05, Math.min(0.95, s.targetY + wobbleY));

      s.x += (tx - s.x) * driftEase;
      s.y += (ty - s.y) * driftEase;

      const strengthWave = Math.sin(time * 0.05 + s.phaseStrength);
      s.baseStrength += (s.targetStrength - s.baseStrength) * driftEase;
      s.strength = s.baseStrength * (1.0 + strengthWave * 0.08);

      s.displayX += (s.x - s.displayX) * 0.15;
      s.displayY += (s.y - s.displayY) * 0.15;
    });
  };

  const computeCellUv = (fx: number, fy: number, index: number) => {
    const sState = stateRef.current;
    let u = sState.bgU;
    let v = sState.bgV;

    sState.systems.forEach((s) => {
      const cx = s.x;
      const rx = fx - cx;
      const ry = fy - s.y;
      const distSq = rx * rx + ry * ry + 0.0001;
      const dist = Math.sqrt(distSq);
      const invD = 1.0 / dist;
      const r = s.r;

      const forceMag = s.strength * (dist / r) * Math.exp(-distSq / (2.0 * r * r)) * sState.fieldGain;
      const tx = -ry * invD;
      const ty = rx * invD;

      u += s.spin * forceMag * tx;
      v += s.spin * forceMag * ty;

      const radial = -s.spin * 0.32 * forceMag;
      u += rx * invD * radial;
      v += ry * invD * radial;
    });

    const fu = fieldRef.current.fieldU;
    const fv = fieldRef.current.fieldV;
    const fb = fieldRef.current.fieldB;

    if (fu && fv && fb) {
      fu[index] = u;
      fv[index] = v;

      const speedSq = u * u + v * v;
      fb[index] = speedSq < 0.0016 ? 0 : speedSq < 0.0064 ? 1 : speedSq < 0.015 ? 2 : 3;
    }
  };

  const calculateDynamicGrid = () => {
    const sState = stateRef.current;
    const gw = sState.gridW;
    const gh = sState.gridH;
    const aspect = sState.aspect;

    const rowsPerFrame = 2;
    for (let r = 0; r < rowsPerFrame; r++) {
      const y = sState.fieldRow;
      const fy = y / (gh - 1);
      let cellOffset = y * gw;

      for (let x = 0; x < gw; x++) {
        const fx = (x / (gw - 1)) * aspect;
        computeCellUv(fx, fy, cellOffset);
        cellOffset++;
      }

      sState.fieldRow = (sState.fieldRow + 1) % gh;
    }
  };

  const sampleDynamicGrid = (fx: number, fy: number) => {
    const sState = stateRef.current;
    const gw = sState.gridW;
    const gh = sState.gridH;

    const gx = Math.max(0, Math.min(gw - 1, (fx / sState.aspect) * (gw - 1)));
    const gy = Math.max(0, Math.min(gh - 1, fy * (gh - 1)));

    const x0 = Math.floor(gx);
    const y0 = Math.floor(gy);
    const x1 = Math.min(gw - 1, x0 + 1);
    const y1 = Math.min(gh - 1, y0 + 1);

    const tx = gx - x0;
    const ty = gy - y0;

    const i00 = y0 * gw + x0;
    const i10 = y0 * gw + x1;
    const i01 = y1 * gw + x0;
    const i11 = y1 * gw + x1;

    const fu = fieldRef.current.fieldU;
    const fv = fieldRef.current.fieldV;

    if (!fu || !fv) return { u: 0, v: 0 };

    const u00 = fu[i00];
    const u10 = fu[i10];
    const u01 = fu[i01];
    const u11 = fu[i11];

    const v00 = fv[i00];
    const v10 = fv[i10];
    const v01 = fv[i01];
    const v11 = fv[i11];

    const u0 = u00 + (u10 - u00) * tx;
    const u1 = u01 + (u11 - u01) * tx;
    const u = u0 + (u1 - u0) * ty;

    const v0 = v00 + (v10 - v00) * tx;
    const v1 = v01 + (v11 - v01) * tx;
    const v = v0 + (v1 - v0) * ty;

    return { u, v };
  };

  const simulateParticles = (dt: number) => {
    const sState = stateRef.current;
    const count = sState.particlesCount;
    const arrays = particlesArraysRef.current;
    const aspect = sState.aspect;

    if (!arrays.xs || !arrays.ys || !arrays.ages || !arrays.lifes || !arrays.linePositions || !arrays.lineColors) return;

    let vp = 0;
    let cp = 0;
    let speedSum = 0;

    const paletteColors = PALETTES[currentPalette] || PALETTES.midnight;
    const speedLimitSq = 0.0256;

    for (let i = 0; i < count; i++) {
      const x = arrays.xs[i];
      const y = arrays.ys[i];
      arrays.ages[i] += dt;

      const { u, v } = sampleDynamicGrid(x, y);
      const nx = x + u * dt * sState.flowSpeed;
      const ny = y + v * dt * sState.flowSpeed;
      const speedSq = u * u + v * v;
      speedSum += Math.sqrt(speedSq);

      if (arrays.ages[i] > arrays.lifes[i] || nx < 0 || nx > aspect || ny < 0 || ny > 1) {
        const rx = Math.random() * aspect;
        const ry = Math.random();
        arrays.xs[i] = rx;
        arrays.ys[i] = ry;
        if (arrays.pxs && arrays.pys) {
          arrays.pxs[i] = rx;
          arrays.pys[i] = ry;
        }
        arrays.ages[i] = 0;
        arrays.lifes[i] = 1.15 + Math.random() * 2.75;

        arrays.linePositions[vp++] = rx;
        arrays.linePositions[vp++] = ry;
        arrays.linePositions[vp++] = rx;
        arrays.linePositions[vp++] = ry;

        for (let k = 0; k < 8; k++) {
          arrays.lineColors[cp++] = 0.0;
        }
        continue;
      }

      if (arrays.pxs && arrays.pys) {
        arrays.pxs[i] = x;
        arrays.pys[i] = y;
      }
      arrays.xs[i] = nx;
      arrays.ys[i] = ny;

      arrays.linePositions[vp++] = x;
      arrays.linePositions[vp++] = y;
      arrays.linePositions[vp++] = nx;
      arrays.linePositions[vp++] = ny;

      const colorIntensity = Math.min(1.0, speedSq / speedLimitSq);
      const maxIdx = paletteColors.length - 1;
      const rawIdx = colorIntensity * maxIdx;
      const idx = Math.floor(rawIdx);
      const nextIdx = Math.min(maxIdx, idx + 1);
      const factor = rawIdx - idx;

      const c0 = paletteColors[idx];
      const c1 = paletteColors[nextIdx];

      const r = c0[0] + (c1[0] - c0[0]) * factor;
      const g = c0[1] + (c1[1] - c0[1]) * factor;
      const b = c0[2] + (c1[2] - c0[2]) * factor;

      arrays.lineColors[cp++] = r;
      arrays.lineColors[cp++] = g;
      arrays.lineColors[cp++] = b;
      arrays.lineColors[cp++] = 0.65;
      arrays.lineColors[cp++] = r;
      arrays.lineColors[cp++] = g;
      arrays.lineColors[cp++] = b;
      arrays.lineColors[cp++] = 0.65;
    }

    const currentSpeed = speedSum / count;

    if (synthRef.current && audioEnabled) {
      const targetFreq = 150 + currentSpeed * 2200;
      const targetVol = Math.min(0.24, currentSpeed * 3.5);
      synthRef.current.filter.frequency.setTargetAtTime(targetFreq, synthRef.current.ctx.currentTime, 0.25);
      synthRef.current.gain.gain.setTargetAtTime(targetVol, synthRef.current.ctx.currentTime, 0.4);
    }
  };

  const renderWebGL = () => {
    const gl = glRef.current;
    if (!gl) return;

    const sState = stateRef.current;
    const { quad, lines } = shadersRef.current;
    const arrays = particlesArraysRef.current;

    if (!arrays.linePositions || !arrays.lineColors || !sState.read || !sState.write) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, lines.positionBuffer || null);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, arrays.linePositions);

    gl.bindBuffer(gl.ARRAY_BUFFER, lines.colorBuffer || null);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, arrays.lineColors);

    gl.bindFramebuffer(gl.FRAMEBUFFER, sState.write.fbo);
    gl.viewport(0, 0, sState.pw, sState.ph);
    gl.disable(gl.BLEND);

    gl.useProgram(shadersRef.current.quadProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer || null);
    if (quad.aPos !== undefined && quad.aPos !== -1) {
      gl.enableVertexAttribArray(quad.aPos);
      gl.vertexAttribPointer(quad.aPos, 2, gl.FLOAT, false, 0, 0);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sState.read.tex);
    if (quad.uTex) gl.uniform1i(quad.uTex, 0);

    if (quad.uBg) gl.uniform3f(quad.uBg, 0.04, 0.05, 0.07);
    if (quad.uKeep) gl.uniform1f(quad.uKeep, 1.0 - sState.erase);
    if (quad.uMode) gl.uniform1f(quad.uMode, 1.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.useProgram(shadersRef.current.lineProgram);
    if (lines.uAspect) gl.uniform1f(lines.uAspect, sState.aspect);

    gl.bindBuffer(gl.ARRAY_BUFFER, lines.positionBuffer || null);
    if (lines.aPos !== undefined && lines.aPos !== -1) {
      gl.enableVertexAttribArray(lines.aPos);
      gl.vertexAttribPointer(lines.aPos, 2, gl.FLOAT, false, 0, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, lines.colorBuffer || null);
    if (lines.aColor !== undefined && lines.aColor !== -1) {
      gl.enableVertexAttribArray(lines.aColor);
      gl.vertexAttribPointer(lines.aColor, 4, gl.FLOAT, false, 0, 0);
    }

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.LINES, 0, sState.particlesCount * 2);
    gl.disable(gl.BLEND);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, sState.pw, sState.ph);

    gl.useProgram(shadersRef.current.quadProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad.buffer || null);
    if (quad.aPos !== undefined && quad.aPos !== -1) {
      gl.enableVertexAttribArray(quad.aPos);
      gl.vertexAttribPointer(quad.aPos, 2, gl.FLOAT, false, 0, 0);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sState.write.tex);
    if (quad.uTex) gl.uniform1i(quad.uTex, 0);
    if (quad.uMode) gl.uniform1f(quad.uMode, 0.0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    const temp = sState.read;
    sState.read = sState.write;
    sState.write = temp;
  };

  // Instant Spawning Logic: Alternate High and Low Cells
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const sState = stateRef.current;
    const isHigh = actualPlacementType === "high";
    const spinVal = isHigh ? -1 : 1;

    const newId = `Spawn_${Date.now()}`;
    const groupCode = isHigh ? "High" : "Low";
    const countLabel = sState.systems.filter(sys => sys.spin === spinVal).length + 1;

    const newSystem: PressureSystem = {
      id: newId,
      x: x * sState.aspect,
      y: y,
      spin: spinVal,
      r: 0.16 + Math.random() * 0.09,
      strength: 0.7 + Math.random() * 0.4,
      name: `${groupCode} Node ${countLabel}`,
      targetX: x * sState.aspect,
      targetY: y,
      targetSpin: spinVal,
      targetR: 0.2,
      targetStrength: 0.8,
      baseR: 0.2,
      baseStrength: 0.8,
      displayX: x * sState.aspect,
      displayY: y,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      phaseStrength: Math.random() * Math.PI * 2,
      phaseRadius: Math.random() * Math.PI * 2
    };

    sState.systems.push(newSystem);
    sState.fieldRow = 0; // force field vector rebuild

    onSystemsChange?.(sState.systems.map(s => ({ id: s.id, name: s.name, spin: s.spin })));

    // Alternating state swap
    if (nextPlacementType === undefined) {
      setInternalPlacementType(prev => (prev === "high" ? "low" : "high"));
    }
    onPlacementTypeChange?.(actualPlacementType === "high" ? "low" : "high");
  };

  const deleteSystem = (id: string) => {
    const sState = stateRef.current;
    sState.systems = sState.systems.filter((s) => s.id !== id);
    sState.fieldRow = 0;
    onSystemsChange?.(sState.systems.map(s => ({ id: s.id, name: s.name, spin: s.spin })));
  };

  const clearAllSystems = () => {
    const sState = stateRef.current;
    sState.systems = [];
    sState.fieldRow = 0;
    onSystemsChange?.([]);
  };

  return (
    <div className={className}>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* CANVAS BACKGROUND CONTAINER */}
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          onPointerDown={handlePointerDown}
        />

        {/* Dynamic Coordinate Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none animated-grid opacity-20 mix-blend-screen bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
        )}
      </div>

      {/* FOREGROUND CONTENT WRAPPER */}
      {children && (
        <div className="relative z-10 w-full h-full pointer-events-none select-none">
          {children}
        </div>
      )}
    </div>
  );
});

AtmosphericDrift.displayName = "AtmosphericDrift";

export default AtmosphericDrift;
