export const componentDocsData = [
	{
		title: "Primary Props",
		props: [
			{
				name: "variant",
				type: "string",
				defaultValue: "'default'",
				description: "Defines the visual style of the component.",
			},
			{
				name: "onAction",
				type: "event",
				required: true,
				description:
					"Callback fired when the user interacts with the primary element.",
			},
		],
	},
	{
		title: "Secondary Props",
		props: [
			{
				name: "isDisabled",
				type: "boolean",
				defaultValue: "false",
				description:
					"If true, prevents user interaction and applies muted styles.",
			},
			{
				name: "className",
				type: "string",
				description:
					"Optional CSS classes to override default styling.",
			},
		],
	},
];

export const creditsData = [
	{
		title: "Core Team",
		items: [
			{
				name: "Jane Doe",
				role: "Lead Engineer",
				url: "https://github.com",
			},
			{ name: "John Smith", role: "Product Designer" },
		],
	},
	{
		title: "Open Source Libraries",
		items: [
			{
				name: "React",
				role: "UI Framework",
				url: "https://react.dev",
			},
			{
				name: "Tailwind CSS",
				role: "Styling",
				url: "https://tailwindcss.com",
			},
			{
				name: "Lucide",
				role: "Iconography",
				url: "https://lucide.dev",
			},
			{
				name: "Framer Motion",
				role: "Animations",
				url: "https://framer.com/motion",
			},
		],
	},
	{
		title: "Special Thanks",
		items: [{ name: "Coffee", role: "Fueling late night commits" }],
	},
];
