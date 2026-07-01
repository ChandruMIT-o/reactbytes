import React from "react";

// --- Types ---

export interface CreditItem {
	/** The name of the person, project, or asset */
	name: string;
	/** What they did or what the project is (e.g., "UI Icons", "Lead Developer") */
	role: string;
	/** Optional link to their website, GitHub, or license */
	url?: string;
	/** Optional explicit avatar URL (falls back to GitHub dp or initials placeholder if empty) */
	avatar?: string;
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

// --- Helper for Fallback Initials Avatar ---
const InitialsAvatar = ({ name }: { name: string }) => {
	const initials = name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rb-neutral-4 text-[11px] font-bold tracking-wider text-rb-accent-1 border border-rb-accent-2/10">
			{initials || "?"}
		</div>
	);
};

// --- Helper to Extract GitHub Username ---
const getGitHubAvatar = (url?: string): string | null => {
	if (!url) return null;
	const match = url.match(/github\.com\/([^/]+)/i);
	return match ? `https://github.com/${match[1]}.png?size=64` : null;
};

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
						<div className="flex flex-wrap gap-3 px-4">
							{section.items.map((item, itemIndex) => {
								// Determine the best display picture option
								const avatarSrc = item.avatar || getGitHubAvatar(item.url);

								const sharedClasses = "inline-flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-rb-neutral-3 text-rb-accent-2 border border-rb-neutral-4 text-sm transition-all duration-300 min-w-0 max-w-full group";

								const content = (
									<>
										{/* Avatar Layer */}
										{avatarSrc ? (
											<img
												src={avatarSrc}
												alt={`${item.name}'s avatar`}
												className="h-8 w-8 rounded-full object-cover shrink-0 border border-rb-accent-2/10 bg-rb-neutral-4"
												loading="lazy"
												onError={(e) => {
													// Fallback if image fails to load
													e.currentTarget.style.display = "none";
													const sibling = e.currentTarget.nextElementSibling;
													if (sibling) sibling.classList.remove("hidden");
												}}
											/>
										) : null}

										{/* Fallback structural layout for broken images or missing URLs */}
										<div className={avatarSrc ? "hidden" : ""}>
											<InitialsAvatar name={item.name} />
										</div>

										{/* Details Layout */}
										<div className="flex flex-col min-w-0 leading-tight">
											<span className="font-semibold text-rb-accent-1 group-hover:text-inherit truncate">
												{item.name}
											</span>
											<span className="opacity-40 text-[11px] font-normal truncate">
												{item.role}
											</span>
										</div>
									</>
								);

								if (item.url) {
									return (
										<a
											key={itemIndex}
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className={`${sharedClasses} hover:bg-rb-accent-1 hover:text-rb-neutral-2 hover:scale-[1.03] active:scale-95 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-rb-accent-1/50`}
										>
											{content}
										</a>
									);
								}

								return (
									<span key={itemIndex} className={sharedClasses}>
										{content}
									</span>
								);
							})}
						</div>
					</div>
				))}
			</div>

			{/* Minimal Footer */}
			<div className="mt-12 pl-4 text-[10px] uppercase tracking-widest text-rb-accent-2/20">
				© {new Date().getFullYear()} React Bytes Beta · Built for performance
			</div>
		</div>
	);
};

export default Credits;