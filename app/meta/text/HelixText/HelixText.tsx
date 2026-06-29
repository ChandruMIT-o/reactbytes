"use client";

import React, { useEffect, useRef, useState } from "react";

interface HelixNode {
    char: string;
    centerX: number;   // Layout position X anchor
    centerY: number;   // Layout position Y anchor
    width: number;     // Measured letter width bounds
    angle: number;     // Rotation angle around vertical Y axis (in radians)
    vAngle: number;    // Angular velocity component
}

export interface HelixTextProps {
    /** The text string to mount onto the kinetic drums */
    text?: string;
    /** Font size in pixels - defines the tight bounding canvas constraints */
    fontSize?: number;
    /** Front-facing color of the solid typography */
    color?: string;
    /** Technical housing frame and structural indicator accent color */
    techColor?: string;
    /** Sensitivity multiplier of cursor velocity turning into rotational torque */
    torqueForce?: number;
    /** Proximity boundary radius for mouse interaction */
    influenceRadius?: number;
    /** Torsional spring stiffness forcing return to 0 degrees */
    stiffness?: number;
    /** Friction dampening factor to settle spinning momentum */
    damping?: number;
    /** Extra wrapper element styling classes */
    className?: string;
}

export const HelixText: React.FC<HelixTextProps> = ({
    text = "ROTOR",
    fontSize = 90,
    color = "#ffffff",
    techColor = "rgba(245, 158, 11, 0.45)",
    torqueForce = 0.55,
    influenceRadius = 70,
    stiffness = 0.05,
    damping = 0.81,
    className = "",
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const nodesRef = useRef<HelixNode[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, active: false });
    const prevMouseXRef = useRef(-1000);
    const animationFrameId = useRef<number | null>(null);

    // Track original pixel metrics across fluid viewport updates
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
        let currentXAccumulator = 0;
        const metrics = characters.map((char) => {
            const w = ctx.measureText(char).width;
            const res = { char, width: w, startX: currentXAccumulator };
            currentXAccumulator += w;
            return res;
        });

        const totalWidth = currentXAccumulator + paddingX * 2;
        const totalHeight = fontSize + paddingY * 2;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        // Sync calculations to component state
        setDimensions({ width: totalWidth, height: totalHeight });

        canvas.width = totalWidth * dpr;
        canvas.height = totalHeight * dpr;

        ctx.scale(dpr, dpr);
        ctx.font = fontStyle;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        const centerY = totalHeight / 2;

        nodesRef.current = metrics.map((m) => ({
            char: m.char,
            centerX: paddingX + m.startX + m.width / 2,
            centerY: centerY,
            width: m.width,
            angle: 0,
            vAngle: 0,
        }));
    }, [text, fontSize, paddingX, paddingY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const loop = () => {
            const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
            const width = canvas.width / dpr;
            const height = canvas.height / dpr;

            ctx.clearRect(0, 0, width, height);

            const mouse = mouseRef.current;

            if (mouse.active && prevMouseXRef.current !== -1000) {
                mouse.vx = (mouse.x - prevMouseXRef.current) * torqueForce;
            } else {
                mouse.vx *= 0.85;
            }
            prevMouseXRef.current = mouse.x;

            const nodes = nodesRef.current;

            nodes.forEach((node) => {
                const dx = mouse.x - node.centerX;
                const dy = mouse.y - node.centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (mouse.active && distance < influenceRadius) {
                    const dynamicProximity = (influenceRadius - distance) / influenceRadius;
                    node.vAngle += mouse.vx * dynamicProximity * 0.08;
                }

                const springReturnForce = (0 - node.angle) * stiffness;

                node.vAngle = (node.vAngle + springReturnForce) * damping;
                node.angle += node.vAngle;

                const halfFontH = fontSize * 0.45;
                const isSpinning = Math.abs(node.angle) > 0.01;

                if (isSpinning) {
                    ctx.save();
                    ctx.strokeStyle = techColor;
                    ctx.lineWidth = 0.7;

                    ctx.beginPath();
                    ctx.moveTo(node.centerX, node.centerY - halfFontH - 8);
                    ctx.lineTo(node.centerX, node.centerY + halfFontH + 8);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(node.centerX - 6, node.centerY - halfFontH - 8);
                    ctx.lineTo(node.centerX + 6, node.centerY - halfFontH - 8);
                    ctx.moveTo(node.centerX - 6, node.centerY + halfFontH + 8);
                    ctx.lineTo(node.centerX + 6, node.centerY + halfFontH + 8);
                    ctx.stroke();

                    if (Math.abs(node.angle) > 0.4) {
                        ctx.fillStyle = techColor;
                        ctx.font = `600 9px monospace`;
                        const degrees = Math.round((node.angle * (180 / Math.PI)) % 360);
                        ctx.fillText(`${degrees}°`, node.centerX, node.centerY + halfFontH + 20);
                    }
                    ctx.restore();
                }

                ctx.save();
                ctx.font = `900 ${fontSize}px "Space Grotesk", -apple-system, sans-serif`;
                ctx.textBaseline = "middle";
                ctx.textAlign = "center";

                const cosScale = Math.cos(node.angle);

                ctx.translate(node.centerX, node.centerY);
                ctx.scale(cosScale, 1);

                const isFrontFace = Math.cos(node.angle) > 0;

                if (isFrontFace) {
                    ctx.fillStyle = color;
                    ctx.fillText(node.char, 0, 0);
                } else {
                    ctx.strokeStyle = techColor;
                    ctx.lineWidth = 1;
                    ctx.strokeText(node.char, 0, 0);
                }

                ctx.restore();
            });

            animationFrameId.current = requestAnimationFrame(loop);
        };

        animationFrameId.current = requestAnimationFrame(loop);
        return () => {
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [color, techColor, fontSize, influenceRadius, torqueForce, stiffness, damping]);

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        // Map pointer offsets correctly based on the active scale metrics
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
                        prevMouseXRef.current = -1000;
                    }}
                    style={{
                        width: "100%",
                        maxWidth: `${dimensions.width}px`,
                        height: "auto",
                    }}
                    className="block touch-none cursor-ew-resize mx-auto"
                />
            </div>
        </div>
    );
};

export default HelixText;