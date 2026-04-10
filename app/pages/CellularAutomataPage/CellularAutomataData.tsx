export const fluxProps = [
	{
		title: "Aesthetics",
		props: [
			{
				name: "colorA",
				type: "string",
				defaultValue: "'#050812'",
				description: "Background/Void color stop.",
			},
			{
				name: "colorB",
				type: "string",
				defaultValue: "'#1e1b4b'",
				description: "Mid-tone energy color.",
			},
			{
				name: "colorC",
				type: "string",
				defaultValue: "'#818cf8'",
				description: "Highlight/Strand color.",
			},
			{
				name: "intensity",
				type: "number",
				defaultValue: "1.0",
				description: "Global brightness multiplier.",
			},
			{
				name: "opacity",
				type: "number",
				defaultValue: "1.0",
				description: "Transparency of the energy flow (0.0 to 1.0).",
			},
			{
				name: "vignetteIntensity",
				type: "number",
				defaultValue: "0.6",
				description: "Intensity of the dark edges (0.0 to 1.0).",
			},
			{
				name: "blurAmount",
				type: "number",
				defaultValue: "0",
				description: "CSS blur radius applied to the canvas.",
			},
		],
	},
	{
		title: "Fluid Dynamics",
		props: [
			{
				name: "speed",
				type: "number",
				defaultValue: "0.5",
				description: "Velocity of the energy flow.",
			},
			{
				name: "scale",
				type: "number",
				defaultValue: "1.0",
				description: "Zoom level of the noise patterns. Higher values show more detail.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useEffect, useRef, useMemo } from "react";

export interface EnergyFlowBackgroundProps {
    colorA?: string;
    colorB?: string;
    colorC?: string;
    speed?: number;
    intensity?: number;
    scale?: number;
    opacity?: number;
    vignetteIntensity?: number;
    blurAmount?: number;
}

export const FluxBackground: React.FC<EnergyFlowBackgroundProps> = ({
    colorA = "#050812",
    colorB = "#1e1b4b",
    colorC = "#818cf8",
    speed = 0.5,
    intensity = 1.0,
    scale = 1.0,
    opacity = 1.0,
    vignetteIntensity = 0.6,
    blurAmount = 0,
}) => {
    // ... high-performance multi-layered Simplex noise implementation ...
};

export default FluxBackground;`;

export const creditsData = [
	{
		title: "Mathematical Foundations",
		items: [
			{
				name: "Simplex Noise",
				role: "Algorithm",
				url: "https://en.wikipedia.org/wiki/Simplex_noise",
			},
			{
				name: "Ken Perlin",
				role: "Core Concept",
				url: "https://mrl.cs.nyu.edu/~perlin/",
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
