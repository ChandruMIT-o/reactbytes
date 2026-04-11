export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "colors",
				type: "string[]",
				defaultValue: "['#f15a22', '#0a0e27', '#40e0d0', '#f15a22', '#0a0e27', '#40e0d0']",
				description: "Array of 6 hex colors that define the main gradient shades.",
			},
			{
				name: "speed",
				type: "number",
				defaultValue: "1.2",
				description: "Speed of the swirling background animation.",
			},
			{
				name: "intensity",
				type: "number",
				defaultValue: "1.8",
				description: "Intensity of the color bleeding and brightness.",
			},
			{
				name: "darkNavy",
				type: "string",
				defaultValue: "'#0a0e27'",
				description: "Base/background color tone replacing absolute darkness.",
			},
		],
	},
    {
		title: "Advanced Props",
		props: [
            {
				name: "grainIntensity",
				type: "number",
				defaultValue: "0.08",
				description: "Amount of film grain overlaid across the gradients.",
			},
            {
				name: "gradientSize",
				type: "number",
				defaultValue: "1.0",
				description: "Radius modifier for the circular color blobs.",
			},
            {
				name: "gradientCount",
				type: "number",
				defaultValue: "6.0",
				description: "Amount of gradient blobs interacting (max 12).",
			},
            {
				name: "color1Weight",
				type: "number",
				defaultValue: "1.0",
				description: "Weighting bias applied to alternating bright colors.",
			},
            {
				name: "color2Weight",
				type: "number",
				defaultValue: "1.0",
				description: "Weighting bias applied to alternating dark colors.",
			},
		],
	},
];

export const creditsData = [
	{
		title: "Component Origin",
		items: [
			{
				name: "React Bytes",
				role: "Implementation",
				url: "https://reactbytes.dev",
			},
            {
				name: "Made By Beings",
				role: "Concept",
				url: "https://madebybeings.com",
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
