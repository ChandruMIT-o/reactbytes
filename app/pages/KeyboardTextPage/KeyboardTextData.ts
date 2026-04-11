export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "text",
				type: "string",
				defaultValue: "'KEYBOARD'",
				description: "The text sequence to apply the ghost typing effect to.",
			},
			{
				name: "yBounce",
				type: "number",
				defaultValue: "10",
				description: "The distance in pixels each character travels downward mimicking a key press.",
			},
			{
				name: "className",
				type: "string",
				defaultValue: "''",
				description: "Additional CSS classes, useful for modifying typography like tracking-tighter.",
			},
		],
	},
];

export const creditsData = [
	{
		title: "Concept Origin",
		items: [
			{
				name: "Juxtopposed",
				role: "Visual Concept",
				url: "https://x.com/juxtopposed/status/1691908961086378042?s=20",
			},
		],
	},
	{
		title: "Implementation Utilities",
		items: [
			{
				name: "Framer Motion",
				role: "Animation Layout",
				url: "https://www.framer.com/motion/",
			},
			{
				name: "React Bytes",
				role: "Collection",
				url: "https://reactbytes.dev",
			},
		],
	},
];
