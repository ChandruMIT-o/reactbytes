"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
	id: string;
	label: string;
};

const navItems: NavItem[] = [
	{ id: "intro", label: "Introduction" },
	{ id: "install", label: "Installation" },
	{ id: "blur-text", label: "Blur Text" },
	{ id: "magnetic-dots", label: "Magnetic Dot Mesh" },
	{ id: "fall-down", label: "Fall Down" },
	{ id: "blur-in", label: "Blur In" },
	{ id: "reveal-under", label: "Reveal Under" },
	{ id: "a11y", label: "Accessibility" },
	{ id: "mcp", label: "MCP" },
	{ id: "troubleshoot", label: "Troubleshooting" },
	{ id: "changelog", label: "Changelog" },
];

export default function LeftSidebarMenu({
	activeItem,
	setActiveItem,
}: {
	activeItem: string;
	setActiveItem: (id: string) => void;
}) {
	const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

	const activeIndex = navItems.findIndex((item) => item.id === activeItem);
	const hoverIndex = navItems.findIndex((item) => item.id === hoveredItemId);

	// Spring configurations for premium feel
	const springConfig = {
		type: "spring",
		stiffness: 250,
		damping: 30,
	} as const;

	return (
		<div className="min-h-screen flex font-sans">
			<div className="relative w-56 flex flex-col">
				{/* Continuous Vertical Connecting Line */}
				<div className="absolute left-[30px] top-[20px] bottom-8 w-[3px] bg-rb-neutral-4 z-0 rounded-full" />

				{/* Top Home Icon */}
				<div className="relative z-10 mb-3 ml-[20px]">
					<button className="w-6 h-6 bg-rb-accent-1 hover:bg-rb-accent-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:-rotate-6 active:scale-90 rounded-[7px] flex items-center justify-center">
						<svg
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-4 h-4 text-rb-neutral-2"
						>
							<path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.99 9a.75.75 0 1 1-1.06 1.06l-.46-.46V20.5a1.5 1.5 0 0 1-1.5 1.5H15a.75.75 0 0 1-.75-.75V15a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v6.25c0 .414-.336.75-.75.75H5.5a1.5 1.5 0 0 1-1.5-1.5v-7.059l-.46.46a.75.75 0 1 1-1.06-1.06l8.99-9Z" />
						</svg>
					</button>
				</div>

				{/* Navigation Items */}
				<nav
					className="relative z-10 flex flex-col gap-[1px]"
					onMouseLeave={() => setHoveredItemId(null)}
				>
					{/* LAYER 1: Hover Slider (Bottom) */}
					{/* Moves behind all buttons and the active indicator */}
					<AnimatePresence>
						{hoveredItemId && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{
									opacity: 1,
									top: hoverIndex * 45,
								}}
								exit={{ opacity: 0 }}
								transition={springConfig}
								className="absolute left-[18px] -right-[18px] h-[44px] bg-rb-neutral-4 rounded-xl z-0 pointer-events-none"
							>
								{/* Hover Pill (Left) */}
								<motion.div
									className="absolute left-[10px] top-[10px] w-[6px] h-[24px] rounded-full bg-rb-accent-1 scale-y-75"
									transition={springConfig}
								/>
								{/* Hover Dot (Right) */}
								<motion.div
									className="absolute right-[14px] top-[18.5px] w-[7px] h-[7px] rounded-full bg-rb-accent-1 scale-75"
									transition={springConfig}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					{/* LAYER 2: Active Selection Indicator (Above Hover Slider) */}
					{/* This is the primary indicator that slides upon selection */}
					<motion.div
						animate={{
							top: activeIndex * 45,
						}}
						transition={springConfig}
						className="absolute left-[18px] -right-[18px] h-[44px] bg-rb-accent-1 rounded-xl z-10 pointer-events-none"
					>
						{/* Active Pill (Left) */}
						<div className="absolute left-[10px] top-[10px] w-[6px] h-[24px] rounded-full bg-rb-neutral-2 scale-y-85" />
						{/* Active Dot (Right) */}
						<div className="absolute right-[14px] top-[18.5px] w-[7px] h-[7px] rounded-full bg-rb-neutral-2" />
					</motion.div>

					{/* LAYER 3: Navigation Buttons (Top Layer) */}
					{navItems.map((item) => {
						const isActive = activeItem === item.id;
						const isHovered = hoveredItemId === item.id;

						return (
							<button
								key={item.id}
								onMouseEnter={() => setHoveredItemId(item.id)}
								onClick={() => setActiveItem(item.id)}
								className="group relative ml-[18px] flex h-[44px] w-full items-center justify-between px-[10px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-rb-neutral-2 active:scale-[0.98] transition-all cursor-pointer duration-200 z-20"
							>
								<div className="flex items-center gap-5 z-10">
									{/* Spacer for Marker Alignment */}
									<div className="w-[6px] invisible" />

									<motion.span
										className="text-[16px] tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
										animate={{
											color: isActive
												? "var(--rb-neutral-2)"
												: isHovered
													? "var(--rb-accent-1)"
													: "var(--rb-font-secondary)",
											fontWeight:
												isActive || isHovered
													? 500
													: 400,
											x: isActive ? 3 : 0,
										}}
									>
										{item.label}
									</motion.span>
								</div>
							</button>
						);
					})}
				</nav>
			</div>
		</div>
	);
}
