export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "baseColor",
				type: "string",
				defaultValue: "'#1e1e1e'",
				description: "Base color of the smoke effect (hex format).",
			},
			{
				name: "speed",
				type: "number",
				defaultValue: "0.08",
				description: "Speed at which the smoke evolves over time.",
			},
			{
				name: "turbulence",
				type: "number",
				defaultValue: "0.5",
				description: "Amount of noise and distortion applied to the smoke.",
			},
			{
				name: "milk",
				type: "number",
				defaultValue: "0.4",
				description: "How 'milky' or white the brighter parts of the smoke should be.",
			},
		],
	},
	{
		title: "Performance & Interaction Props",
		props: [
			{
				name: "eco",
				type: "boolean",
				defaultValue: "true",
				description: "Enables eco mode which dynamically changes resolution to save power.",
			},
			{
				name: "dprCeil",
				type: "number",
				defaultValue: "1.25",
				description: "Maximum device pixel ratio to allow for rendering.",
			},
			{
				name: "maxFPS",
				type: "number",
				defaultValue: "50",
				description: "Maximum frames per second cap.",
			},
			{
				name: "mouseInteraction",
				type: "number",
				defaultValue: "0.5",
				description: "Strength of the mouse pushing effect on the smoke.",
			},
		],
	},
];

export const creditsData = [
	{
		title: "Component Source",
		items: [
			{
				name: "React Bytes",
				role: "Collection",
				url: "https://reactbytes.dev",
			},
		],
	},
	{
		title: "Technologies",
		items: [
			{
				name: "WebGL 2",
				role: "Graphics API",
				url: "https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API",
			},
		],
	},
];
