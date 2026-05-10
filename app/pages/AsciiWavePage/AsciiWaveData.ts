export const charList = [
    "☰☱☲☳☴☵☶☷",
    "▤▥▦▧▨▩",
    "♚♛♜♝♞♟♔♕♖♗♘♙",
    "▖▗▘▙▚▛▜▝▞▟■",
    "◐◑◒◓◔◕",
    "◰◱◲◳◴◵◶◷",
    "10",
    "✻✼❄❅❆❇❈❉❊❋",
    "⣿⣷⣯⣟⡿⢿⣻⣽",
    "αβγδεζηθικλμ",
    "⚀⚁⚂⚃⚄⚅",
    "ᚠᚡᚢᚣᚤᚥᚦᚧᚨᚩᚪᚫ",
    "◢◣◤◥",
    "♠♥♦♣♤♢♧♡",
    "✽✾✿❀❁❂❃",
    "┌┐└┘├┤┬┴┼─",
    "╓╔╕╖╗╘╙╚╛╜╝",
    "⋐⋑⋒⋓",
    "┌┐└┘├┤┬┴┼─",
];

export const loaderProps = [
    {
        title: "Configuration Props",
        props: [
            { name: "gap", type: "number", defaultValue: "40", description: "Distance between each character in the grid." },
            { name: "radiusVmin", type: "number", defaultValue: "30", description: "Radius of influence from the mouse pointer (in vmin)." },
            { name: "speedIn", type: "number", defaultValue: "0.5", description: "Speed factor when a character is scaling up." },
            { name: "speedOut", type: "number", defaultValue: "0.6", description: "Speed factor when a character is scaling down to rest." },
            { name: "restScale", type: "number", defaultValue: "0.09", description: "The base scale of characters when at rest." },
            { name: "minHoverScale", type: "number", defaultValue: "1", description: "Minimum scale a character can reach when hovered." },
            { name: "maxHoverScale", type: "number", defaultValue: "3", description: "Maximum scale a character can reach when hovered." },
            { name: "waveSpeed", type: "number", defaultValue: "1200", description: "Speed of the click wave propagation." },
            { name: "waveWidth", type: "number", defaultValue: "180", description: "Thickness of the click wave." },
        ],
    },
    {
        title: "Styling Props",
        props: [
            { name: "colorMode", type: "boolean", defaultValue: "true", description: "Toggle between using the provided palette or grayscale equivalents." },
            { name: "backgroundColor", type: "string", defaultValue: "'#050505'", description: "Canvas and container background color." },
        ],
    },
];

export const componentCode = `import React, { useEffect, useRef, useMemo } from 'react';

export type ColorDef = { type: 'solid' | 'gradient'; value?: string; stops?: string[] };

export interface AsciiWaveProps {
    /** Distance between each character in the grid */
    gap?: number;
    /** Radius of influence from the mouse pointer (in vmin) */
    radiusVmin?: number;
    /** Speed factor when a character is scaling up */
    speedIn?: number;
    /** Speed factor when a character is scaling down to rest */
    speedOut?: number;
    /** The base scale of characters when at rest */
    restScale?: number;
    /** Minimum scale a character can reach when hovered */
    minHoverScale?: number;
    /** Maximum scale a character can reach when hovered */
    maxHoverScale?: number;
    /** Speed of the click wave propagation */
    waveSpeed?: number;
    /** Thickness of the click wave */
    waveWidth?: number;
    /** Array of characters to use in the grid */
    chars?: string[];
    /** Array of color definitions for the characters */
    palette?: ColorDef[];
    /** Toggle between using the provided palette or grayscale equivalents */
    colorMode?: boolean;
    /** Canvas and container background color */
    backgroundColor?: string;
}

const DEFAULT_CHARS = ['@', '#', '\$', '%', '&', '*', '+', '=', '?', 'A', 'X', '0', '1', '∑', '∆', 'π', 'Ω'];

const DEFAULT_PALETTE: ColorDef[] = [
    { type: 'solid', value: '#22c55e' },
    { type: 'solid', value: '#06b6d4' },
    { type: 'solid', value: '#f97316' },
    { type: 'solid', value: '#ef4444' },
    { type: 'solid', value: '#facc15' },
    { type: 'solid', value: '#ec4899' },
    { type: 'solid', value: '#9ca3af' },
    { type: 'solid', value: '#a78bfa' },
    { type: 'solid', value: '#60a5fa' },
    { type: 'solid', value: '#34d399' },
    { type: 'gradient', stops: ['#6366f1', '#3b82f6'] },
    { type: 'gradient', stops: ['#06b6d4', '#6366f1'] },
    { type: 'gradient', stops: ['#22c55e', '#06b6d4'] },
    { type: 'gradient', stops: ['#f97316', '#ef4444'] },
    { type: 'gradient', stops: ['#8b5cf6', '#06b6d4'] },
    { type: 'gradient', stops: ['#3b82f6', '#8b5cf6'] },
    { type: 'gradient', stops: ['#34d399', '#3b82f6'] },
];

// --- Utilities ---
const hexToGray = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
    const adjustedLum = Math.min(255, lum + 40);
};

const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const smoothstep = (t: number) => {
    const c = Math.max(0, Math.min(1, t));
    return c * c * (3 - 2 * c);
};
const durationToFactor = (seconds: number) => {
    if (seconds <= 0) return 1;
    return 1 - Math.pow(0.05, 1 / (60 * seconds));
};

export default function AsciiWave({
    gap = 40,
    radiusVmin = 30,
    speedIn = 0.5,
    speedOut = 0.6,
    restScale = 0.09,
    minHoverScale = 1,
    maxHoverScale = 3,
    waveSpeed = 1200,
    waveWidth = 180,
    chars = DEFAULT_CHARS,
    palette = DEFAULT_PALETTE,
    colorMode = true,
    backgroundColor = '#050505',
}: AsciiWaveProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Process palette to include grayscale equivalents once when palette changes
    const processedPalette = useMemo(() => {
        return palette.map((p) => {
            if (p.type === 'solid') {
                return { ...p, grayValue: hexToGray(p.value!) };
            } else {
                return { ...p, grayStops: p.stops!.map(hexToGray) };
            }
        });
    }, [palette]);

    // Keep a mutable ref of the latest configuration for the animation loop
    // This prevents having to tear down and restart the requestAnimationFrame loop
    const configRef = useRef({
        gap, radiusVmin, speedIn, speedOut, restScale, minHoverScale,
        maxHoverScale, waveSpeed, waveWidth, chars, colorMode,
        backgroundColor, processedPalette
    });

    useEffect(() => {
        configRef.current = {
            gap, radiusVmin, speedIn, speedOut, restScale, minHoverScale,
            maxHoverScale, waveSpeed, waveWidth, chars, colorMode,
            backgroundColor, processedPalette
        };
    }, [gap, radiusVmin, speedIn, speedOut, restScale, minHoverScale, maxHoverScale, waveSpeed, waveWidth, chars, colorMode, backgroundColor, processedPalette]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let grid: any = null;
        let rafId: number;
        let pointer: { x: number; y: number } | null = null;
        let activity = 0;
        let waves: any[] = [];

        const buildGrid = () => {
            const { gap, chars, processedPalette, restScale, minHoverScale, maxHoverScale } = configRef.current;
            const W = window.innerWidth;
            const H = window.innerHeight;
            const cols = Math.floor(W / gap);
            const rows = Math.floor(H / gap);
            const offsetX = (W - (cols - 1) * gap) / 2;
            const offsetY = (H - (rows - 1) * gap) / 2;
            const shapes = [];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    shapes.push({
                        x: offsetX + col * gap,
                        y: offsetY + row * gap,
                        char: pick(chars),
                        color: pick(processedPalette),
                        angle: rnd(0, Math.PI * 2),
                        size: gap * 0.8,
                        scale: restScale,
                        maxScale: rnd(minHoverScale, maxHoverScale),
                        hovered: false,
                    });
                }
            }
            return { shapes, width: W, height: H };
        };

        const initCanvas = () => {
            const W = window.innerWidth;
            const H = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;

            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';

            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);

            grid = buildGrid();
        };

        const resolveFill = (ctx: CanvasRenderingContext2D, colorDef: any, size: number, isColor: boolean) => {
            if (colorDef.type === 'solid') {
                return isColor ? colorDef.value : colorDef.grayValue;
            }
            const grad = ctx.createRadialGradient(0, -size * 0.3, 0, 0, size * 0.3, size * 1.5);
            grad.addColorStop(0, isColor ? colorDef.stops[0] : colorDef.grayStops[0]);
            grad.addColorStop(1, isColor ? colorDef.stops[1] : colorDef.grayStops[1]);
            return grad;
        };

        const triggerWave = (x?: number, y?: number) => {
            const targetX = x !== undefined ? x : window.innerWidth / 2;
            const targetY = y !== undefined ? y : window.innerHeight / 2;
            waves.push({ x: targetX, y: targetY, startTime: performance.now() });
        };

        const tick = () => {
            if (!grid) {
                rafId = requestAnimationFrame(tick);
                return;
            }

            const {
                radiusVmin, speedIn, speedOut, restScale, minHoverScale,
                maxHoverScale, waveSpeed, waveWidth, chars, colorMode, backgroundColor
            } = configRef.current;

            const { shapes, width, height } = grid;
            const radius = Math.min(width, height) * (radiusVmin / 100);
            const now = performance.now();

            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, width, height);

            activity *= 0.93;

            const maxDist = Math.sqrt(width * width + height * height);
            waves = waves.filter(
                (w) => (now - w.startTime) / 1000 * waveSpeed < maxDist + waveWidth
            );

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];

                let pointerInfluence = 0;
                if (pointer && activity > 0.001) {
                    const dx = shape.x - pointer.x;
                    const dy = shape.y - pointer.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    pointerInfluence = smoothstep(1 - dist / radius) * activity;

                    if (pointerInfluence > 0.05 && !shape.hovered) {
                        shape.hovered = true;
                        shape.maxScale = rnd(minHoverScale, maxHoverScale);
                        shape.angle = rnd(0, Math.PI * 2);
                        shape.char = pick(chars);
                    } else if (pointerInfluence <= 0.05) {
                        shape.hovered = false;
                    }
                } else {
                    shape.hovered = false;
                }

                let waveInfluence = 0;
                for (let j = 0; j < waves.length; j++) {
                    const wave = waves[j];
                    const waveRadius = ((now - wave.startTime) / 1000) * waveSpeed;
                    const wdx = shape.x - wave.x;
                    const wdy = shape.y - wave.y;
                    const wdist = Math.sqrt(wdx * wdx + wdy * wdy);
                    const t = 1 - Math.abs(wdist - waveRadius) / waveWidth;
                    if (t > 0) waveInfluence = Math.max(waveInfluence, Math.sin(Math.PI * t));
                }

                const pointerTarget = restScale + pointerInfluence * (shape.maxScale - restScale);
                const waveTarget = restScale + waveInfluence * (shape.maxScale - restScale);
                const target = Math.max(pointerTarget, waveTarget);

                const factor = target > shape.scale ? durationToFactor(speedIn) : durationToFactor(speedOut);
                shape.scale += (target - shape.scale) * factor;

                if (shape.scale < restScale * 0.15) continue;

                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.rotate(shape.angle);
                ctx.scale(shape.scale, shape.scale);

                ctx.fillStyle = resolveFill(ctx, shape.color, shape.size, colorMode);
                ctx.font = 'bold' + shape.size + 'px monospace';
                ctx.fillText(shape.char, 0, 0);

                ctx.restore();
            }

            rafId = requestAnimationFrame(tick);
        };

        const handlePointerMove = (e: PointerEvent) => {
            pointer = { x: e.clientX, y: e.clientY };
            activity = 1;
        };

        const handleClick = (e: MouseEvent) => {
            triggerWave(e.clientX, e.clientY);
        };

        // Initialization
        initCanvas();
        triggerWave();
        rafId = requestAnimationFrame(tick);

        window.addEventListener('resize', initCanvas);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('click', handleClick);

        // Rebuild grid if gap structurally changes
        const currentGap = configRef.current.gap;

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', initCanvas);
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('click', handleClick);
        };
    }, [gap]); // Adding gap as dependency so grid structurally rebuilds on size change

    return (
        <div
            className="relative w-full h-screen overflow-hidden font-sans select-none"
            style={{ backgroundColor }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full cursor-crosshair"
            />
        </div>
    );
}`;

export const creditsData = [
    {
        title: "Component Source",
        items: [
            {
                name: "React Bytes",
                role: "Collection",
                url: "https://reactbytes.dev",
            },
        ],
    },
];
