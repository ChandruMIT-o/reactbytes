import React, { useEffect, useRef, useState } from 'react';

/**
 * Optimized Inline Perlin Noise Implementation
 * Provides the mathematical foundation for the organic movement.
 */
const perlin = {
    p: new Uint8Array(512),
    init() {
        const p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) p[i] = i;
        for (let i = 255; i > 0; i--) {
            const r = Math.floor(Math.random() * (i + 1));
            [p[i], p[r]] = [p[r], p[i]];
        }
        for (let i = 0; i < 512; i++) this.p[i] = p[i & 255];
    },
    fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); },
    lerp(t: number, a: number, b: number) { return a + t * (b - a); },
    grad(hash: number, x: number, y: number) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    },
    noise(x: number, y: number) {
        let X = Math.floor(x) & 255;
        let Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        let u = this.fade(x);
        let v = this.fade(y);

        let A = this.p[X] + Y, AA = this.p[A], AB = this.p[A + 1];
        let B = this.p[X + 1] + Y, BA = this.p[B], BB = this.p[B + 1];

        return this.lerp(v, this.lerp(u, this.grad(this.p[AA], x, y),
            this.grad(this.p[BA], x - 1, y)),
            this.lerp(u, this.grad(this.p[AB], x, y - 1),
                this.grad(this.p[BB], x - 1, y - 1)));
    }
};

export interface DitherProps {
    /** Spacing between dots in pixels */
    spacing?: number;
    /** Scale of Perlin noise. Higher values lead to larger, smoother waves */
    scale?: number;
    /** Amplitude/intensity of the Perlin noise */
    intensity?: number;
    /** Animation loop duration in seconds */
    duration?: number;
    /** Stagger delay amount for GSAP timeline */
    stagger?: number;
    /** Dark accent color for the dots underlayer */
    colorDark?: string;
    /** Light accent color for the dots */
    colorLight?: string;
    /** Background color of the canvas */
    colorBg?: string;
    /** Additional container CSS classes */
    className?: string;
    /** Optional content overlays */
    children?: React.ReactNode;
}

export const Dither: React.FC<DitherProps> = ({
    spacing = 10,
    scale = 450,
    intensity = 7,
    duration = 2,
    stagger = 4,
    colorDark = '#02a',
    colorLight = '#29e',
    colorBg = '#005',
    className = '',
    children
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    useEffect(() => {
        if ((window as any).gsap) {
            setGsapLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
        script.onload = () => setGsapLoaded(true);
        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        if (!gsapLoaded) return;
        const gsap = (window as any).gsap;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let dots: any[] = [];
        let cw = 0, ch = 0;
        let tl: any = null;

        const setDots = () => {
            if (tl) tl.kill();
            dots = [];

            // Simulate original `noise.seed(Math.random())` by regenerating the permutation table
            perlin.init();

            let cols = 0;
            let rows = 0;
            for (let x = 0; x <= cw + spacing; x += spacing) {
                cols++;
            }
            for (let y = 0; y <= ch + spacing; y += spacing) {
                rows++;
            }

            for (let x = 0; x <= cw + spacing; x += spacing) {
                for (let y = 0; y <= ch + spacing; y += spacing) {
                    dots.push({
                        s: perlin.noise(x / scale, y / scale) * intensity,
                        x: x - spacing / 2,
                        y: y - spacing / 2
                    });
                }
            }

            dots.sort((a, b) => a.x - b.x);

            // Reseed again for the target morph state
            perlin.init();

            // Original GSAP timeline logic restored!
            tl = gsap.timeline({ onUpdate: render })
                .to(dots, {
                    duration: duration,
                    s: (i: number, t: any) => perlin.noise(t.x / scale, t.y / scale) * intensity,
                    ease: 'power2.inOut',
                    yoyoEase: 'power1.in',
                    stagger: {
                        amount: stagger,
                        from: 'edges',
                        grid: [cols, rows],
                        yoyo: true,
                        repeat: -1
                    }
                })
                .seek(99);
        };

        const drawDot = (d: any) => {
            // Use original gsap utils clamp and power calculations
            let n = Math.round(gsap.utils.clamp(0.01, spacing / 2.5, d.s ** 2));

            ctx.translate(d.x, d.y);

            ctx.fillStyle = colorDark;
            ctx.fillRect(-(n / 4), -(n / 4), Math.pow(n, 2.5), Math.pow(n, 2.5));

            ctx.fillStyle = colorLight;
            ctx.fillRect(-(n / 4), -(n / 4), Math.pow(n, 2), Math.pow(n, 2));

            ctx.translate(-d.x, -d.y);
        };

        function render() {
            if (!ctx) return;
            ctx.fillStyle = colorBg;
            ctx.fillRect(0, 0, cw, ch);

            for (let i = 0; i < dots.length; i++) {
                drawDot(dots[i]);
            }
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const width = Math.floor(entry.contentRect.width);
                const height = Math.floor(entry.contentRect.height);
                if (width > 0 && height > 0) {
                    cw = width;
                    ch = height;

                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = cw * dpr;
                    canvas.height = ch * dpr;
                    ctx.scale(dpr, dpr);

                    setDots();
                }
            }
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            if (tl) tl.kill();
        };
    }, [gsapLoaded, spacing, scale, intensity, duration, stagger, colorDark, colorLight, colorBg]);

    return (
        <div 
            ref={containerRef} 
            className={`relative w-full h-full overflow-hidden m-0 p-0 ${className}`}
            style={{ backgroundColor: colorBg }}
        >
            <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full block"
            />
            {children && (
                <div className="relative z-10 w-full h-full">
                    {children}
                </div>
            )}
        </div>
    );
};

export default Dither;