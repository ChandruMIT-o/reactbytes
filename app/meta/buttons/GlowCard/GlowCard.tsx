"use client";

import React from "react";
import "./GlowCard.css";

interface GlowCardProps {
    children?: React.ReactNode;
    className?: string;
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
}

export const GlowCard: React.FC<GlowCardProps> = ({
    children,
    className = "",
    animationSpeed = 4,
    glowBlur = 6,
    glowOpacity = 1,
    glowScale = 1.5,
    borderRadius = "2rem",
    borderWidth = 3,
    baseColor = "hsl(260deg 100% 3%)",
}) => {
    const style = {
        "--animation-speed": `${animationSpeed}s`,
        "--glow-blur": glowBlur,
        "--glow-opacity": glowOpacity,
        "--glow-scale": glowScale,
        "--card-radius": borderRadius,
        "--border-width": `${borderWidth}px`,
        "--card-color": baseColor,
    } as React.CSSProperties;

    return (
        <div 
            className={`glow-card-container ${className}`} 
            role="button"
            style={style}
        >
            <span className="glow-card-glow" />
            <div className="glow-card-content">
                {children}
            </div>
        </div>
    );
};

export default GlowCard;
