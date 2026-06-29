"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScaffoldNode {
    char: string;
    centerX: number;      // Home layout coordinate X
    centerY: number;      // Home layout coordinate Y
    width: number;        // Character geometry width
    x: number;            // Kinetic displacement X
    y: number;            // Kinetic displacement Y
    vx: number;           // Kinetic velocity X
    vy: number;           // Kinetic velocity Y
    progress: number;     // Core lifecycle timeline progress (0 = gone, 1 = fully stable)
    enterDelay: number;   // Stagger offset for entrance scheduling
    exitDelay: number;    // Stagger offset for exit scheduling
}

export interface ScaffoldTextProps {
    /** The text string to animate */
    text?: string;
    /** Current state machine lifecycle hook */
    animationState?: "enter" | "stable" | "exit";
    /** Font size scale in pixels - drives structural container bounds */
    fontSize?: number;
    /** Primary typography color */
    color?: string;
    /** Tech scaffolding color (wires, frames, coordinate readouts) */
    scaffoldColor?: string;
    /** Transition speed factor of the entrance/exit layout tracking */
    transitionSpeed?: number;
    /** Boundary interaction radius for cursor proximity */
    influenceRadius?: number;
    /** Extra element utility CSS layout classes */
    className?: string;
}

export const ScaffoldText: React.FC<ScaffoldTextProps> = ({
    text = "SCAFFOLD",
    animationState = "enter",
    fontSize = 80,
    color = "#ffffff",
    scaffoldColor = "rgba(14, 165, 233, 0.4)",
    transitionSpeed = 0.04,
    influenceRadius = 65,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nodesRef = useRef<ScaffoldNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, active: false });
    const animationFrameId = useRef<number | null>(null);

    // Added a state matrix to retain derived container targets across fluid screen adjustments
    const [dimensions, setDimensions] = useState({ width: 1, height: 1 });

    const paddingX = fontSize * 0.6;
    const paddingY = fontSize * 0.5;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const fontStyle = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
        ctx.font = fontStyle;

        const characters = text.split("");
        let currentXOffset = 0;
        const metrics = characters.map((char) => {
            const w = ctx.measureText(char).width;
            const res = { char, width: w, startX: currentXOffset };
            currentXOffset += w;
            return res;
        });

        const totalWidth = currentXOffset + paddingX * 2;
        const totalHeight = fontSize + paddingY * 2;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        // Set state to update structural max-widths dynamically
        setDimensions({ width: totalWidth, height: totalHeight });

        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;

        ctx.scale(dpr, dpr);
        ctx.font = fontStyle;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        const centerY = totalHeight / 2;
        const count = characters.length;

        nodesRef.current = metrics.map((m, index) => {
            const nodeCenterX = paddingX + m.startX + m.width / 2;
            return {
                char: m.char,
                centerX: nodeCenterX,
                centerY: centerY,
                width: m.width,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                progress: animationState === "stable" ? 1 : 0,
                enterDelay: index * 6,
                exitDelay: (count - 1 - index) * 5,
            };
        });
    }, [text, fontSize, paddingX, paddingY, animationState]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frameCounter = 0;

        const loop = () => {
            frameCounter++;
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;
            const nodes = nodesRef.current;

            nodes.forEach((node) => {
                let targetProgress = node.progress;

                if (animationState === "enter" || animationState === "stable") {
                    if (frameCounter >= node.enterDelay) {
                        targetProgress = 1;
                    }
                } else if (animationState === "exit") {
                    if (frameCounter >= node.exitDelay) {
                        targetProgress = 0;
                    }
                }

                node.progress += (targetProgress - node.progress) * transitionSpeed;

                const dx = mouse.x - (node.centerX + node.x);
                const dy = mouse.y - (node.centerY + node.y);
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (mouse.active && distance < influenceRadius && node.progress > 0.85) {
                    const structuralStrain = (influenceRadius - distance) / influenceRadius;
                    const strainAngle = Math.atan2(dy, dx);

                    node.vx -= Math.cos(strainAngle) * structuralStrain * 1.8;
                    node.vy -= Math.sin(strainAngle) * structuralStrain * 1.8;
                }

                const stiffness = 0.07;
                const damping = 0.78;
                const springX = (0 - node.x) * stiffness;
                const springY = (0 - node.y) * stiffness;

                node.vx = (node.vx + springX) * damping;
                node.vy = (node.vy + springY) * damping;

                node.x += node.vx;
                node.y += node.vy;

                if (node.progress < 0.005) return;

                const renderX = node.centerX + node.x;
                const renderY = node.centerY + node.y;
                const halfW = node.width / 2 + 6;
                const halfH = fontSize / 2 + 6;

                ctx.save();
                ctx.strokeStyle = scaffoldColor;
                ctx.globalAlpha = node.progress * 0.35;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(renderX, 0);
                ctx.lineTo(renderX, height);
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.strokeStyle = scaffoldColor;
                ctx.lineWidth = 0.8;
                ctx.globalAlpha = node.progress;

                const currentBoxW = halfW * node.progress;
                ctx.strokeRect(renderX - currentBoxW, renderY - halfH, currentBoxW * 2, halfH * 2);

                if (node.progress > 0.9) {
                    ctx.fillStyle = scaffoldColor;
                    ctx.fillRect(renderX - halfW - 2, renderY - 2, 4, 4);
                    ctx.fillRect(renderX + halfW - 2, renderY - 2, 4, 4);
                }
                ctx.restore();

                ctx.save();
                ctx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                ctx.beginPath();
                const clipHeight = (halfH * 2) * node.progress;
                ctx.rect(renderX - halfW - 5, renderY - halfH, halfW * 2 + 10, clipHeight);
                ctx.clip();

                ctx.fillStyle = color;
                const slideOffsetY = (fontSize * 0.8) * (1 - node.progress);
                ctx.fillText(node.char, renderX, renderY + slideOffsetY);

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [animationState, color, scaffoldColor, fontSize, transitionSpeed, influenceRadius]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        // Normalize screen coordinates back into internal render coordinate spaces
        const scaleX = dimensions.width / rect.width;
        const scaleY = dimensions.height / rect.height;

        mouseRef.current = {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
            active: true,
        };
    };

    return (
        <div className="w-full @container flex justify-center text-center">
            <div className={`flex w-full items-center justify-center text-center select-none overflow-visible ${className}`}>
                <canvas
                    ref={canvasRef}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={() => {
                        mouseRef.current = { x: -1000, y: -1000, active: false };
                    }}
                    style={{
                        width: "100%",
                        maxWidth: `${dimensions.width}px`,
                        height: "auto",
                    }}
                    className="block touch-none cursor-crosshair mx-auto"
                />
            </div>
        </div>
    );
};

export default ScaffoldText;