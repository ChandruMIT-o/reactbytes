export const fractalProps = [
	{
		title: "Color & Intensity",
		props: [
			{
				name: "colorStart",
				type: "string | [r, g, b]",
				defaultValue: "'#0D1526'",
				description: "Background base color of the fractal.",
			},
			{
				name: "colorEnd",
				type: "string | [r, g, b]",
				defaultValue: "'#3366CC'",
				description: "Glow/Detail color of the fractal.",
			},
			{
				name: "intensity",
				type: "number",
				defaultValue: "1.0",
				description: "Overall brightness multiplier for the WebGL output.",
			},
		],
	},
	{
		title: "Dynamics & Math",
		props: [
			{
				name: "speed",
				type: "number",
				defaultValue: "0.15",
				description: "Speed of the fractal's metamorphic animation.",
			},
			{
				name: "zoom",
				type: "number",
				defaultValue: "2.8",
				description: "Zoom level into the Julia set coordinates.",
			},
			{
				name: "morphRange",
				type: "number",
				defaultValue: "0.1",
				description: "Amplitude of the complex constant 'c' transformation.",
			},
			{
				name: "maxIterations",
				type: "number",
				defaultValue: "100",
				description: "Iteration depth. Higher values reveal more detail but increase GPU load.",
			},
		],
	},
	{
		title: "Interactivity",
		props: [
			{
				name: "enableParallax",
				type: "boolean",
				defaultValue: "true",
				description: "Enables mouse-tracking parallax shift for a 3D feeling.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef } from "react";

export interface FractalBackgroundProps {
    colorStart?: [number, number, number] | string; 
    colorEnd?: [number, number, number] | string;   
    speed?: number;
    zoom?: number;
    maxIterations?: number;
    morphRange?: number;
    enableParallax?: boolean;
    intensity?: number;
    className?: string;
    children?: React.ReactNode;
}

export const FractalBackground: React.FC<FractalBackgroundProps> = ({
    colorStart = "#0D1526",
    colorEnd = "#3366CC",
    speed = 0.15,
    zoom = 2.8,
    maxIterations = 100,
    morphRange = 0.1,
    enableParallax = true,
    intensity = 1.0,
    className = "",
    children,
}) => {
    // ... complete implementation ...
};

export default FractalBackground;`;

export const creditsData = [
	{
		title: "Mathematical Foundations",
		items: [
			{
				name: "Julia Set Explorer",
				role: "Fractal Math",
				url: "https://en.wikipedia.org/wiki/Julia_set",
			},
		],
	},
	{
		title: "Project",
		items: [
			{
				name: "React Bytes",
				role: "Component Collection",
				url: "https://reactbytes.dev",
			},
		],
	},
];
