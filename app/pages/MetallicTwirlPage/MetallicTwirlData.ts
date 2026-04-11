export const loaderProps = [
	{
		title: "Core Props",
		props: [
			{
				name: "speed",
				type: "number",
				defaultValue: "0.2",
				description: "Controls the temporal flow of the shader and overall speed of the rotation.",
			},
			{
				name: "zoom",
				type: "number",
				defaultValue: "15.0",
				description: "Sets the coordinate space scale, effectively zooming in or out of the pattern.",
			},
			{
				name: "symmetry",
				type: "number",
				defaultValue: "18.0",
				description: "Determines the number of folds or rotational repetitions in the kaleidoscope effect.",
			},
			{
				name: "amplitude",
				type: "number",
				defaultValue: "1.9",
				description: "The intensity/amplitude multiplier used when mapping the calculated color back to the palette.",
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
