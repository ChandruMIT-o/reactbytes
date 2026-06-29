"use client";

import React, { useEffect, useRef, useState } from "react";

interface ShellLayer {
    x: number;         // Current relative spatial X
    y: number;         // Current relative spatial Y
    vx: number;        // Velocity X
    vy: number;        // Velocity Y
    massFactor: number;// Unique kinetic weight allocation
    stiffness: number; // Tailored return response
    damping: number;   // Friction profile
}

interface PhaseNode {
    char: string;
    centerX: number;   // True system anchor layout X
    centerY: number;   // True system anchor layout Y
    width: number;
    layers: ShellLayer[]; // 0: Core (Rigid), 1: Inertial (Heavy), 2: Tension (Volatile)
}

export interface PhaseShellTextProps {
    /** The string to pass to the chronographic layout matrix */
    text?: string;
    /** Absolute size of font in pixels - manages tightly bounded box metrics */
    fontSize?: number;
    /** Color of the center Core typography layer */
    coreColor?: string;
    /** Color of the heavy lagging Inertial outline shell */
    inertialColor?: string;
    /** Color of the volatile Tension wireframe shell and vector trusses */
    tensionColor?: string;
    /** Global force multiplier of pointer kinetic impact */
    impactForce?: number;
    /** Proximity trigger radius for pointer intersection */
    influenceRadius?: number;
    /** Extra wrapper element CSS utility layout classes */
    className?: string;
}

export const PhaseShellText: React.FC<PhaseShellTextProps> = ({
    text = "PHASE",
    fontSize = 95,
    coreColor = "#ffffff",
    inertialColor = "rgba(129, 140, 248, 0.5)",
    tensionColor = "rgba(6, 182, 212, 0.4)",
    impactForce = 1.3,
    influenceRadius = 80,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nodesRef = useRef<PhaseNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, active: false });
    const prevMouseRef = useRef({ x: -1000, y: -1000 });
    const animationFrameId = useRef<number | null>(null);

    // Dynamic scale tracking state context
    const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

    const paddingX = fontSize * 0.5;
    const paddingY = fontSize * 0.4;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const fontStyle = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
        ctx.font = fontStyle;

        const characters = text.split("");
        let accumulatedX = 0;
        const metrics = characters.map((char) => {
            const w = ctx.measureText(char).width;
            const res = { char, width: w, startX: accumulatedX };
            accumulatedX += w;
            return res;
        });

        const totalWidth = accumulatedX + paddingX * 2;
        const totalHeight = fontSize + paddingY * 2;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        // Establish core metric bounds inside react state
        setDimensions({ width: totalWidth, height: totalHeight });

        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;

        ctx.scale(dpr, dpr);
        ctx.font = fontStyle;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        const centerY = totalHeight / 2;

        nodesRef.current = metrics.map((m) => {
            const nodeCenterX = paddingX + m.startX + m.width / 2;
            return {
                char: m.char,
                centerX: nodeCenterX,
                centerY: centerY,
                width: m.width,
                layers: [
                    { x: 0, y: 0, vx: 0, vy: 0, massFactor: 0.3, stiffness: 0.09, damping: 0.72 },
                    { x: 0, y: 0, vx: 0, vy: 0, massFactor: 1.1, stiffness: 0.04, damping: 0.84 },
                    { x: 0, y: 0, vx: 0, vy: 0, massFactor: 2.4, stiffness: 0.06, damping: 0.78 },
                ],
            };
        });
    }, [text, fontSize, paddingX, paddingY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const executionLoop = () => {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;

            if (mouse.active && prevMouseRef.current.x !== -1000) {
                mouse.vx = (mouse.x - prevMouseRef.current.x) * 0.4;
                mouse.vy = (mouse.y - prevMouseRef.current.y) * 0.4;
            } else {
                mouse.vx *= 0.8;
                mouse.vy *= 0.8;
            }
            prevMouseRef.current.x = mouse.x;
            prevMouseRef.current.y = mouse.y;

            const nodes = nodesRef.current;

            nodes.forEach((node) => {
                const dx = mouse.x - node.centerX;
                const dy = mouse.y - node.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                node.layers.forEach((layer) => {
                    if (mouse.active && distance < influenceRadius) {
                        const proximityFactor = (influenceRadius - distance) / influenceRadius;
                        const angle = Math.atan2(dy, dx);
                        const forceEnvelope = proximityFactor * impactForce * layer.massFactor;

                        layer.vx += Math.cos(angle) * forceEnvelope * 1.5 + mouse.vx * 0.15;
                        layer.vy += Math.sin(angle) * forceEnvelope * 1.5 + mouse.vy * 0.15;
                    }

                    const springForceX = (0 - layer.x) * layer.stiffness;
                    const springForceY = (0 - layer.y) * layer.stiffness;

                    layer.vx = (layer.vx + springForceX) * layer.damping;
                    layer.vy = (layer.vy + springForceY) * layer.damping;

                    layer.x += layer.vx;
                    layer.y += layer.vy;
                });

                const cL = node.layers[0];
                const iL = node.layers[1];
                const tL = node.layers[2];

                const combinedVariance = Math.sqrt(
                    (tL.x - cL.x) * (tL.x - cL.x) + (tL.y - cL.y) * (tL.y - cL.y)
                );

                if (combinedVariance > 3) {
                    ctx.save();
                    ctx.strokeStyle = tensionColor;
                    ctx.lineWidth = 0.6;

                    ctx.beginPath();
                    ctx.moveTo(node.centerX + cL.x, node.centerY + cL.y);
                    ctx.lineTo(node.centerX + iL.x, node.centerY + iL.y);
                    ctx.lineTo(node.centerX + tL.x, node.centerY + tL.y);
                    ctx.stroke();

                    if (combinedVariance > 18) {
                        ctx.fillStyle = tensionColor;
                        ctx.font = `500 8px monospace`;
                        ctx.textAlign = "left";

                        const varianceString = `Δ:${combinedVariance.toFixed(1)}`;
                        ctx.fillText(
                            varianceString,
                            node.centerX + tL.x + (node.width / 2) - 4,
                            node.centerY + tL.y - (fontSize * 0.3)
                        );
                    }
                    ctx.restore();
                }

                ctx.save();
                ctx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                ctx.save();
                ctx.strokeStyle = tensionColor;
                ctx.lineWidth = 1;
                ctx.setLineDash([2, 4]);
                ctx.strokeText(node.char, node.centerX + tL.x, node.centerY + tL.y);
                ctx.restore();

                ctx.save();
                ctx.strokeStyle = inertialColor;
                ctx.lineWidth = 1.5;
                ctx.strokeText(node.char, node.centerX + iL.x, node.centerY + iL.y);
                ctx.restore();

                ctx.fillStyle = coreColor;
                ctx.fillText(node.char, node.centerX + cL.x, node.centerY + cL.y);

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(executionLoop);
        };

        animationFrameId.current = requestAnimationFrame(executionLoop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [coreColor, inertialColor, tensionColor, fontSize, influenceRadius, impactForce]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        // Compute scale shifts dynamically across fluid layouts
        const scaleX = dimensions.width / rect.width;
        const scaleY = dimensions.height / rect.height;

        mouseRef.current.x = (e.clientX - rect.left) * scaleX;
        mouseRef.current.y = (e.clientY - rect.top) * scaleY;
        mouseRef.current.active = true;
    };

    return (
        <div className="w-full @container flex justify-center text-center">
            <div className={`flex w-full items-center justify-center text-center select-none overflow-visible ${className}`}>
                <canvas
                    ref={canvasRef}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => {
                        mouseRef.current.active = false;
                        prevMouseRef.current = { x: -1000, y: -1000 };
                    }}
                    style={{
                        width: "100%",
                        maxWidth: `${dimensions.width}px`,
                        height: "auto",
                    }}
                    className="block touch-none cursor-none mx-auto"
                />
            </div>
        </div>
    );
};

export default PhaseShellText;