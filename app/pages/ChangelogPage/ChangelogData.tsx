export type ChangeType = "feature" | "fix" | "breaking" | "chore";

export interface ChangeItem {
	type: ChangeType;
	description: string;
}

export interface ChangelogEntry {
	version: string;
	date: string;
	description?: string;
	changes: ChangeItem[];
}

export const changelogData: ChangelogEntry[] = [
	{
		version: "v1.1.0",
		date: "April 18, 2026",
		description: "A major update introducing premium components and interactive layouts.",
		changes: [
			{ type: "feature", description: "Added new high-fidelity CarousalCards component." },
			{ type: "feature", description: "Introduced advanced FractalBackground page with WebGL shaders." },
			{ type: "fix", description: "Fixed hydration mismatch in RootLayout caused by browser extensions." },
			{ type: "breaking", description: "Replaced old static MissionComparator with scroll-driven interactions." },
		],
	},
	{
		version: "v1.0.5",
		date: "April 17, 2026",
		description: "UI enhancements and bug fixes.",
		changes: [
			{ type: "fix", description: "Fixed dice reroll UI animation flow." },
			{ type: "chore", description: "Updated combobox chevron controls." },
			{ type: "feature", description: "Added Credits footer to introduction page." },
		],
	},
	{
		version: "v1.0.0",
		date: "April 15, 2026",
		description: "Initial beta release of React Bytes.",
		changes: [
			{ type: "feature", description: "Core component library released with modern UI components." },
			{ type: "feature", description: "Initial setup of design systems and aesthetic tokens." },
		],
	},
];
