export const glowCardProps = [
	{
		title: "Optics & Animation",
		props: [
			{
				name: "animationSpeed",
				type: "number",
				defaultValue: "4",
				description: "Duration of the orbital glow animation in seconds.",
			},
			{
				name: "glowBlur",
				type: "number",
				defaultValue: "6",
				description: "Blur intensity factor for the shadow glow.",
			},
			{
				name: "glowOpacity",
				type: "number",
				defaultValue: "1.0",
				description: "Transparency of the bloom effect (0.0 to 1.0).",
			},
			{
				name: "glowScale",
				type: "number",
				defaultValue: "1.5",
				description: "Size multiplier for the bloom on hover.",
			},
		],
	},
	{
		title: "Geometry & Color",
		props: [
			{
				name: "borderRadius",
				type: "string",
				defaultValue: "'2rem'",
				description: "CSS border-radius value for the card.",
			},
			{
				name: "borderWidth",
				type: "number",
				defaultValue: "3",
				description: "Thickness of the gradient border in pixels.",
			},
			{
				name: "baseColor",
				type: "string",
				defaultValue: "'hsl(260deg 100% 3%)'",
				description: "Background color of the card body.",
			},
		],
	},
];

export const componentCode = `"use client";

import React from "react";
import "./GlowCard.css";

export const GlowCard = ({ 
  children, 
  animationSpeed = 4,
  glowBlur = 6,
  glowOpacity = 1,
  glowScale = 1.5,
  borderRadius = "2rem",
  borderWidth = 3,
  baseColor = "hsl(260deg 100% 3%)"
}) => {
  const style = {
    "--animation-speed": \`\${animationSpeed}s\`,
    "--glow-blur": glowBlur,
    "--glow-opacity": glowOpacity,
    "--glow-scale": glowScale,
    "--card-radius": borderRadius,
    "--border-width": \`\${borderWidth}px\`,
    "--card-color": baseColor,
  };

  return (
    <div className="glow-card-container" role="button" style={style}>
      <span className="glow-card-glow" />
      <div className="glow-card-content">
        {children}
      </div>
    </div>
  );
};`;

export const creditsData = [
	{
		title: "Inspiration",
		items: [
			{
				name: "LukyVj",
				role: "Original Design",
				url: "https://lucasbonomi.com",
			},
		],
	},
];
