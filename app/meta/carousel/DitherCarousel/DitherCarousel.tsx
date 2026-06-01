import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';

export interface DitherCarouselItem {
    id: number;
    title: string;
    subtitle?: string;
    photographer?: string;
    desc?: string;
    url: string;
}

export interface DitherCarouselProps {
    items?: DitherCarouselItem[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
    ditherResolution?: "retro" | "medium" | "high";
    colorMode?: "color" | "mono" | "cyberpunk" | "gameboy" | "amber" | "champagne" | "nordic" | "rose" | "emerald";
    transitionDuration?: number; // in ms
    height?: string | number;
    className?: string;
    onActiveIndexChange?: (index: number) => void;
}

const DEFAULT_ITEMS: DitherCarouselItem[] = [
    {
        id: 1,
        title: "Organic Monoliths",
        subtitle: "STUDIO STUDY 01",
        photographer: "Sven M. Brand",
        desc: "A brutalist exploration of concrete structures meeting soft light diffusion, capturing the intersection of human geometry and organic atmosphere.",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=90"
    },
    {
        id: 2,
        title: "Ephemeral Waves",
        subtitle: "FLUID DYNAMICS",
        photographer: "Elena Kovalyuk",
        desc: "A mesmerizing macro capture of paint dispersion under polarized lighting, freeze-framing a liquid landscape of vibrant, shifting topography.",
        url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1400&q=90"
    },
    {
        id: 3,
        title: "Chamber of Silence",
        subtitle: "MINIMAL ARCHITECTURE",
        photographer: "Kento Yoshisato",
        desc: "Sweeping concrete corridors inside the subterranean storm reservoirs of Tokyo, where structural scale invokes a deep sense of stillness and scale.",
        url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=90"
    },
    {
        id: 4,
        title: "Nocturnal Arteries",
        subtitle: "URBAN EXPOSURE",
        photographer: "Marcus Spiske",
        desc: "Long exposure night capture of highway interchanges in Munich, tracing light pathways that emulate biological networks pulsing with information.",
        url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1400&q=90"
    },
    {
        id: 5,
        title: "Architectural Veil",
        subtitle: "FACADE REFLECTION",
        photographer: "Zhuo Cheng",
        desc: "Gleaming glass panels mirroring the sunset across a financial district skyscrapers, presenting an abstract grid of liquid bronze and cold iron.",
        url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=90"
    }
];

// Bayer 4x4 Ordered Dither matrix
const BAYER_MATRIX_4X4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
];

// Precalculated flat threshold array
const BAYER_THRESHOLDS = new Float32Array(16);
for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
        BAYER_THRESHOLDS[r * 4 + c] = ((BAYER_MATRIX_4X4[r][c] + 0.5) / 16) * 255;
    }
}

interface Palette {
    name: string;
    dark: [number, number, number];
    light: [number, number, number];
    accentClass: string;
    glowColor: string;
}

const PALETTES: Record<string, Palette> = {
    champagne: {
        name: "Noir & Champagne Gold",
        dark: [8, 8, 10],
        light: [222, 184, 135],
        accentClass: "bg-amber-100 text-amber-950",
        glowColor: "rgba(222, 184, 135, 0.85)"
    },
    nordic: {
        name: "Nordic Mist",
        dark: [10, 14, 18],
        light: [178, 201, 212],
        accentClass: "bg-sky-100 text-sky-950",
        glowColor: "rgba(178, 201, 212, 0.85)"
    },
    rose: {
        name: "Rose Quartz",
        dark: [18, 10, 13],
        light: [224, 169, 175],
        accentClass: "bg-rose-100 text-rose-950",
        glowColor: "rgba(224, 169, 175, 0.85)"
    },
    emerald: {
        name: "Midnight Emerald",
        dark: [4, 14, 10],
        light: [143, 188, 143],
        accentClass: "bg-emerald-100 text-emerald-950",
        glowColor: "rgba(143, 188, 143, 0.85)"
    },
    cyberpunk: {
        name: "Cyberpunk Emerald",
        dark: [5, 5, 10],
        light: [0, 255, 128],
        accentClass: "bg-emerald-100 text-emerald-950",
        glowColor: "rgba(0, 255, 128, 0.85)"
    },
    gameboy: {
        name: "Classic Gameboy",
        dark: [15, 56, 15],
        light: [155, 188, 15],
        accentClass: "bg-lime-100 text-lime-950",
        glowColor: "rgba(155, 188, 15, 0.85)"
    },
    amber: {
        name: "Amber CRT",
        dark: [10, 5, 0],
        light: [255, 180, 0],
        accentClass: "bg-amber-100 text-amber-950",
        glowColor: "rgba(255, 180, 0, 0.85)"
    },
    mono: {
        name: "High Contrast Mono",
        dark: [0, 0, 0],
        light: [255, 255, 255],
        accentClass: "bg-zinc-100 text-zinc-950",
        glowColor: "rgba(255, 255, 255, 0.85)"
    }
};

// Custom Quintic Easing Curve for buttery progress morphs
const easeOutQuint = (x: number): number => {
    return 1 - Math.pow(1 - x, 5);
};

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    color: string;
}

interface DitherCanvasProps {
    src: string;
    isActive: boolean;
    palette: Palette;
    density: 'fine' | 'medium' | 'broad';
    transitionSpeed: number; // multiplier
    colorMode: string;
}

const DitherCanvas: React.FC<DitherCanvasProps> = ({
    src,
    isActive,
    palette,
    density,
    transitionSpeed,
    colorMode
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const particlesRef = useRef<Particle[]>([]);

    // Real interpolation progress (0.0 -> 1.0)
    const progressRef = useRef<number>(isActive ? 1.0 : 0.0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [size, setSize] = useState({ w: 0, h: 0 });

    // Persistent offscreen canvas and cached buffers for extreme performance
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const cachedSrcPixelsRef = useRef<Uint8ClampedArray | null>(null);
    const cachedLumaRef = useRef<Float32Array | null>(null);
    const cachedDstDataRef = useRef<ImageData | null>(null);
    const cachedStaticColorDitherRef = useRef<ImageData | null>(null);
    const cacheParamsRef = useRef<{
        src: string;
        dw: number;
        dh: number;
        density: string;
    } | null>(null);

    // Handle canvas dimensions with a ResizeObserver
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const w = Math.max(Math.floor(entry.contentRect.width), 150);
                const h = Math.max(Math.floor(entry.contentRect.height), 100);
                
                setSize({ w, h });
                
                const canvas = canvasRef.current;
                if (canvas) {
                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = w * dpr;
                    canvas.height = h * dpr;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.scale(dpr, dpr);
                    }
                }
            }
        });

        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, []);

    // Preload Image
    useEffect(() => {
        setImageLoaded(false);
        setLoadError(false);

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            imageRef.current = img;
            setImageLoaded(true);
        };
        img.onerror = () => {
            // Fallback load without CORS crossOrigin
            const fallbackImg = new Image();
            fallbackImg.onload = () => {
                imageRef.current = fallbackImg;
                setImageLoaded(true);
            };
            fallbackImg.onerror = () => {
                setLoadError(true);
            };
            fallbackImg.src = src;
        };
    }, [src]);

    const drawCoverFit = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number) => {
        const imgWidth = img.naturalWidth || img.width || 300;
        const imgHeight = img.naturalHeight || img.height || 200;
        const imgRatio = imgWidth / imgHeight;
        const destRatio = w / h;
        let dx = 0, dy = 0, dw = w, dh = h;

        if (imgRatio > destRatio) {
            dw = h * imgRatio;
            dx = (w - dw) / 2;
        } else {
            dh = w / imgRatio;
            dy = (h - dh) / 2;
        }
        ctx.drawImage(img, dx, dy, dw, dh);
    }, []);

    const drawDitherState = useCallback((
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        w: number,
        h: number,
        pal: Palette,
        dens: 'fine' | 'medium' | 'broad',
        mode: string
    ) => {
        const factor = { fine: 2, medium: 3.5, broad: 5.5 }[dens];
        const dw = Math.round(w / factor);
        const dh = Math.round(h / factor);

        if (dw <= 0 || dh <= 0) return;

        // Check if downscaled pixel and luma cache is stale
        const cacheParams = cacheParamsRef.current;
        const cacheStale = !cacheParams || 
            cacheParams.src !== src || 
            cacheParams.dw !== dw || 
            cacheParams.dh !== dh || 
            cacheParams.density !== dens;

        if (cacheStale) {
            if (!offscreenCanvasRef.current) {
                offscreenCanvasRef.current = document.createElement('canvas');
            }
            const offSrc = offscreenCanvasRef.current;
            offSrc.width = dw;
            offSrc.height = dh;
            const oCtx = offSrc.getContext('2d');
            if (oCtx) {
                drawCoverFit(oCtx, img, dw, dh);
                try {
                    const srcData = oCtx.getImageData(0, 0, dw, dh);
                    cachedSrcPixelsRef.current = srcData.data;
                    cachedDstDataRef.current = oCtx.createImageData(dw, dh);
                    cachedStaticColorDitherRef.current = null;
                    
                    const len = dw * dh;
                    const lumaArr = new Float32Array(len);
                    const srcPix = srcData.data;
                    for (let i = 0; i < len; i++) {
                        const idx = i * 4;
                        lumaArr[i] = (0.299 * srcPix[idx] + 0.587 * srcPix[idx + 1] + 0.114 * srcPix[idx + 2]) * 1.35 - 44.8;
                    }
                    cachedLumaRef.current = lumaArr;
                    
                    cacheParamsRef.current = {
                        src,
                        dw,
                        dh,
                        density: dens
                    };
                } catch (e) {
                    console.error("DitherCanvas caching error:", e);
                    ctx.drawImage(img, 0, 0, w, h);
                    return;
                }
            }
        }

        const offSrc = offscreenCanvasRef.current;
        if (!offSrc) {
            ctx.drawImage(img, 0, 0, w, h);
            return;
        }

        if (mode === "color") {
            // Compute static color dither once and cache it
            if (!cachedStaticColorDitherRef.current && cachedSrcPixelsRef.current && cachedDstDataRef.current) {
                const dstData = cachedDstDataRef.current;
                const dstPix = dstData.data;
                const srcPix = cachedSrcPixelsRef.current;
                const len = dw * dh;
                let x = 0, y = 0;
                for (let i = 0; i < len; i++) {
                    const idx = i * 4;
                    const threshold = BAYER_THRESHOLDS[(y & 3) * 4 + (x & 3)];
                    const noise = (threshold - 128) * 0.25;
                    
                    dstPix[idx] = Math.max(0, Math.min(255, Math.round((srcPix[idx] + noise) / 64) * 64));
                    dstPix[idx + 1] = Math.max(0, Math.min(255, Math.round((srcPix[idx + 1] + noise) / 64) * 64));
                    dstPix[idx + 2] = Math.max(0, Math.min(255, Math.round((srcPix[idx + 2] + noise) / 64) * 64));
                    dstPix[idx + 3] = 255;

                    x++;
                    if (x >= dw) { x = 0; y++; }
                }
                const oCtx = offSrc.getContext('2d');
                if (oCtx) {
                    oCtx.putImageData(dstData, 0, 0);
                    cachedStaticColorDitherRef.current = oCtx.getImageData(0, 0, dw, dh);
                }
            } else if (cachedStaticColorDitherRef.current) {
                // If already cached, just restore it onto the offscreen canvas
                const oCtx = offSrc.getContext('2d');
                if (oCtx) {
                    oCtx.putImageData(cachedStaticColorDitherRef.current, 0, 0);
                }
            }
        } else {
            // Palette / Monochrome Mode (dynamic shimmering)
            if (cachedLumaRef.current && cachedDstDataRef.current) {
                const dstData = cachedDstDataRef.current;
                const dstPix = dstData.data;
                const cachedLuma = cachedLumaRef.current;
                const pDark = pal.dark;
                const pLight = pal.light;
                const shimmerBreathe = Math.sin(Date.now() * 0.002) * 5;
                const len = dw * dh;
                let x = 0, y = 0;

                for (let i = 0; i < len; i++) {
                    const idx = i * 4;
                    const threshold = BAYER_THRESHOLDS[(y & 3) * 4 + (x & 3)];

                    let luma = cachedLuma[i] + shimmerBreathe;
                    if (luma < 0) luma = 0;
                    else if (luma > 255) luma = 255;

                    const isDotOn = luma > threshold;
                    const finalColor = isDotOn ? pLight : pDark;

                    dstPix[idx] = finalColor[0];
                    dstPix[idx + 1] = finalColor[1];
                    dstPix[idx + 2] = finalColor[2];
                    dstPix[idx + 3] = 255;

                    x++;
                    if (x >= dw) { x = 0; y++; }
                }
                const oCtx = offSrc.getContext('2d');
                if (oCtx) {
                    oCtx.putImageData(dstData, 0, 0);
                }
            }
        }

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(offSrc, 0, 0, w, h);

        const gradient = ctx.createRadialGradient(w / 2, h / 2, w / 4, w / 2, h / 2, w / 1.8);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    }, [src, drawCoverFit]);

    // Render loop
    useEffect(() => {
        let active = true;

        const render = () => {
            if (!active) return;
            const canvas = canvasRef.current;
            const img = imageRef.current;

            if (!canvas || !img || !imageLoaded || size.w === 0 || size.h === 0) {
                animationFrameRef.current = requestAnimationFrame(render);
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const w = size.w;
            const h = size.h;

            const target = isActive ? 1.0 : 0.0;
            const diff = target - progressRef.current;
            let needsNextFrame = true;

            if (Math.abs(diff) > 0.0002) {
                // Snappier transition when going from image back to dither
                const dynamicSpeed = isActive ? transitionSpeed : transitionSpeed * 2.5;
                progressRef.current += diff * 0.032 * dynamicSpeed;
            } else {
                progressRef.current = target;
            }

            const rawT = progressRef.current;
            const t = easeOutQuint(rawT);

            // --- STATIC DITHER (Inactive State) ---
            if (t < 0.001) {
                drawDitherState(ctx, img, w, h, palette, density, colorMode);
                particlesRef.current = [];
                // If it is color mode, the dither is 100% static, so we don't need any more frames!
                if (colorMode === "color") {
                    needsNextFrame = false;
                }
            }

            // --- PHOTO MATERIALIZED (Stable Active State) ---
            else if (t > 0.999 && isActive) {
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                
                drawCoverFit(ctx, img, w, h);
                
                particlesRef.current = [];
                needsNextFrame = false;
            }

            // --- WAVEFRONT TRANSITION ---
            else {
                if (isActive) {
                    // Entering: Base is dithered state, clipped layer is clear image expanding outwards
                    drawDitherState(ctx, img, w, h, palette, density, colorMode);

                    ctx.save();
                    ctx.beginPath();

                    const cx = w / 2;
                    const cy = h / 2;
                    const maxDist = Math.sqrt(cx * cx + cy * cy);
                    const sweepRadius = t * maxDist;

                    const numPoints = 180;
                    const phase = Date.now() * 0.007;
                    const rippleAmp = 25 * Math.sin(t * Math.PI);

                    for (let i = 0; i <= numPoints; i++) {
                        const angle = (i / numPoints) * Math.PI * 2;
                        const ripple = Math.sin(angle * 12 + phase) * rippleAmp;
                        const r = Math.max(0, sweepRadius + ripple);
                        const px = cx + Math.cos(angle) * r;
                        const py = cy + Math.sin(angle) * r;

                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.clip();

                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';

                    const scaleFactor = 1.05 - (t * 0.05);
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.scale(scaleFactor, scaleFactor);
                    ctx.translate(-cx, -cy);

                    drawCoverFit(ctx, img, w, h);
                    
                    ctx.restore();
                    ctx.restore();

                    // Spark particle emitter along the expanding ring
                    if (t > 0.02 && t < 0.98) {
                        const spawnCount = Math.floor(Math.random() * 3) + 1;
                        for (let s = 0; s < spawnCount; s++) {
                            const angle = Math.random() * Math.PI * 2;
                            const ripple = Math.sin(angle * 12 + phase) * rippleAmp;
                            const r = sweepRadius + ripple;
                            const px = cx + Math.cos(angle) * r;
                            const py = cy + Math.sin(angle) * r;

                            const speedFactor = 0.8 + Math.random() * 1.5;
                            const vx = Math.cos(angle) * speedFactor + (Math.random() - 0.5) * 0.4;
                            const vy = Math.sin(angle) * speedFactor + (Math.random() - 0.5) * 0.4;

                            particlesRef.current.push({
                                x: px,
                                y: py,
                                vx,
                                vy,
                                alpha: 1.0,
                                size: 1.2 + Math.random() * 2,
                                color: `rgba(${palette.light[0]}, ${palette.light[1]}, ${palette.light[2]}, ${0.6 + Math.random() * 0.4})`
                            });
                        }
                    }

                    // Glowing neon border outlining the organic wavefront
                    if (t > 0.01 && t < 0.99) {
                        ctx.strokeStyle = palette.glowColor;
                        ctx.lineWidth = 3.5 * (1.0 - t);
                        ctx.shadowBlur = 18;
                        ctx.shadowColor = palette.glowColor;

                        ctx.beginPath();
                        for (let i = 0; i <= numPoints; i++) {
                            const angle = (i / numPoints) * Math.PI * 2;
                            const ripple = Math.sin(angle * 12 + phase) * rippleAmp;
                            const r = Math.max(0, sweepRadius + ripple);
                            const px = cx + Math.cos(angle) * r;
                            const py = cy + Math.sin(angle) * r;

                            if (i === 0) ctx.moveTo(px, py);
                            else ctx.lineTo(px, py);
                        }
                        ctx.closePath();
                        ctx.stroke();

                        ctx.shadowBlur = 0;
                    }
                } else {
                    // Exiting (image to dither): outer to inner
                    // Base is dithered state, clipped layer is clear image shrinking inwards to the center
                    drawDitherState(ctx, img, w, h, palette, density, colorMode);

                    ctx.save();
                    ctx.beginPath();

                    const cx = w / 2;
                    const cy = h / 2;
                    const maxDist = Math.sqrt(cx * cx + cy * cy);
                    const sweepRadius = t * maxDist;

                    const numPoints = 180;
                    const rippleAmp = 12 * Math.sin(t * Math.PI);

                    for (let i = 0; i <= numPoints; i++) {
                        const angle = (i / numPoints) * Math.PI * 2;
                        const ripple = Math.sin(angle * 8) * rippleAmp;
                        const r = Math.max(0, sweepRadius + ripple);
                        const px = cx + Math.cos(angle) * r;
                        const py = cy + Math.sin(angle) * r;

                        if (i === 0) ctx.moveTo(px, py);
                        else ctx.lineTo(px, py);
                    }
                    ctx.closePath();
                    ctx.clip();

                    drawCoverFit(ctx, img, w, h);

                    ctx.restore();
                }
            }

            // Render existing particles
            const particles = particlesRef.current;
            if (particles.length > 0) {
                needsNextFrame = true;
                for (let i = particles.length - 1; i >= 0; i--) {
                    const p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    p.alpha -= 0.025;

                    if (p.alpha <= 0) {
                        particles.splice(i, 1);
                        continue;
                    }

                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.alpha;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1.0;
            }

            if (needsNextFrame) {
                animationFrameRef.current = requestAnimationFrame(render);
            }
        };

        render();

        return () => {
            active = false;
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [imageLoaded, isActive, palette, density, transitionSpeed, colorMode, size, drawCoverFit, drawDitherState]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[#050507] overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    );
};

export default function DitherCarousel({
    items = DEFAULT_ITEMS,
    autoPlay = false,
    autoPlayInterval = 5500,
    ditherResolution = "medium",
    colorMode = "champagne",
    transitionDuration = 800,
    height = "480px",
    className = "",
    onActiveIndexChange
}: DitherCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const paletteKey = colorMode || "champagne";
    const currentPalette = PALETTES[paletteKey] || PALETTES.champagne;

    const density: 'fine' | 'medium' | 'broad' = 
        ditherResolution === "retro" ? "broad" : 
        ditherResolution === "high" ? "fine" : "medium";

    const speed = 1120 / (transitionDuration || 800);
    const touchStartX = useRef<number | null>(null);

    // Slide navigation
    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    const selectSlide = (idx: number) => {
        if (idx === activeIndex) return;
        setActiveIndex(idx);
    };

    // Synchronize active index to parent in an effect to avoid setState-in-render warning
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (onActiveIndexChange) {
            onActiveIndexChange(activeIndex);
        }
    }, [activeIndex, onActiveIndexChange]);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    // Autoplay clock
    useEffect(() => {
        if (!autoPlay) return;
        const interval = setInterval(nextSlide, autoPlayInterval);
        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, nextSlide]);

    // Mobile Swipe events
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        const threshold = 55;
        if (Math.abs(diff) > threshold) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        touchStartX.current = null;
    };

    return (
        <div 
            className={`relative w-full flex flex-col justify-center items-center overflow-visible select-none ${className}`}
            style={{ height }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Soft warm ambient background glow */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none z-0 transition-all duration-[1200ms] opacity-35"
                style={{
                    backgroundColor: `rgba(${currentPalette.light[0]}, ${currentPalette.light[1]}, ${currentPalette.light[2]}, 0.04)`
                }}
            />

            {/* CAROUSEL FLUID CONTAINER */}
            <div
                className="relative w-full h-[90%] flex items-center justify-center overflow-visible mb-6"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {items.map((slide, index) => {
                    const length = items.length;
                    let relativeIndex = index - activeIndex;

                    if (relativeIndex < -1) relativeIndex += length;
                    if (relativeIndex > length - 2) relativeIndex -= length;

                    const isCenter = relativeIndex === 0;
                    const isLeft = relativeIndex === -1;
                    const isRight = relativeIndex === 1;
                    const isHidden = !isCenter && !isLeft && !isRight;

                    if (isHidden) return null;

                    // Positioning and translation scaling curves
                    let positionClasses = "";
                    let scaleClass = "scale-[0.55] opacity-0 pointer-events-none";

                    if (isCenter) {
                        scaleClass = "scale-100 opacity-100 z-30 cursor-default shadow-[0_30px_80px_rgba(0,0,0,0.85)]";
                        positionClasses = "translate-x-0";
                    } else if (isLeft) {
                        scaleClass = "scale-75 opacity-35 md:opacity-50 z-20 cursor-pointer hover:opacity-80";
                        positionClasses = "-translate-x-1/3 sm:-translate-x-1/2 lg:-translate-x-2/3";
                    } else if (isRight) {
                        scaleClass = "scale-75 opacity-35 md:opacity-50 z-20 cursor-pointer hover:opacity-80";
                        positionClasses = "translate-x-1/3 sm:translate-x-1/2 lg:translate-x-2/3";
                    }

                    return (
                        <div
                            key={slide.id}
                            onClick={() => {
                                if (isLeft) prevSlide();
                                if (isRight) nextSlide();
                            }}
                            className={`absolute w-[84%] sm:w-[72%] md:w-[62%] h-full transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${positionClasses} ${scaleClass}`}
                        >
                            {/* Custom Elegant Border Gradient Framing */}
                            <div className={`absolute -inset-[1px] rounded-lg transition-all duration-[1000ms] pointer-events-none z-10 ${isCenter
                                ? `bg-gradient-to-b from-zinc-850/60 to-zinc-950/90 p-[1px]`
                                : `bg-zinc-900/20 p-[1px]`
                                }`} />

                            {/* Inner Canvas housing */}
                            <div className="w-full h-full rounded-lg overflow-hidden relative bg-[#040405] shadow-2xl">
                                <DitherCanvas
                                    src={slide.url}
                                    isActive={isCenter}
                                    palette={currentPalette}
                                    density={density}
                                    transitionSpeed={speed}
                                    colorMode={colorMode}
                                />

                                {/* Corner Index Indicator */}
                                <div className="absolute top-4 left-4 bg-zinc-950/70 border border-zinc-900/60 text-[9px] text-zinc-400 font-mono py-1 px-2.5 rounded-md backdrop-blur-md pointer-events-none tracking-widest uppercase">
                                    ID // {String(slide.id).padStart(2, '0')}
                                </div>

                                {/* Shading overlay for flanking cards */}
                                {!isCenter && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 hover:opacity-0 transition-opacity duration-700" />
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* ELEGANT ARROW CONTROLS */}
                <div className={`absolute inset-x-0 mx-auto w-[94%] flex justify-between pointer-events-none z-40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 sm:opacity-30'
                    }`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="pointer-events-auto p-4 rounded-full border border-zinc-900 bg-zinc-950/90 hover:bg-zinc-900 hover:text-white text-zinc-400 transition-all shadow-2xl hover:scale-105 active:scale-95"
                        aria-label="Previous Gallery Slide"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="pointer-events-auto p-4 rounded-full border border-zinc-900 bg-zinc-950/90 hover:bg-zinc-900 hover:text-white text-zinc-400 transition-all shadow-2xl hover:scale-105 active:scale-95"
                        aria-label="Next Gallery Slide"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* pagination Line Bars */}
            <div className="flex items-center gap-3 mt-4 z-30">
                {items.map((_, idx) => {
                    const isSelected = idx === activeIndex;
                    return (
                        <button
                            key={idx}
                            onClick={() => selectSlide(idx)}
                            className="py-2 focus:outline-none"
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                            <div className={`h-[2px] transition-all duration-[600ms] ${isSelected
                                ? 'w-10 bg-zinc-350'
                                : 'w-3 bg-zinc-850 hover:bg-zinc-700'
                                }`} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}