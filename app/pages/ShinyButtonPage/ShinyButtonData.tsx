export const shinyButtonProps = [
	{
		title: "Core Config",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'Get unlimited access'",
				description: "Label displayed on the button.",
			},
			{
				name: "duration",
				type: "number",
				defaultValue: "3",
				description: "Rotation speed of the border gradient in seconds.",
			},
		],
	},
	{
		title: "Aesthetics",
		props: [
			{
				name: "highlightColor",
				type: "string",
				defaultValue: "'rgb(0, 0, 255)'",
				description: "Primary color for the border and shimmer energy.",
			},
			{
				name: "highlightSubtleColor",
				type: "string",
				defaultValue: "'#8484ff'",
				description: "Secondary color used for high-intensity highlights on hover.",
			},
			{
				name: "baseColor",
				type: "string",
				defaultValue: "'#000000'",
				description: "Background color of the button.",
			},
			{
				name: "textColor",
				type: "string",
				defaultValue: "'#ffffff'",
				description: "Color of the label text.",
			},
		],
	},
];

export const componentCode = `"use client";

import React from "react";
import { motion } from "framer-motion";
import "./ShinyButton.css";

export const ShinyButton = ({ 
  text = "Get unlimited access",
  highlightColor = "rgb(0, 0, 255)",
  duration = 3
}) => {
  const style = {
    "--shiny-cta-highlight": highlightColor,
    "--duration": \`\${duration}s\`,
  };

  return (
    <motion.button 
      className="shiny-cta" 
      style={style}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span>{text}</span>
    </motion.button>
  );
};`;

export const creditsData = [
	{
		title: "Inspiration",
		items: [
			{
				name: "Ryan Mulligan",
				role: "Article Reference",
				url: "https://ryanmulligan.dev/blog/css-property-new-style/",
			},
		],
	},
];
