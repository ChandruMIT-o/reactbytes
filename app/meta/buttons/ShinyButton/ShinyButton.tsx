"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "./ShinyButton.css";

interface ShinyButtonProps {
    text?: string;
    className?: string;
    // Important controlling props
    highlightColor?: string;
    highlightSubtleColor?: string;
    duration?: number;
    baseColor?: string;
    bgSubtleColor?: string;
    textColor?: string;
    onClick?: () => void;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
    text = "Get unlimited access",
    className = "",
    highlightColor = "rgb(0, 0, 255)",
    highlightSubtleColor = "#8484ff",
    duration = 3,
    baseColor = "#000000",
    bgSubtleColor = "#1a1818",
    textColor = "#ffffff",
    onClick,
}) => {
    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).CSS?.registerProperty) {
            const properties = [
                { name: "--gradient-angle", syntax: "<angle>", initialValue: "0deg" },
                { name: "--gradient-angle-offset", syntax: "<angle>", initialValue: "0deg" },
                { name: "--gradient-percent", syntax: "<percentage>", initialValue: "5%" },
                { name: "--gradient-shine", syntax: "<color>", initialValue: "white" },
            ];

            properties.forEach((prop) => {
                try {
                    (window as any).CSS.registerProperty({
                        ...prop,
                        inherits: false,
                    });
                } catch (e) {
                    // Property already registered
                }
            });
        }
    }, []);

    const style = {
        "--shiny-cta-highlight": highlightColor,
        "--shiny-cta-highlight-subtle": highlightSubtleColor,
        "--duration": `${duration}s`,
        "--shiny-cta-bg": baseColor,
        "--shiny-cta-bg-subtle": bgSubtleColor,
        "--shiny-cta-fg": textColor,
    } as React.CSSProperties;

    return (
        <motion.button
            className={`shiny-cta ${className}`}
            style={style}
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <span>{text}</span>
        </motion.button>
    );
};

export default ShinyButton;
