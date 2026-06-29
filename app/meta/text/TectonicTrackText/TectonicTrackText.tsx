"use client";

import React, { useEffect, useRef } from "react";

interface TectonicNode {
    char: string;
    baseWidth: number;       // Raw immutable width of the glyph
    currentWidth: number;    // Intercepted dynamic width footprint
    targetWidth: number;     // Intended scale destination
    x: number;               // Derived horizontal layout coordinate
    expansion: number;       // Smooth spring-tracked interpolation scalar (0 to 1)
    vx: number;              // Velocity component for width changes
}

export interface TectonicTrackTextProps {
    /** The typography string to mount to the elastic track */
    text?: string;
    /** Scale of font size in pixels - dynamically sizes container bounds */
    fontSize?: number;
    /** Primary typography color */
    color?: string;
    /** Color of the minimalist micro-metric baseline rules */
    lineColor?: string;
    /** Maximal added spacing pixel padding injected per character at peak hover */
    maxTrackingExpansion?: number;
    /** Scale factor increasing character width matrix when active */
    maxScaleX?: number;
    /** Proximity boundary radius for cursor interaction */
    influenceRadius?: number;
    /** Spring tension tracking speed index */
    stiffness?: number;
    /** Friction coefficient slowing tracking oscillations */
    damping?: number;
    /** Extra wrapper layout container custom CSS classes */
    className?: string;
}

export const TectonicTrackText: React.FC<TectonicTrackTextProps> = ({
    text = "TECTONIC",
    fontSize = 75,
    color = "#ffffff",
    lineColor = "rgba(255, 255, 255, 0.15)",
    maxTrackingExpansion = 35,
    maxScaleX = 1.25,
    influenceRadius = 120,
    stiffness = 0.08,
    damping = 0.74,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const nodesRef = useRef<TectonicNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const animationFrameId = useRef<number | null>(null);

    const currentScaleRef = useRef(1);
    const currentFontSizeRef = useRef(fontSize);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const handleResize = () => {
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Measure original size to determine scaling
            ctx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
            const characters = text.split("");
            const baseTextWidth = characters.reduce((sum, char) => sum + ctx.measureText(char).width, 0);

            const containerWidth = container.clientWidth || 300;

            // Calculate scale factor: we want baseTextWidth + safety padding (30px) to fit
            const targetFitWidth = containerWidth - 30;
            let scale = 1;
            if (baseTextWidth > targetFitWidth && targetFitWidth > 0) {
                scale = targetFitWidth / baseTextWidth;
            }
            currentScaleRef.current = scale;

            const activeFontSize = Math.max(12, fontSize * scale);
            currentFontSizeRef.current = activeFontSize;

            const fontStyle = `900 ${activeFontSize}px "Space Grotesk", -apple-system, sans-serif`;
            ctx.font = fontStyle;

            const initialNodes = characters.map((char) => {
                const w = ctx.measureText(char).width;
                return {
                    char,
                    baseWidth: w,
                    currentWidth: w,
                    targetWidth: w,
                    x: 0,
                    expansion: 0,
                    vx: 0,
                };
            });

            const activePaddingY = activeFontSize * 0.4;
            const canvasHeight = activeFontSize + activePaddingY * 2;
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

            canvas.width = containerWidth * dpr;
            canvas.height = canvasHeight * dpr;
            canvas.style.width = `${containerWidth}px`;
            canvas.style.height = `${canvasHeight}px`;

            ctx.scale(dpr, dpr);
            ctx.font = fontStyle;
            ctx.textBaseline = "middle";

            nodesRef.current = initialNodes;
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
    }, [text, fontSize, maxTrackingExpansion, maxScaleX]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const layoutLoop = () => {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            // Maintain perfectly transparent backdrops to bleed into modern site designs
            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            const nodes = nodesRef.current;

            if (nodes.length === 0) {
                animationFrameId.current = requestAnimationFrame(layoutLoop);
                return;
            }

            const activeScale = currentScaleRef.current;
            const activeFontSize = currentFontSizeRef.current;
            const activeInfluenceRadius = influenceRadius * activeScale;
            const activeMaxTrackingExpansion = maxTrackingExpansion * activeScale;

            // 1. CALCULATE HORIZONTAL PRESSURE DISTRIBUTION FIELD
            let calculatedTotalWordWidth = 0;

            // Pass A: Measure dynamic expansion scales based on real-time cursor offsets
            nodes.forEach((node) => {
                // Approximate global coordinate index to evaluate distance factors
                const absoluteTargetNodeCenter = node.x + node.currentWidth / 2;
                const dx = mouse.x - absoluteTargetNodeCenter;
                const distance = Math.abs(dx);

                let targetedExpansionState = 0;

                if (mouse.active && distance < activeInfluenceRadius) {
                    // Smooth bell-curve Gaussian profile for organic, smooth-step spacing transitions
                    const normalizeDistance = distance / activeInfluenceRadius;
                    targetedExpansionState = Math.pow(Math.cos(normalizeDistance * Math.PI / 2), 2);
                }

                // Process standard Hooke's spring velocity models to resolve width values smoothly
                const springForce = (targetedExpansionState - node.expansion) * stiffness;
                node.vx = (node.vx + springForce) * damping;
                node.expansion += node.vx;

                // Lock tracking value bounds
                if (node.expansion < 0) node.expansion = 0;
                if (node.expansion > 1) node.expansion = 1;

                // Linearly interpolate dynamic structural footprint width
                const expandedGlyphWidth = node.baseWidth * (1 + (maxScaleX - 1) * node.expansion);
                const expandedTrackingPadding = activeMaxTrackingExpansion * node.expansion;

                node.currentWidth = expandedGlyphWidth + expandedTrackingPadding;
                calculatedTotalWordWidth += node.currentWidth;
            });

            // Pass B: Accumulate shifting footprints sequentially to map layout coordinates
            let currentCursorX = width / 2 - calculatedTotalWordWidth / 2;
            nodes.forEach((node) => {
                node.x = currentCursorX;
                currentCursorX += node.currentWidth; // Slide following elements along the horizontal track
            });

            // 2. MODERN RENDER MATRIX PASSTHROUGH
            const centerY = height / 2;
            const baselineY = centerY + activeFontSize * 0.45;
            const activePaddingX = activeFontSize * 0.8;

            // Draw Minimalist Architectural Tech Baseline Rule
            ctx.save();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(activePaddingX * 0.5, baselineY);
            ctx.lineTo(width - activePaddingX * 0.5, baselineY);
            ctx.stroke();
            ctx.restore();

            // Render Typography and Micro-Metric Indicators
            nodes.forEach((node) => {
                const charCenterX = node.x + node.currentWidth / 2;

                // Visual Flair: Draw architectural boundary ticks for expanding typography blocks
                if (node.expansion > 0.05) {
                    ctx.save();
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.8;
                    ctx.globalAlpha = node.expansion;

                    // Draw tracking boundary bracket indicators
                    ctx.beginPath();
                    ctx.moveTo(node.x, baselineY - 4);
                    ctx.lineTo(node.x, baselineY + 4);
                    ctx.moveTo(node.x + node.currentWidth, baselineY - 4);
                    ctx.lineTo(node.x + node.currentWidth, baselineY + 4);
                    ctx.stroke();

                    // Tiny tracking dot anchor core
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(charCenterX, baselineY, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }

                // Render Crisp Solid Text Glyph Face
                ctx.save();
                ctx.font = `900 ${activeFontSize}px "Space Grotesk", -apple-system, sans-serif`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";
                ctx.fillStyle = color;

                // Map 2D transformation matrices to adjust character scale width safely
                ctx.translate(charCenterX, centerY);
                const glyphScaleFactorX = 1 + (maxScaleX - 1) * node.expansion;
                ctx.scale(glyphScaleFactorX, 1);

                ctx.fillText(node.char, 0, 0);
                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(layoutLoop);
        };

        animationFrameId.current = requestAnimationFrame(layoutLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [color, lineColor, fontSize, influenceRadius, maxTrackingExpansion, maxScaleX, stiffness, damping]);

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
        <div ref={containerRef} className={`w-full select-none overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={() => {
                    mouseRef.current = { x: -1000, y: -1000, active: false };
                }}
                className="mx-auto block touch-none cursor-ew-resize"
            />
        </div>
    );
};

export default TectonicTrackText;
