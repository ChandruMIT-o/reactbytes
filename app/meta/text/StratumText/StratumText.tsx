"use client";

import React, { useEffect, useRef } from "react";

interface StratumSlice {
    yOffset: number;   // Source Y position in the offscreen canvas
    height: number;    // Height of this slice
    x: number;         // Dynamic X displacement
    y: number;         // Dynamic Y displacement
    vx: number;        // X velocity
    vy: number;        // Y velocity
    angle: number;     // Shearing rotation angle
    vAngle: number;    // Angular velocity
    targetX: number;   // Home position anchor X
    targetY: number;   // Home position anchor Y
}

export interface StratumTextProps {
    /** The text string to slice and animate */
    text?: string;
    /** Number of horizontal stratigraphic slices */
    sliceCount?: number;
    /** Stiffness of the return spring physics */
    stiffness?: number;
    /** Friction/damping factor of the slices */
    damping?: number;
    /** Sensitivity of slices to pointer velocity cuts */
    cutForce?: number;
    /** Radius of pointer proximity displacement */
    influenceRadius?: number;
    /** Primary text color */
    color?: string;
    /** Background color of the grid architecture */
    bgColor?: string;
    /** Color of technical wireframes and structural readouts */
    wireframeColor?: string;
    /** Extra Tailwind or CSS classes */
    className?: string;
}

export const StratumText: React.FC<StratumTextProps> = ({
    text = "STRATA",
    sliceCount = 32,
    stiffness = 0.045,
    damping = 0.82,
    cutForce = 0.45,
    influenceRadius = 90,
    color = "#ffffff",
    bgColor = "#08080a",
    wireframeColor = "rgba(14, 165, 233, 0.35)",
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, active: false });
    const prevMouseRef = useRef({ x: -1000, y: -1000 });
    const slicesRef = useRef<StratumSlice[]>([]);
    const animationFrameId = useRef<number | null>(null);

    const widthRef = useRef(0);
    const heightRef = useRef(0);

    const createStrata = (height: number): StratumSlice[] => {
        const slices: StratumSlice[] = [];
        const sliceHeight = height / sliceCount;

        for (let i = 0; i < sliceCount; i++) {
            slices.push({
                yOffset: i * sliceHeight,
                height: sliceHeight,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                angle: 0,
                vAngle: 0,
                targetX: 0,
                targetY: 0,
            });
        }
        return slices;
    };

    const drawOffscreenText = (
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number
    ) => {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);

        // Replaced rigid window breakpoint with a fluid font computation matrix
        const fontSize = Math.min(130, Math.max(36, width * 0.14));
        ctx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = color;

        ctx.fillText(text, width / 2, height / 2);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleResize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;

            const width = parent.clientWidth;
            // Guard against parent block vertical collapses (common flex issue)
            const height = parent.clientHeight || 240;

            widthRef.current = width;
            heightRef.current = height;

            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;

            const ctx = canvas.getContext("2d");
            if (ctx) ctx.scale(dpr, dpr);

            if (!offscreenCanvasRef.current) {
                offscreenCanvasRef.current = document.createElement("canvas");
            }
            const offscreen = offscreenCanvasRef.current;
            offscreen.width = width * dpr;
            offscreen.height = height * dpr;

            const oCtx = offscreen.getContext("2d");
            if (oCtx) {
                oCtx.scale(dpr, dpr);
                drawOffscreenText(offscreen, oCtx, width, height);
            }

            slicesRef.current = createStrata(height);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [text, color, bgColor, sliceCount]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const renderLoop = () => {
            const width = widthRef.current;
            const height = heightRef.current;
            const offscreen = offscreenCanvasRef.current;

            if (width === 0 || height === 0 || !offscreen) {
                animationFrameId.current = requestAnimationFrame(renderLoop);
                return;
            }

            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            const mouse = mouseRef.current;

            if (mouse.active && prevMouseRef.current.x !== -1000) {
                mouse.vx = (mouse.x - prevMouseRef.current.x) * cutForce;
                mouse.vy = (mouse.y - prevMouseRef.current.y) * cutForce;
            } else {
                mouse.vx *= 0.85;
                mouse.vy *= 0.85;
            }
            prevMouseRef.current.x = mouse.x;
            prevMouseRef.current.y = mouse.y;

            const slices = slicesRef.current;

            slices.forEach((slice) => {
                const sliceYGlobal = slice.yOffset + slice.height / 2;
                const dy = sliceYGlobal - mouse.y;
                const absDy = Math.abs(dy);

                if (mouse.active && absDy < influenceRadius) {
                    const proximityFactor = (influenceRadius - absDy) / influenceRadius;

                    slice.vx += mouse.vx * proximityFactor * 1.5;
                    slice.vy += mouse.vy * proximityFactor * 0.4;

                    const distanceX = mouse.x - width / 2;
                    slice.vAngle += (mouse.vx * 0.0002) * proximityFactor * (distanceX * 0.01);

                    const repulsionX = Math.sign(width / 2 - mouse.x) * proximityFactor * 2.5;
                    slice.vx += repulsionX * 0.2;
                }

                const forceX = (slice.targetX - slice.x) * stiffness;
                const forceY = (slice.targetY - slice.y) * stiffness;
                const forceAngle = (0 - slice.angle) * stiffness;

                slice.vx = (slice.vx + forceX) * damping;
                slice.vy = (slice.vy + forceY) * damping;
                slice.vAngle = (slice.vAngle + forceAngle) * damping;

                slice.x += slice.vx;
                slice.y += slice.vy;
                slice.angle += slice.vAngle;
            });

            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

            slices.forEach((slice) => {
                const sliceCenterY = slice.yOffset + slice.height / 2;
                const sliceCenterX = width / 2;

                const totalDisplacement = Math.sqrt(slice.x * slice.x + slice.y * slice.y);
                if (totalDisplacement > 4) {
                    ctx.save();
                    ctx.strokeStyle = wireframeColor;
                    ctx.lineWidth = 0.6;
                    ctx.setLineDash([2, 5]);

                    ctx.beginPath();
                    ctx.moveTo(0, sliceCenterY);
                    ctx.lineTo(width, sliceCenterY);
                    ctx.stroke();

                    if (totalDisplacement > 15) {
                        ctx.fillStyle = wireframeColor;
                        ctx.fillRect(sliceCenterX + slice.x - 3, sliceCenterY + slice.y - 3, 6, 6);
                    }
                    ctx.restore();
                }

                ctx.save();

                ctx.translate(sliceCenterX + slice.x, sliceCenterY + slice.y);
                ctx.rotate(slice.angle);

                ctx.drawImage(
                    offscreen,
                    0, slice.yOffset * dpr,
                    width * dpr, slice.height * dpr,
                    -sliceCenterX, -slice.height / 2,
                    width, slice.height
                );

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(renderLoop);
        };

        animationFrameId.current = requestAnimationFrame(renderLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [bgColor, color, stiffness, damping, cutForce, influenceRadius, wireframeColor]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        // Calculate aspect normalization scaling vectors
        const scaleX = widthRef.current / rect.width;
        const scaleY = heightRef.current / rect.height;

        mouseRef.current.x = (e.clientX - rect.left) * scaleX;
        mouseRef.current.y = (e.clientY - rect.top) * scaleY;
        mouseRef.current.active = true;
    };

    return (
        <div className="w-full @container flex justify-center text-center">
            <div className={`relative w-full flex items-center justify-center text-center select-none overflow-hidden ${className}`}>
                <canvas
                    ref={canvasRef}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => {
                        mouseRef.current.active = false;
                        prevMouseRef.current = { x: -1000, y: -1000 };
                    }}
                    className="w-full h-full touch-none cursor-ew-resize mx-auto"
                />
            </div>
        </div>
    );
};

export default StratumText;