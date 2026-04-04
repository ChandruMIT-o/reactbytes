import React from "react";

// --- Types ---

export interface CreditItem {
	/** The name of the person, project, or asset */
	name: string;
	/** What they did or what the project is (e.g., "UI Icons", "Lead Developer") */
	role: string;
	/** Optional link to their website, GitHub, or license */
	url?: string;
}

export interface CreditSection {
	/** Section title (e.g., "Core Team", "Open Source Libraries") */
	title: string;
	/** Array of credits for this section */
	items: CreditItem[];
}

export interface CreditsProps {
	/** The structured data for the credits */
	data: CreditSection[];
	/** Main heading for the component */
	mainTitle?: string;
	/** Optional subtitle or thank you message */
	subtitle?: string;
	/** Optional class to override the container wrapper */
	className?: string;
}

// --- Component ---

export const Credits: React.FC<CreditsProps> = ({
	data,
	mainTitle = "Credits",
	subtitle = "Made with ❤️ by these amazing contributors.",
	className = "",
}) => {
	return (
		<div className={`w-full font-sans ${className}`}>
			{/* Header Section */}
			<div className="mb-8 pl-4">
				<h2 className="text-xl font-bold tracking-tight text-rb-accent-1 mb-1">
					{mainTitle}
				</h2>
				<p className="text-rb-accent-2/40 text-sm">{subtitle}</p>
			</div>

			{/* Credits Content */}
			<div className="space-y-8">
				{data.map((section, index) => (
					<div key={index} className="flex flex-col gap-4">
						{/* Section Title */}
						<div className="pl-4 flex items-center gap-3">
							<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rb-accent-2/30">
								{section.title}
							</span>
							<div className="h-[1px] flex-1 bg-rb-neutral-4" />
						</div>

						{/* Pills Flexbox */}
						<div className="flex flex-wrap gap-2 px-4">
							{section.items.map((item, itemIndex) => {
								const content = (
									<div className="flex items-center gap-2">
										<span className="font-semibold">
											{item.name}
										</span>
										<span className="opacity-40 text-xs font-normal">
											{item.role}
										</span>
									</div>
								);

								if (item.url) {
									return (
										<a
											key={itemIndex}
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className="px-4 py-2 rounded-full bg-rb-neutral-3 text-rb-accent-2 border border-rb-neutral-4 text-sm transition-all duration-300 hover:bg-rb-accent-1 hover:text-rb-neutral-2 hover:scale-105 active:scale-95"
										>
											{content}
										</a>
									);
								}

								return (
									<div
										key={itemIndex}
										className="px-4 py-2 rounded-full bg-rb-neutral-3 text-rb-accent-2 border border-rb-neutral-4 text-sm"
									>
										{content}
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{/* Minimal Footer */}
			<div className="mt-12 pl-4 text-[10px] uppercase tracking-widest text-rb-accent-2/20">
				© {new Date().getFullYear()} React Bytes · Built for performance
			</div>
		</div>
	);
};

export default Credits;
