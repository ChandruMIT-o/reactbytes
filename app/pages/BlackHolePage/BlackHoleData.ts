export const loaderProps = [
  {
    title: "Black Hole Gravitational Physics Props",
    props: [
      {
        name: "speed",
        type: "number",
        defaultValue: "1.0",
        description: "Speed of the particle acceleration and funnel space-mesh grid rotation (0.1 to 3.0).",
      },
      {
        name: "depth",
        type: "number",
        defaultValue: "1.0",
        description: "Scale of the core spacetime depth coordinate funnel (0.4 to 2.0).",
      },
      {
        name: "gridDensity",
        type: "number",
        defaultValue: "60",
        description: "Number of slices/density of the radial space grid line curves (20 to 140).",
      },
      {
        name: "particleFlux",
        type: "number",
        defaultValue: "150",
        description: "Number of active orbiting plasma accretion particles to render (30 to 220).",
      },
      {
        name: "mouseParallax",
        type: "number",
        defaultValue: "1.2",
        description: "Scale factor for interactive viewport center point displacement on hover (0.0 to 3.0).",
      },
    ],
  },
  {
    title: "Vortex Styling & Interactive Controls",
    props: [
      {
        name: "colorPreset",
        type: "'original' | 'solar' | 'matrix' | 'quasar'",
        defaultValue: "'original'",
        description: "Spectral chromatic color scheme preset for accretion particles and gravitational lensing auras.",
      },
      {
        name: "soundEnabled",
        type: "boolean",
        defaultValue: "false",
        description: "Toggles a continuous space-hum synthesized audio hum using Web Audio API low-frequency oscillators.",
      },
      {
        name: "hyperdriveActive",
        type: "boolean",
        defaultValue: "false",
        description: "Initiates speed warp: boosts velocity metrics and applies an elongated elliptical stretch shader to orbiting stream entities.",
      },
      {
        name: "pulseKey",
        type: "number",
        defaultValue: "0",
        description: "A numeric key value. Incrementing this key triggers a full 360-degree shockwave pulse expanding outward from the singularity core.",
      },
      {
        name: "className",
        type: "string",
        defaultValue: "''",
        description: "Additional CSS classes to style the container dimensions or wrapper bounds.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        defaultValue: "null",
        description: "Foreground overlay items and interactive UI components rendered at relative z-index bounds.",
      },
    ],
  },
];

export const creditsData = [
  {
    title: "Visual Design & Math",
    items: [
      {
        name: "HTML5 Canvas 2D Matrix",
        role: "Vector Rendering",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D",
      },
      {
        name: "Lense-Thirring Effect",
        role: "Physics Inspiration",
        url: "https://en.wikipedia.org/wiki/Lense%E2%80%93Thirring_precession",
      },
    ],
  },
  {
    title: "Development Team",
    items: [
      {
        name: "React Bytes",
        role: "Attribution and Licensing",
        url: "https://reactbytes.dev",
      },
    ],
  },
];

export const componentCode = `import * as React from 'react';
import { useEffect, useRef } from 'react';

export interface BlackHoleProps {
    /** Speed of the particle acceleration and funnel rotation (0.1 to 3.0) */
    speed?: number;
    /** Scale of the core spacetime depth funnel (0.4 to 2.0) */
    depth?: number;
    /** Number of slices/density of the radial line grid (20 to 140) */
    gridDensity?: number;
    /** Number of orbiting particles to render (30 to 220) */
    particleFlux?: number;
    /** Mouse parallax/displacement intensity (0.0 to 3.0) */
    mouseParallax?: number;
    /** Color scheme style preset */
    colorPreset?: 'original' | 'solar' | 'matrix' | 'quasar';
    /** Toggle simulated gravitational audio hum */
    soundEnabled?: boolean;
    /** Enable hyperdrive particle acceleration warp stretch */
    hyperdriveActive?: boolean;
    /** Trigger a gravity shockwave pulse when this key value changes */
    pulseKey?: number;
    /** Custom wrapper className */
    className?: string;
    /** Content to overlay on top of the black hole background */
    children?: React.ReactNode;
}

interface AccretionParticle {
    angle: number;
    progress: number;
    speed: number;
    size: number;
    colorVal: number;
}

export default function BlackHole({
    speed = 1.0,
    depth = 1.0,
    gridDensity = 60,
    particleFlux = 150,
    mouseParallax = 1.2,
    colorPreset = 'original',
    soundEnabled = false,
    hyperdriveActive = false,
    pulseKey = 0,
    className = '',
    children = null
}: BlackHoleProps) {
    // --- REFS ---
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const stateRef = useRef({
        speed,
        depth,
        gridDensity,
        particleFlux,
        mouseParallax,
        colorPreset,
        pulseProgress: 0,
        warpProgress: 0,
    });

    // Keep stateRef up to date for the render loop to avoid re-binding
    useEffect(() => {
        stateRef.current.speed = speed;
        stateRef.current.depth = depth;
        stateRef.current.gridDensity = gridDensity;
        stateRef.current.particleFlux = particleFlux;
        stateRef.current.mouseParallax = mouseParallax;
        stateRef.current.colorPreset = colorPreset;
    }, [speed, depth, gridDensity, particleFlux, mouseParallax, colorPreset]);

    // Audio nodes refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const humOscRef = useRef<OscillatorNode | null>(null);
    const subOscRef = useRef<OscillatorNode | null>(null);
    const filterNodeRef = useRef<BiquadFilterNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);

    // Mouse / Touch tracking with easing refs
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    const mouseEase = useRef({ x: 0.5, y: 0.5 });

    // Animation ticks & frames
    const frameCounter = useRef(0);
    const particles = useRef<AccretionParticle[]>([]);

    // --- AUDIO SYNTHESIZER CONTROL (Web Audio API) ---
    useEffect(() => {
        if (soundEnabled) {
            if (!audioCtxRef.current) {
                try {
                    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                    const ctx = new AudioContextClass();
                    audioCtxRef.current = ctx;

                    // Create main gain
                    const mainGain = ctx.createGain();
                    mainGain.gain.setValueAtTime(0.06, ctx.currentTime);
                    mainGain.connect(ctx.destination);
                    gainNodeRef.current = mainGain;

                    // Create lowpass filter for sub hum
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(140, ctx.currentTime);
                    filter.connect(mainGain);
                    filterNodeRef.current = filter;

                    // Primary base Hum (Oscillator A)
                    const oscA = ctx.createOscillator();
                    oscA.type = 'sine';
                    oscA.frequency.setValueAtTime(55 * speed, ctx.currentTime);
                    oscA.connect(filter);
                    oscA.start();
                    humOscRef.current = oscA;

                    // Rich depth sub (Oscillator B - triangle wave for undertones)
                    const oscB = ctx.createOscillator();
                    oscB.type = 'triangle';
                    oscB.frequency.setValueAtTime(110 * speed, ctx.currentTime);
                    oscB.connect(filter);
                    oscB.start();
                    subOscRef.current = oscB;

                    // LFO (Low-Frequency Oscillator) to create breathing distortion
                    const lfo = ctx.createOscillator();
                    lfo.frequency.setValueAtTime(1.2, ctx.currentTime);
                    const lfoGain = ctx.createGain();
                    lfoGain.gain.setValueAtTime(35, ctx.currentTime);
                    lfo.connect(lfoGain);
                    lfoGain.connect(filter.frequency);
                    lfo.start();
                } catch (e) {
                    console.error("Audio initialization failed:", e);
                }
            } else if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
        } else {
            if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
                audioCtxRef.current.suspend();
            }
        }
    }, [soundEnabled]);

    // Adjust sound parameters when user changes the Speed
    useEffect(() => {
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            const baseFreq = 55 * speed;
            const subFreq = 110 * speed;
            const filterFreq = 140 + (speed * 40);

            // Smooth transition to prevent crackles
            humOscRef.current?.frequency.exponentialRampToValueAtTime(baseFreq, audioCtxRef.current.currentTime + 0.3);
            subOscRef.current?.frequency.exponentialRampToValueAtTime(subFreq, audioCtxRef.current.currentTime + 0.3);
            filterNodeRef.current?.frequency.setValueAtTime(filterFreq, audioCtxRef.current.currentTime);
        }
    }, [speed]);

    // Cleanup audio nodes on unmount
    useEffect(() => {
        return () => {
            if (audioCtxRef.current) {
                audioCtxRef.current.close().catch(() => {});
            }
        };
    }, []);

    // --- PULSE TRIGGER PROP ---
    const initialPulseRef = useRef(true);
    useEffect(() => {
        if (initialPulseRef.current) {
            initialPulseRef.current = false;
            return;
        }

        stateRef.current.pulseProgress = 1.0;

        // Synthesize pulse audio effect
        if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            const filter = filterNodeRef.current;
            const gain = gainNodeRef.current;
            const currTime = audioCtxRef.current.currentTime;

            if (gain && filter) {
                // Temporary wave of volume and frequency release
                gain.gain.setValueAtTime(0.06, currTime);
                gain.gain.exponentialRampToValueAtTime(0.18, currTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.06, currTime + 1.2);

                filter.frequency.setValueAtTime(140, currTime);
                filter.frequency.exponentialRampToValueAtTime(800, currTime + 0.15);
                filter.frequency.exponentialRampToValueAtTime(140, currTime + 1.0);
            }
        }
    }, [pulseKey]);

    // --- HYPERDRIVE PROP TRIGGER ---
    const prevHyperdriveRef = useRef(hyperdriveActive);
    useEffect(() => {
        if (hyperdriveActive && !prevHyperdriveRef.current) {
            stateRef.current.warpProgress = 1.0;

            // Fast sound sweep
            if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
                const filter = filterNodeRef.current;
                const gain = gainNodeRef.current;
                const currTime = audioCtxRef.current.currentTime;

                if (gain && filter) {
                    gain.gain.setValueAtTime(0.06, currTime);
                    gain.gain.exponentialRampToValueAtTime(0.25, currTime + 0.3);
                    gain.gain.exponentialRampToValueAtTime(0.06, currTime + 2.5);

                    filter.frequency.exponentialRampToValueAtTime(2200, currTime + 0.8);
                    filter.frequency.exponentialRampToValueAtTime(140, currTime + 2.4);
                }
            }
        }
        prevHyperdriveRef.current = hyperdriveActive;
    }, [hyperdriveActive]);

    // --- RENDERING CORE ENGINE (CANVAS) ---
    const initializeParticles = () => {
        const total = 220;
        const tempParticles: AccretionParticle[] = [];
        for (let i = 0; i < total; i++) {
            tempParticles.push({
                angle: Math.random() * Math.PI * 2,
                progress: Math.random(), // 0 outer rim, 1 event horizon center
                speed: 0.001 + Math.random() * 0.004,
                size: 0.5 + Math.random() * 3.5,
                colorVal: Math.random(), // gradient selection helper
            });
        }
        particles.current = tempParticles;
    };

    // Math: Easing functions built in to prevent external dependencies
    const easeInExpo = (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));

    const tweenValue = (start: number, end: number, p: number, ease = false) => {
        const delta = end - start;
        const factor = ease ? easeInExpo(p) : p;
        return start + delta * factor;
    };

    // Setup main canvas rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationId: number;
        let dpr = window.devicePixelRatio || 1;

        const handleResize = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            initializeParticles();
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        // Render loop
        const render = () => {
            const currentParams = stateRef.current;
            const rect = canvas.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            if (w === 0 || h === 0) {
                animationId = requestAnimationFrame(render);
                return;
            }

            // Handle custom warping state increments
            let warpSpeedMod = 1.0;
            if (currentParams.warpProgress > 0) {
                warpSpeedMod = 1.0 + Math.sin(currentParams.warpProgress * Math.PI) * 11.0;
                currentParams.warpProgress -= 0.01; // count down
                if (currentParams.warpProgress < 0) currentParams.warpProgress = 0;
            }

            // Gravity Pulse modifier
            let pulseMod = 1.0;
            if (currentParams.pulseProgress > 0) {
                pulseMod = 1.0 + Math.sin(currentParams.pulseProgress * Math.PI) * 0.25;
                currentParams.pulseProgress -= 0.015;
                if (currentParams.pulseProgress < 0) currentParams.pulseProgress = 0;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(dpr, dpr);

            // Interpolate mouse with smoothing filter
            mouseEase.current.x += (mousePos.current.x - mouseEase.current.x) * 0.05;
            mouseEase.current.y += (mousePos.current.y - mouseEase.current.y) * 0.05;

            const parallaxStrengthX = (mouseEase.current.x - 0.5) * 80 * currentParams.mouseParallax;
            const parallaxStrengthY = (mouseEase.current.y - 0.5) * 80 * currentParams.mouseParallax;

            // Set funnel dimensions
            const startDisc = {
                x: w * 0.5 + parallaxStrengthX,
                y: h * 0.45 + parallaxStrengthY,
                w: w * 0.75 * currentParams.depth * pulseMod,
                h: h * 0.7 * currentParams.depth * pulseMod
            };

            const endDisc = {
                x: w * 0.5 + parallaxStrengthX * 0.2,
                y: h * 0.95,
                w: 0,
                h: 0
            };

            // Define Event Horizon (Singularity Sphere) position
            const singularityX = endDisc.x;
            const singularityY = h * 0.92;
            const singularityW = w * 0.12 * currentParams.depth * pulseMod;
            const singularityH = h * 0.07 * currentParams.depth * pulseMod;

            // DRAW CONNECTING GRID LINES
            const numLines = currentParams.gridDensity;
            const slices = 15; // smoothness of the line trace curves

            ctx.save();
            // Set thematic line stroke colors based on preset
            let gridStroke = "rgba(169, 0, 255, 0.22)";
            let outerRingStroke = "rgba(0, 248, 241, 0.4)";
            if (currentParams.colorPreset === 'solar') {
                gridStroke = "rgba(220, 110, 0, 0.18)";
                outerRingStroke = "rgba(255, 140, 0, 0.45)";
            } else if (currentParams.colorPreset === 'matrix') {
                gridStroke = "rgba(0, 255, 100, 0.18)";
                outerRingStroke = "rgba(0, 255, 120, 0.45)";
            } else if (currentParams.colorPreset === 'quasar') {
                gridStroke = "rgba(0, 180, 255, 0.18)";
                outerRingStroke = "rgba(0, 210, 255, 0.45)";
            }

            ctx.strokeStyle = gridStroke;
            ctx.lineWidth = currentParams.warpProgress > 0 ? 1.0 : 1.5;

            const angleStep = (Math.PI * 2) / numLines;
            for (let l = 0; l < numLines; l++) {
                const theta = l * angleStep;
                ctx.beginPath();

                for (let s = 0; s <= slices; s++) {
                    const p = s / slices;
                    const discX = tweenValue(startDisc.x, endDisc.x, p);
                    const discY = tweenValue(startDisc.y, endDisc.y, p, true);
                    const discW = tweenValue(startDisc.w, endDisc.w, p);
                    const discH = tweenValue(startDisc.h, endDisc.h, p);

                    const px = discX + Math.cos(theta) * discW;
                    const py = discY + Math.sin(theta) * discH;

                    if (s === 0) {
                        ctx.moveTo(px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                ctx.stroke();
            }
            ctx.restore();

            // DRAW SLICED GRID CONVERSIONS (DISCS)
            const totalDiscs = 16;
            frameCounter.current += 0.001 * currentParams.speed * warpSpeedMod;
            const baseOffset = frameCounter.current % (1 / totalDiscs);

            ctx.save();
            ctx.strokeStyle = gridStroke;
            ctx.lineWidth = 1.5;

            for (let i = 0; i < totalDiscs; i++) {
                const p = (i / totalDiscs + baseOffset) % 1;

                const discX = tweenValue(startDisc.x, endDisc.x, p);
                const discY = tweenValue(startDisc.y, endDisc.y, p, true);
                const discW = tweenValue(startDisc.w, endDisc.w, p);
                const discH = tweenValue(startDisc.h, endDisc.h, p);

                // Calculate opacity based on progression
                const discOpacity = (1 - p) * 0.7;
                ctx.strokeStyle = gridStroke.replace(/[\\d.]+\\)$/g, \`\${discOpacity})\`);

                ctx.beginPath();
                ctx.ellipse(discX, discY, discW, discH, 0, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();

            // DRAW RIM OVERLAY (Outer bounding circle grid)
            ctx.save();
            ctx.strokeStyle = outerRingStroke;
            ctx.lineWidth = 3.0;
            ctx.beginPath();
            ctx.ellipse(startDisc.x, startDisc.y, startDisc.w, startDisc.h, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // DRAW RELATIVISTIC ORBITING PARTICLES
            ctx.save();
            const fluxLimit = currentParams.particleFlux;

            particles.current.slice(0, fluxLimit).forEach((pt) => {
                // Advance progress
                pt.progress += pt.speed * currentParams.speed * warpSpeedMod;

                // Simulating accretion orbital speed physics
                const rotationSpeedMod = 0.004 + (pt.progress * 0.09) * currentParams.speed * warpSpeedMod;
                pt.angle += rotationSpeedMod;

                if (pt.progress >= 0.98) {
                    pt.progress = 0;
                    pt.angle = Math.random() * Math.PI * 2;
                    pt.speed = 0.001 + Math.random() * 0.004;
                }

                // Interpolated position
                const discX = tweenValue(startDisc.x, endDisc.x, pt.progress);
                const discY = tweenValue(startDisc.y, endDisc.y, pt.progress, true);
                const discW = tweenValue(startDisc.w, endDisc.w, pt.progress);
                const discH = tweenValue(startDisc.h, endDisc.h, pt.progress);

                const px = discX + Math.cos(pt.angle) * discW;
                const py = discY + Math.sin(pt.angle) * discH;

                // Visual color presets
                let pColor = "rgba(0, 248, 241, ";
                if (currentParams.colorPreset === 'solar') {
                    pColor = pt.colorVal > 0.5 ? "rgba(255, 190, 40, " : "rgba(255, 80, 0, ";
                } else if (currentParams.colorPreset === 'matrix') {
                    pColor = pt.colorVal > 0.5 ? "rgba(0, 255, 140, " : "rgba(100, 255, 200, ";
                } else if (currentParams.colorPreset === 'quasar') {
                    pColor = pt.colorVal > 0.5 ? "rgba(10, 150, 255, " : "rgba(180, 240, 255, ";
                } else if (currentParams.colorPreset === 'original') {
                    pColor = pt.colorVal > 0.5 ? "rgba(0, 248, 241, " : "rgba(254, 132, 143, ";
                }

                const alpha = (1 - pt.progress) * 0.85;
                ctx.fillStyle = \`\${pColor}\${alpha})\`;

                ctx.beginPath();
                if (currentParams.warpProgress > 0) {
                    ctx.ellipse(px, py, pt.size * (1 + warpSpeedMod * 0.6), pt.size * 0.4, pt.angle, 0, Math.PI * 2);
                } else {
                    ctx.arc(px, py, pt.size, 0, Math.PI * 2);
                }
                ctx.fill();
            });
            ctx.restore();

            // DRAW MAIN SINGULARITY DISK & SHADOW RECT (Event Horizon Masking)
            ctx.save();
            const gradientVoid = ctx.createRadialGradient(
                singularityX, singularityY, 0,
                singularityX, singularityY, singularityW * 1.5
            );
            gradientVoid.addColorStop(0, 'rgba(0, 0, 0, 1.0)');
            gradientVoid.addColorStop(0.3, 'rgba(5, 5, 10, 0.98)');
            gradientVoid.addColorStop(0.65, 'rgba(10, 5, 20, 0.85)');
            gradientVoid.addColorStop(1.0, 'rgba(20, 20, 20, 0)');

            ctx.fillStyle = gradientVoid;
            ctx.beginPath();
            ctx.ellipse(singularityX, singularityY, singularityW * 2.2, singularityH * 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Draw the deep core pitch-black sphere
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.shadowColor = 'rgba(0,0,0,1)';
            ctx.shadowBlur = 40;
            ctx.beginPath();
            ctx.ellipse(singularityX, singularityY, singularityW * 0.7, singularityH * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // DRAW STRUCTURAL GRAVITY PULSE WAVE SHOCKWAVE (Ripple outward)
            if (currentParams.pulseProgress > 0) {
                ctx.save();
                const pulseRatio = 1 - currentParams.pulseProgress; // 0 to 1
                const maxPulseRadiusW = w * 1.6;
                const maxPulseRadiusH = h * 1.3;

                const rw = pulseRatio * maxPulseRadiusW;
                const rh = pulseRatio * maxPulseRadiusH;

                let rippleStroke = 'rgba(0, 248, 241, ';
                if (currentParams.colorPreset === 'solar') rippleStroke = 'rgba(255, 110, 0, ';
                if (currentParams.colorPreset === 'matrix') rippleStroke = 'rgba(0, 255, 100, ';
                if (currentParams.colorPreset === 'quasar') rippleStroke = 'rgba(0, 180, 255, ';

                ctx.strokeStyle = \`\${rippleStroke}\${currentParams.pulseProgress})\`;
                ctx.lineWidth = 6 * currentParams.pulseProgress;
                ctx.beginPath();
                ctx.ellipse(singularityX, singularityY, rw, rh, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.restore();
            }

            ctx.restore();
            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    // Handle pointer tracking
    const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mousePos.current = { x, y };
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (e.touches && e.touches[0]) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.touches[0].clientX - rect.left) / rect.width;
            const y = (e.touches[0].clientY - rect.top) / rect.height;
            mousePos.current = { x, y };
        }
    };

    const resetPointer = () => {
        mousePos.current = { x: 0.5, y: 0.5 };
    };

    return (
        <div
            className={\`relative overflow-hidden bg-[#07070b] font-mono text-xs select-none \${className}\`}
            onMouseMove={handlePointerMove}
            onMouseLeave={resetPointer}
            onTouchMove={handleTouchMove}
            onTouchEnd={resetPointer}
        >
            {/* GLOBAL EMBEDDED STYLES FOR ANIMATION & SCROLLBAR */}
            <style dangerouslySetInnerHTML={{
                __html: \\\`
        @keyframes aura-glow {
          0% { background-position: 0% 100%; }
          100% { background-position: 0% 300%; }
        }
        .aura-glow-anim {
          background: linear-gradient(
            20deg,
            #00f8f1,
            #ffbd1e20 16.5%,
            #fe848f 33%,
            #fe848f20 49.5%,
            #00f8f1 66%,
            #00f8f160 85.5%,
            #ffbd1e 100%
          ) 0 100% / 100% 200%;
          animation: aura-glow 8s infinite linear;
        }
        .aura-solar-anim {
          background: linear-gradient(
            20deg,
            #ff4500,
            #ff8c0020 16.5%,
            #ffd700 33%,
            #ffd70020 49.5%,
            #ff4500 66%,
            #ff450060 85.5%,
            #ffd700 100%
          ) 0 100% / 100% 200%;
          animation: aura-glow 8s infinite linear;
        }
        .aura-matrix-anim {
          background: linear-gradient(
            20deg,
            #00ff66,
            #00ff6620 16.5%,
            #00ffcc 33%,
            #00ffcc20 49.5%,
            #00ff66 66%,
            #00ff6660 85.5%,
            #00ff33 100%
          ) 0 100% / 100% 200%;
          animation: aura-glow 8s infinite linear;
        }
        .aura-quasar-anim {
          background: linear-gradient(
            20deg,
            #00d2ff,
            #00d2ff20 16.5%,
            #0033ff 33%,
            #0033ff20 49.5%,
            #00d2ff 66%,
            #00d2ff60 85.5%,
            #3a00ff 100%
          ) 0 100% / 100% 200%;
          animation: aura-glow 8s infinite linear;
        }
        .cyber-scanlines {
          background: repeating-linear-gradient(
            transparent,
            transparent 1px,
            rgba(255, 255, 255, 0.03) 1px,
            rgba(255, 255, 255, 0.03) 2px
          );
        }
      \\\` }} />

            {/* --- BACKGROUND ENGINE ELEMENTS --- */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Render main black hole grid on canvas */}
                <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

                {/* Glowing aura strip (matches preset color scheme) */}
                <div className={\`absolute top-[-70%] left-1/2 z-[2] w-[40%] h-[155%] rounded-b-full filter blur-[70px] mix-blend-plus-lighter opacity-55 -translate-x-1/2 pointer-events-none 
                  \${colorPreset === 'original' ? 'aura-glow-anim' : ''}
                  \${colorPreset === 'solar' ? 'aura-solar-anim' : ''}
                  \${colorPreset === 'matrix' ? 'aura-matrix-anim' : ''}
                  \${colorPreset === 'quasar' ? 'aura-quasar-anim' : ''}
                \`} />

                {/* Ambient Dark Spherical Voids */}
                <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1] w-[130%] h-[120%] bg-[radial-gradient(ellipse_at_50%_55%,transparent_10%,#050508_45%)] pointer-events-none" />

                {/* Extra atmospheric glow filter */}
                <div className={\`absolute inset-0 z-[3] mix-blend-overlay pointer-events-none transition-all duration-1000
                  \${colorPreset === 'original' ? 'bg-[radial-gradient(ellipse_at_50%_75%,#a900ff_15%,transparent_65%)]' : ''}
                  \${colorPreset === 'solar' ? 'bg-[radial-gradient(ellipse_at_50%_75%,#ff4500_15%,transparent_65%)]' : ''}
                  \${colorPreset === 'matrix' ? 'bg-[radial-gradient(ellipse_at_50%_75%,#00ff33_10%,transparent_65%)]' : ''}
                  \${colorPreset === 'quasar' ? 'bg-[radial-gradient(ellipse_at_50%_75%,#0033ff_15%,transparent_65%)]' : ''}
                \`} />

                {/* Cyber scanlines pattern filter */}
                <div className="absolute inset-0 z-10 pointer-events-none cyber-scanlines opacity-40" />
            </div>

            {/* --- FOREGROUND CONTENT (CHILDREN) --- */}
            <div className="relative z-20 w-full h-full">
                {children}
            </div>
        </div>
    );
}
`;
