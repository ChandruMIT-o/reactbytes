import * as React from 'react';
import { useEffect, useRef, useCallback } from 'react';

export interface BlackHoleProps {
    /** Toggle simulated gravitational audio hum */
    soundEnabled?: boolean;
    /** Speed of the concentric disc progression (multiplier) */
    speed?: number;
    /** Total number of radiation particles */
    particleCount?: number;
    /** Canvas background color */
    bgColor?: string;
    /** Stroke color of concentric grid lines */
    lineColor?: string;
    /** Fill color of simulated radiation particles */
    particleColor?: string;
    /** Accent gradient overlay color (singularity core) */
    glowColor?: string;
    /** Distortion field neon aura color */
    auraColor?: string;
    /** Custom wrapper className */
    className?: string;
    /** Content to overlay on top of the black hole background */
    children?: React.ReactNode;
}

interface Disc {
    p: number;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
}

interface Particle {
    x: number;
    sx: number;
    dx: number;
    y: number;
    vy: number;
    p: number;
    r: number;
    alpha: number;
}

const hexToRgb = (hex: string): string => {
    const cleanHex = hex.replace(/^#/, '');
    let r = 255, g = 255, b = 255;
    if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `${r}, ${g}, ${b}`;
};

const easeInExpo = (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10));

const tweenValue = (start: number, end: number, p: number, ease = false) => {
    const delta = end - start;
    return start + delta * (ease ? easeInExpo(p) : p);
};

const tweenDisc = (
    disc: Disc,
    startDisc: { x: number; y: number; w: number; h: number },
    endDisc: { x: number; y: number; w: number; h: number }
) => {
    disc.x = tweenValue(startDisc.x, endDisc.x, disc.p);
    disc.y = tweenValue(startDisc.y, endDisc.y, disc.p, true);
    disc.w = tweenValue(startDisc.w, endDisc.w, disc.p);
    disc.h = tweenValue(startDisc.h, endDisc.h, disc.p);
    return disc;
};

const initParticle = (rectHeight: number, particleArea: any, start = false): Particle => {
    const sx = particleArea.sx + particleArea.sw * Math.random();
    const ex = particleArea.ex + particleArea.ew * Math.random();
    const dx = ex - sx;
    const y = start ? particleArea.h * Math.random() : particleArea.h;
    const r = 0.5 + Math.random() * 4;
    const vy = 0.5 + Math.random();

    return {
        x: sx,
        sx,
        dx,
        y,
        vy,
        p: 0,
        r,
        alpha: Math.random()
    };
};

export default function BlackHole({
    soundEnabled = false,
    speed = 1.0,
    particleCount = 100,
    bgColor = '#141414',
    lineColor = '#444444',
    particleColor = '#ffffff',
    glowColor = '#a900ff',
    auraColor = '#00f8f1',
    className = '',
    children = null
}: BlackHoleProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Geometry Storage Refs
    const startDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
    const endDiscRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
    const clipRef = useRef<{ path?: Path2D; disc?: Disc; i?: number }>({});
    const discsRef = useRef<Disc[]>([]);
    const particlesRef = useRef<Particle[]>([]);
    const linesCanvasRef = useRef<OffscreenCanvas | null>(null);

    // Animation Lifecycle / Control Refs
    const frameIdRef = useRef<number | null>(null);
    const speedRef = useRef(speed);
    useEffect(() => { speedRef.current = speed; }, [speed]);

    const particleColorRef = useRef(particleColor);
    useEffect(() => { particleColorRef.current = particleColor; }, [particleColor]);

    const lineColorRef = useRef(lineColor);
    useEffect(() => { lineColorRef.current = lineColor; }, [lineColor]);

    const particleCountRef = useRef(particleCount);

    // Audio context nodes refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const humOscRef = useRef<OscillatorNode | null>(null);
    const subOscRef = useRef<OscillatorNode | null>(null);
    const filterNodeRef = useRef<BiquadFilterNode | null>(null);

    const setupEnginePools = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const { width, height } = rect;
        if (width === 0 || height === 0) return;

        // 1. Set Discs Base Setup
        startDiscRef.current = { x: width * 0.5, y: height * 0.45, w: width * 0.75, h: height * 0.7 };
        endDiscRef.current = { x: width * 0.5, y: height * 0.95, w: 0, h: 0 };

        discsRef.current = [];
        const totalDiscs = 100;
        let prevBottom = height;

        for (let i = 0; i < totalDiscs; i++) {
            const p = i / totalDiscs;
            const disc = tweenDisc({ p }, startDiscRef.current, endDiscRef.current);
            const bottom = (disc.y ?? 0) + (disc.h ?? 0);

            if (bottom <= prevBottom) {
                clipRef.current = { disc: { ...disc }, i };
            }
            prevBottom = bottom;
            discsRef.current.push(disc);
        }

        // Construct Path2D Ellipse Mask Base
        const clipDisc = clipRef.current.disc!;
        const path = new Path2D();
        path.ellipse(clipDisc.x!, clipDisc.y!, clipDisc.w!, clipDisc.h!, 0, 0, Math.PI * 2);
        path.rect(clipDisc.x! - clipDisc.w!, 0, clipDisc.w! * 2, clipDisc.y!);
        clipRef.current.path = path;

        // 2. Compute Static Background Lines on Cache Canvas
        const lines: { x: number; y: number }[][] = [];
        const totalLines = 100;
        const linesAngle = (Math.PI * 2) / totalLines;

        for (let i = 0; i < totalLines; i++) lines.push([]);

        discsRef.current.forEach((disc) => {
            for (let i = 0; i < totalLines; i++) {
                const angle = i * linesAngle;
                lines[i].push({
                    x: disc.x! + Math.cos(angle) * disc.w!,
                    y: disc.y! + Math.sin(angle) * disc.h!
                });
            }
        });

        linesCanvasRef.current = new OffscreenCanvas(width, height);
        const lCtx = linesCanvasRef.current.getContext("2d");
        if (lCtx) {
            lines.forEach((line) => {
                lCtx.save();
                let lineIsIn = false;
                line.forEach((p1, j) => {
                    if (j === 0) return;
                    const p0 = line[j - 1];

                    if (!lineIsIn && (lCtx.isPointInPath(clipRef.current.path!, p1.x, p1.y) || lCtx.isPointInStroke(clipRef.current.path!, p1.x, p1.y))) {
                        lineIsIn = true;
                    } else if (lineIsIn) {
                        lCtx.clip(clipRef.current.path!);
                    }

                    lCtx.beginPath();
                    lCtx.moveTo(p0.x, p0.y);
                    lCtx.lineTo(p1.x, p1.y);
                    lCtx.strokeStyle = lineColor;
                    lCtx.lineWidth = 2;
                    lCtx.stroke();
                    lCtx.closePath();
                });
                lCtx.restore();
            });
        }

        // 3. Populate Radiation Particles Pool
        const particleArea = {
            sw: clipDisc.w! * 0.5,
            ew: clipDisc.w! * 2,
            h: height * 0.85,
            sx: (width - clipDisc.w! * 0.5) / 2,
            ex: (width - clipDisc.w! * 2) / 2
        };

        particlesRef.current = [];
        const totalParticles = particleCountRef.current;
        for (let i = 0; i < totalParticles; i++) {
            particlesRef.current.push(initParticle(height, particleArea, true));
        }
    }, [lineColor]);

    // Rebuild lines/setup on lineColor changes
    useEffect(() => {
        setupEnginePools();
    }, [setupEnginePools]);

    // Handle dynamic particle count adjustment
    useEffect(() => {
        particleCountRef.current = particleCount;
        const currentCount = particlesRef.current.length;
        if (particleCount > currentCount) {
            const canvas = canvasRef.current;
            if (canvas) {
                const rect = canvas.getBoundingClientRect();
                const clipDisc = clipRef.current.disc;
                if (clipDisc) {
                    const particleArea = {
                        sw: clipDisc.w! * 0.5,
                        ew: clipDisc.w! * 2,
                        h: rect.height * 0.85,
                        sx: (rect.width - clipDisc.w! * 0.5) / 2,
                        ex: (rect.width - clipDisc.w! * 2) / 2
                    };
                    for (let i = currentCount; i < particleCount; i++) {
                        particlesRef.current.push(initParticle(rect.height, particleArea, true));
                    }
                }
            }
        } else if (particleCount < currentCount) {
            particlesRef.current = particlesRef.current.slice(0, particleCount);
        }
    }, [particleCount]);

    const setupEnginePoolsRef = useRef(setupEnginePools);
    useEffect(() => {
        setupEnginePoolsRef.current = setupEnginePools;
    }, [setupEnginePools]);

    // --- WEB AUDIO API CONTROL ---
    useEffect(() => {
        if (soundEnabled) {
            if (!audioCtxRef.current) {
                try {
                    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                    const ctx = new AudioContextClass();
                    audioCtxRef.current = ctx;

                    const mainGain = ctx.createGain();
                    mainGain.gain.setValueAtTime(0.05, ctx.currentTime);
                    mainGain.connect(ctx.destination);

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(140, ctx.currentTime);
                    filter.connect(mainGain);
                    filterNodeRef.current = filter;

                    const oscA = ctx.createOscillator();
                    oscA.type = 'sine';
                    oscA.frequency.setValueAtTime(55, ctx.currentTime);
                    oscA.connect(filter);
                    oscA.start();
                    humOscRef.current = oscA;

                    const oscB = ctx.createOscillator();
                    oscB.type = 'triangle';
                    oscB.frequency.setValueAtTime(110, ctx.currentTime);
                    oscB.connect(filter);
                    oscB.start();
                    subOscRef.current = oscB;
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

    // --- RUNTIME RENDER ENGINE LOOP ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            setupEnginePoolsRef.current();
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        const tick = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.scale(dpr, dpr);

            // 1. Step Calculations
            discsRef.current.forEach((disc) => {
                disc.p = (disc.p + 0.001 * speedRef.current) % 1;
                tweenDisc(disc, startDiscRef.current, endDiscRef.current);
            });

            const clipDisc = clipRef.current.disc;
            if (!clipDisc) {
                ctx.restore();
                frameIdRef.current = requestAnimationFrame(tick);
                return;
            }

            const particleArea = {
                sw: clipDisc.w! * 0.5,
                ew: clipDisc.w! * 2,
                h: rect.height * 0.85,
                sx: (rect.width - clipDisc.w! * 0.5) / 2,
                ex: (rect.width - clipDisc.w! * 2) / 2
            };

            particlesRef.current.forEach((particle) => {
                particle.p = 1 - particle.y / particleArea.h;
                particle.x = particle.sx + particle.dx * particle.p;
                particle.y -= particle.vy * speedRef.current;

                if (particle.y < 0) {
                    const fresh = initParticle(rect.height, particleArea, false);
                    particle.y = fresh.y;
                    particle.alpha = fresh.alpha;
                }
            });

            // 2. Draw Discs (Concentric Paths)
            ctx.strokeStyle = lineColorRef.current;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(startDiscRef.current.x, startDiscRef.current.y, startDiscRef.current.w, startDiscRef.current.h, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();

            discsRef.current.forEach((disc, i) => {
                if (i % 5 !== 0) return;

                const hasClip = disc.w! < clipRef.current.disc!.w! - 5;
                if (hasClip) {
                    ctx.save();
                    ctx.clip(clipRef.current.path!);
                }

                ctx.beginPath();
                ctx.ellipse(disc.x!, disc.y!, disc.w!, disc.h!, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.closePath();

                if (hasClip) ctx.restore();
            });

            // 3. Draw Lines (Static Illusion Cache Layer)
            if (linesCanvasRef.current) {
                ctx.drawImage(linesCanvasRef.current, 0, 0);
            }

            // 4. Draw Particles (Square Frag Pieces)
            ctx.save();
            ctx.clip(clipRef.current.path!);
            particlesRef.current.forEach((p) => {
                ctx.fillStyle = `rgba(${hexToRgb(particleColorRef.current)}, ${p.alpha})`;
                ctx.beginPath();
                ctx.rect(p.x, p.y, p.r, p.r);
                ctx.closePath();
                ctx.fill();
            });
            ctx.restore();

            ctx.restore();
            frameIdRef.current = requestAnimationFrame(tick);
        };

        frameIdRef.current = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
            if (audioCtxRef.current) audioCtxRef.current.close().catch(() => { });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`absolute inset-0 m-0 p-0 overflow-hidden select-none ${className}`}
            style={{
                backgroundColor: bgColor,
                fontFamily: "'Martian Mono', monospace"
            }}
        >
            {/* INJECTED GLOBAL RAW SCSS SPECIFICATIONS */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes aura-glow {
                    0% { background-position: 0 100%; }
                    100% { background-position: 0 300%; }
                }
                .a-hole-container::before {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    z-index: 2;
                    display: block;
                    width: 150%;
                    height: 140%;
                    background: radial-gradient(ellipse at 50% 55%, transparent 10%, black 50%);
                    transform: translate3d(-50%, -50%, 0);
                    content: "";
                    pointer-events: none;
                }
                .a-hole-container::after {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    z-index: 5;
                    display: block;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(ellipse at 50% 75%, var(--glow-color, #a900ff) 20%, transparent 75%);
                    mix-blend-mode: overlay;
                    transform: translate3d(-50%, -50%, 0);
                    content: "";
                    pointer-events: none;
                }
                .a-hole-aura {
                    position: absolute;
                    top: -71.5%;
                    left: 50%;
                    z-index: 3;
                    width: 30%;
                    height: 140%;
                    background: linear-gradient(
                        20deg,
                        var(--aura-color, #00f8f1),
                        var(--accent-color-transparent, rgba(255, 189, 30, 0.13)) 16.5%,
                        var(--glow-color, #a900ff) 33%,
                        var(--glow-color-transparent, rgba(169, 0, 255, 0.13)) 49.5%,
                        var(--aura-color, #00f8f1) 66%,
                        var(--aura-color-transparent, rgba(0, 248, 241, 0.38)) 85.5%,
                        var(--accent-color, #ffbd1e) 100%
                    ) 0 100% / 100% 200%;
                    border-radius: 0 0 100% 100%;
                    filter: blur(50px);
                    mix-blend-mode: plus-lighter;
                    opacity: 0.75;
                    transform: translate3d(-50%, 0, 0);
                    animation: aura-glow 5s infinite linear;
                    pointer-events: none;
                }
                .a-hole-overlay {
                    position: absolute;
                    inset: 0;
                    z-index: 10;
                    background: repeating-linear-gradient(transparent, transparent 1px, white 1px, white 2px);
                    mix-blend-mode: overlay;
                    opacity: 0.5;
                    pointer-events: none;
                }
                .a-hole-canvas {
                    display: block;
                    width: 100%;
                    height: 100%;
                    position: relative;
                    z-index: 1;
                }
                `
            }} />

            {/* STRUCTURAL COMPOSTING BOUNDARIES */}
            <div
                className="a-hole-container absolute inset-0 w-full h-full overflow-hidden"
                style={{
                    '--glow-color': glowColor,
                    '--glow-color-transparent': `rgba(${hexToRgb(glowColor)}, 0.13)`,
                    '--aura-color': auraColor,
                    '--aura-color-transparent': `rgba(${hexToRgb(auraColor)}, 0.38)`
                } as React.CSSProperties}
            >
                <canvas ref={canvasRef} className="a-hole-canvas" />
                <div className="a-hole-aura" />
                <div className="a-hole-overlay" />
            </div>

            {/* FOREGROUND LAYOUT CONTEXT */}
            <div className="relative z-[20] w-full h-full pointer-events-auto">
                {children}
            </div>
        </div>
    );
}