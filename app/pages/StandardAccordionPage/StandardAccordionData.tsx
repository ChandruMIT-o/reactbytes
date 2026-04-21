export const accordionProps = [
	{
		title: "Physics Dynamics",
		props: [
			{
				name: "stiffness",
				type: "number",
				defaultValue: "250",
				description: "Stiffness of the spring. Higher values make the movement snappier.",
			},
			{
				name: "damping",
				type: "number",
				defaultValue: "30",
				description: "Strength of opposing force. Lower values create more 'bounce'.",
			},
			{
				name: "mass",
				type: "number",
				defaultValue: "1.0",
				description: "The weight of the moving object. Higher mass feels heavier and slower.",
			},
		],
	},
	{
		title: "Interactivity",
		props: [
			{
				name: "floatOffset",
				type: "number",
				defaultValue: "24",
				description: "The vertical distance items float away when an adjacent item expands.",
			},
			{
				name: "hoverScale",
				type: "number",
				defaultValue: "1.01",
				description: "The scale multiplier applied to items on hover.",
			},
			{
				name: "allowMultiple",
				type: "boolean",
				defaultValue: "false",
				description: "If true, multiple accordion items can be open simultaneously.",
			},
		],
	},
	{
		title: "Aesthetics",
		props: [
			{
				name: "backgroundColorOpen",
				type: "string",
				defaultValue: "'#181A1E'",
				description: "Background color of the accordion item when it is open.",
			},
			{
				name: "backgroundColorClosed",
				type: "string",
				defaultValue: "'#060010'",
				description: "Background color of the accordion item when it is closed.",
			},
			{
				name: "titleColor",
				type: "string",
				defaultValue: "'#FFFFFF'",
				description: "Color of the title and icon.",
			},
			{
				name: "contentColor",
				type: "string",
				defaultValue: "'#A1A1AA'",
				description: "Color of the expanded content text.",
			},
		],
	},
];

export const componentCode = `"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemData {
    id: string;
    iconPath: string;
    title: string;
    content: string;
}

interface StandardAccordionProps {
    data?: AccordionItemData[];
    backgroundColorOpen?: string;
    backgroundColorClosed?: string;
    floatOffset?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    titleColor?: string;
    contentColor?: string;
    hoverScale?: number;
    allowMultiple?: boolean;
}

export const StandardAccordion: React.FC<StandardAccordionProps> = ({
    data = [], // provide your data here
    backgroundColorOpen = "#181A1E",
    backgroundColorClosed = "#060010",
    floatOffset = 24,
    stiffness = 250,
    damping = 30,
    mass = 1,
    titleColor = "#FFFFFF",
    contentColor = "#A1A1AA",
    hoverScale = 1.01,
    allowMultiple = false,
}) => {
    const [activeIndices, setActiveIndices] = useState<number[]>([]);

    const handleToggle = (index: number) => {
        if (allowMultiple) {
            setActiveIndices(prev => 
                prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
            );
        } else {
            setActiveIndices(prev => prev.includes(index) ? [] : [index]);
        }
    };

    return (
        <div className="w-full max-w-[600px] mx-auto py-12 px-4 flex flex-col items-center">
            <div className="w-full relative">
                {data.map((item, index) => {
                    const isOpen = activeIndices.includes(index);
                    const isAnyOpen = activeIndices.length > 0;
                    
                    const closestOpenIndex = activeIndices.length > 0 
                        ? activeIndices.reduce((prev, curr) => 
                            Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev
                          )
                        : -1;
                    
                    const isBeforeOpen = closestOpenIndex !== -1 && index < closestOpenIndex;
                    const isAfterOpen = closestOpenIndex !== -1 && index > closestOpenIndex;

                    return (
                        <motion.div
                            key={item.id}
                            layout
                            initial={false}
                            animate={{
                                y: isBeforeOpen ? -floatOffset : isAfterOpen ? floatOffset : 0,
                                opacity: isOpen ? 1 : isAnyOpen ? 0.6 : 1,
                                backgroundColor: isOpen ? backgroundColorOpen : backgroundColorClosed,
                            }}
                            whileHover={{ scale: isOpen ? 1 : hoverScale }}
                            transition={{ type: "spring", stiffness, damping, mass }}
                            className="relative border border-white/10 -mt-[1px] first:mt-0 overflow-hidden cursor-pointer"
                            onClick={() => handleToggle(index)}
                        >
                            {/* ... Content ... */}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}`;

export const creditsData = [
	{
		title: "Inspiration",
		items: [
			{
				name: "Build Your Own Craft",
				role: "Design Concept",
				url: "https://buildyourowncraft.com",
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
