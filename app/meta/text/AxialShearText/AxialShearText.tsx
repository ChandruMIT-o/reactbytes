"use client";

import React, { useEffect, useRef } from "react";

interface ShearNode {
    char: string;
    centerX: number;    // True layout target X anchor
    centerY: number;    // True layout target Y anchor
    width: number;      // Bounding width footprint of the character
    leftY: number;      // Dynamic vertical offset of the left half
    rightY: number;     // Dynamic vertical offset of the right half
    leftVy: number;     // Velocity parameters for smooth tracking
    rightVy: number;
}

export interface AxialShearTextProps {
    /** The hidden text string to mount onto the shear line matrix */
    text?: string;
    /** Font scale in pixels - handles absolute container footprint bounds */
    fontSize?: number;
    /** Primary typography color of the solid glyph hulls */
    color?: string;
    /** Accent color of the interior alignment tracks and micro-telemetry scales */
    shearColor?: string;
    /** Maximum vertical pixel offset a character can split apart */
    maxShearOffset?: number;
    /** Proximity trigger radius surrounding the cursor position */
    influenceRadius?: number;
    /** Hooke's spring calculation stiffness profile */
    stiffness?: number;
    /** Kinetic damping factor to settle vertical slide motion */
    damping?: number;
    /** Extra wrapper layout container custom CSS classes */
    className?: string;
}

export const AxialShearText: React.FC<AxialShearTextProps> = ({
    text = "SHEAR",
    fontSize = 80,
    color = "#ffffff",
    shearColor = "rgba(14, 165, 233, 0.5)", // Tech precision cyan
    maxShearOffset = 24,
    influenceRadius = 75,
    stiffness = 0.07,
    damping = 0.75,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const nodesRef = useRef<ShearNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const animationFrameId = useRef<number | null>(null);

    const currentScaleRef = useRef(1);
    const currentFontSizeRef = useRef(fontSize);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const handleResize = () => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Measure original size to determine scaling
            ctx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
            const characters = text.split("");
            const baseTextWidthOriginal = characters.reduce((sum, char) => sum + ctx.measureText(char).width, 0);
            const originalPaddingX = fontSize * 0.4;
            const totalWidthOriginal = baseTextWidthOriginal + originalPaddingX * 2;

            const containerWidth = container.clientWidth || 300;

            // Determine scale factor: we want totalWidthOriginal + safety padding (20px) to fit
            const targetFitWidth = containerWidth - 20;
            let scale = 1;
            if (totalWidthOriginal > targetFitWidth && targetFitWidth > 0) {
                scale = targetFitWidth / totalWidthOriginal;
            }
            currentScaleRef.current = scale;

            const activeFontSize = Math.max(12, fontSize * scale);
            currentFontSizeRef.current = activeFontSize;

            const activePaddingX = activeFontSize * 0.4;
            const activePaddingY = activeFontSize * 0.5;

            const fontStyle = `900 ${activeFontSize}px "Space Grotesk", -apple-system, sans-serif`;
            ctx.font = fontStyle;

            // Measure characters with active font size
            let accumulatedX = 0;
            const metrics = characters.map((char) => {
                const w = ctx.measureText(char).width;
                const res = { char, width: w, startX: accumulatedX };
                accumulatedX += w;
                return res;
            });

            const totalWidth = accumulatedX + activePaddingX * 2;
            const totalHeight = activeFontSize + activePaddingY * 2;
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

            canvas.width = totalWidth * dpr;
            canvas.height = totalHeight * dpr;
            canvas.style.width = `${totalWidth}px`;
            canvas.style.height = `${totalHeight}px`;

            ctx.scale(dpr, dpr);
            ctx.font = fontStyle;
            ctx.textBaseline = "middle";

            const centerY = totalHeight / 2;

            // Map characters to independent split-axis structural nodes
            nodesRef.current = metrics.map((m) => ({
                char: m.char,
                centerX: activePaddingX + m.startX + m.width / 2,
                centerY: centerY,
                width: m.width,
                leftY: 0,
                rightY: 0,
                leftVy: 0,
                rightVy: 0,
            }));
        };

        const observer = new ResizeObserver(() => {
            handleResize();
        });
        observer.observe(container);

        // Initial measurement
        handleResize();

        return () => {
            observer.disconnect();
        };
    }, [text, fontSize]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const loop = () => {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            // Clear the frame canvas cleanly to bleed over underlying UI background elements
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            const nodes = nodesRef.current;

            const activeScale = currentScaleRef.current;
            const activeFontSize = currentFontSizeRef.current;
            const activeInfluenceRadius = influenceRadius * activeScale;
            const activeMaxShearOffset = maxShearOffset * activeScale;

            nodes.forEach((node) => {
                const dx = mouse.x - node.centerX;
                const dy = mouse.y - node.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                let targetLeftY = 0;
                let targetRightY = 0;

                // 1. AXIAL MAGNETIC SHEAR FORCE FIELD PHASES
                if (mouse.active && distance < activeInfluenceRadius) {
                    const powerFactor = (activeInfluenceRadius - distance) / activeInfluenceRadius;
                    
                    // Smooth bell-curve dropoff profile for organic tracking transitions
                    const smoothPower = Math.pow(Math.cos((1 - powerFactor) * Math.PI / 2), 2);
                    
                    // Determine split amplitude direction relative to cursor Y approach path
                    const directionMultiplier = dy >= 0 ? 1 : -1;
                    
                    // Push Left Hull up and Right Hull down cleanly along the split guide axis
                    targetLeftY = -activeMaxShearOffset * smoothPower * directionMultiplier;
                    targetRightY = activeMaxShearOffset * smoothPower * directionMultiplier;
                }

                // Process Hooke's differential spring laws to manage vertical offsets smoothly
                const leftSpringForce = (targetLeftY - node.leftY) * stiffness;
                node.leftVy = (node.leftVy + leftSpringForce) * damping;
                node.leftY += node.leftVy;

                const rightSpringForce = (targetRightY - node.rightY) * stiffness;
                node.rightVy = (node.rightVy + rightSpringForce) * damping;
                node.rightY += node.rightVy;

                // 2. MODERN RASTER GRAPHICS CLIPPING & RENDERING PASS
                ctx.save();
                ctx.font = `900 ${activeFontSize}px "Space Grotesk", -apple-system, sans-serif`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                const halfW = node.width / 2;
                const halfH = activeFontSize / 2;

                // INTERIOR DETAIL: Render technical indicator tracks inside the division void
                const activeShearMagnitude = Math.abs(node.leftY - node.rightY);
                if (activeShearMagnitude > 2) {
                    ctx.save();
                    ctx.strokeStyle = shearColor;
                    ctx.lineWidth = 0.7;
                    ctx.setLineDash([2, 3]);

                    // Central vertical guide rail axis line
                    ctx.beginPath();
                    ctx.moveTo(node.centerX, node.centerY - halfH - 4);
                    ctx.lineTo(node.centerX, node.centerY + halfH + 4);
                    ctx.stroke();

                    // Micro offset tracking telemetry tags
                    if (activeShearMagnitude > 12) {
                        ctx.fillStyle = shearColor;
                        ctx.font = `600 ${Math.max(6, 8 * activeScale)}px monospace`;
                        ctx.textAlign = "left";
                        
                        // Output real-time structural displacement height
                        const deltaReadout = `ΔY:${Math.abs(node.leftY).toFixed(1)}px`;
                        ctx.fillText(deltaReadout, node.centerX + 5, node.centerY + node.leftY);
                    }
                    ctx.restore();
                }

                // LAYER A: Mask & Draw Left Character Hull
                ctx.save();
                ctx.beginPath();
                // Set boundary clipping box perfectly up to the character center line
                ctx.rect(node.centerX - halfW - 10, node.centerY - halfH - 20, halfW + 10, halfH * 2 + 40);
                ctx.clip();

                // Translate left coordinate grid vertical plane matching spring offsets
                ctx.translate(0, node.leftY);
                ctx.fillStyle = color;
                ctx.fillText(node.char, node.centerX, node.centerY);
                ctx.restore();

                // LAYER B: Mask & Draw Right Character Hull
                ctx.save();
                ctx.beginPath();
                // Set boundary clipping box from center line out to right layout margins
                ctx.rect(node.centerX, node.centerY - halfH - 20, halfW + 10, halfH * 2 + 40);
                ctx.clip();

                // Translate right coordinate grid vertical plane matching spring offsets
                ctx.translate(0, node.rightY);
                ctx.fillStyle = color;
                ctx.fillText(node.char, node.centerX, node.centerY);
                ctx.restore();

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [color, shearColor, fontSize, maxShearOffset, influenceRadius, stiffness, damping]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            active: true,
        };
    };

    return (
        <div ref={containerRef} className={`w-full select-none overflow-hidden flex justify-center ${className}`}>
            <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => {
                    mouseRef.current.active = false;
                    mouseRef.current = { x: -1000, y: -1000, active: false };
                }}
                className="block touch-none cursor-crosshair mx-auto"
            />
        </div>
    );
};

export default AxialShearText;
