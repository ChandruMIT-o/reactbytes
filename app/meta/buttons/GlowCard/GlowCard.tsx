"use client";

import React from "react";
import "./GlowCard.css";

interface GlowCardProps {
    children?: React.ReactNode;
    className?: string;
    title?: string;
    // Animation Controls
    animationSpeed?: number; // seconds
    // Shadow/Glow Controls
    glowBlur?: number;
    glowOpacity?: number;
    glowScale?: number;
    // Geometry
    borderRadius?: string;
    borderWidth?: number; // px
    // Colors
    baseColor?: string;
    /** Whether to force content text to uppercase */
    uppercase?: boolean;
    /** Custom padding for the card content container */
    padding?: string;
}

export const GlowCard: React.FC<GlowCardProps> = ({
    children,
    className = "",
    title = "Glow Card",
    animationSpeed = 4,
    glowBlur = 6,
    glowOpacity = 1,
    glowScale = 1.5,
    borderRadius = "2rem",
    borderWidth = 3,
    baseColor = "hsl(260deg 100% 3%)",
    uppercase = false,
    padding,
}) => {
    const style = {
        "--animation-speed": `${animationSpeed}s`,
        "--glow-blur": glowBlur,
        "--glow-opacity": glowOpacity,
        "--glow-scale": glowScale,
        "--card-radius": borderRadius,
        "--border-width": `${borderWidth}px`,
        "--card-color": baseColor,
        ...(padding !== undefined ? { "--card-padding": padding } : {}),
    } as React.CSSProperties;

    return (
        <div 
            className={`glow-card-container ${className}`} 
            role="button"
            style={style}
        >
            <span className="glow-card-glow" />
            <div className={`glow-card-content ${uppercase ? "uppercase" : ""}`}>
                {children || (
                    <div className="flex flex-col items-center pointer-events-none">
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-white text-black text-[10px] font-black rounded uppercase tracking-tighter">Premium</span>
                            <span className="text-white text-lg font-black tracking-widest uppercase">{title}</span>
                        </div>
                        <p className="text-white/30 text-[10px] mt-2 uppercase tracking-[0.3em] font-medium leading-none">Houdini Engine v1.0</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlowCard;
