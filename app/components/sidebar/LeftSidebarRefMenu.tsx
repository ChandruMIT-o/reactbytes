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
	{ id: "a11y", label: "Accessibility" },
	{ id: "mcp", label: "MCP" },
	{ id: "troubleshoot", label: "Troubleshooting" },
	{ id: "changelog", label: "Changelog" },
];

export default function LeftSidebarRefMenu() {
	const [activeItem, setActiveItem] = useState<string>("intro");
	const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

	const activeIndex = navItems.findIndex((item) => item.id === activeItem);
	const hoverIndex = navItems.findIndex((item) => item.id === hoveredItemId);

	const [itemWidths, setItemWidths] = useState<{ [key: string]: number }>({});
	const handleRef = (id: string, el: HTMLButtonElement | null) => {
		if (el) {
			const width = el.getBoundingClientRect().width;
			if (itemWidths[id] !== width) {
				setItemWidths((prev) => ({ ...prev, [id]: width }));
			}
		}
	};

	const activeWidth = itemWidths[activeItem] || 150;
	const hoverWidth = hoveredItemId ? itemWidths[hoveredItemId] || 150 : 0;

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
					className="relative z-10 flex flex-col"
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
									top: hoverIndex * 39,
									width: hoverWidth,
								}}
								exit={{ opacity: 0 }}
								transition={springConfig}
								className="absolute left-[18px] h-[38px] bg-rb-neutral-2 rounded-xl z-0 pointer-events-none"
							>
								{/* Hover Pill (Left) */}
								<motion.div
									className="absolute left-[10px] top-[9px] w-[6px] h-[20px] rounded-full bg-rb-accent-1/30 scale-y-75"
									transition={springConfig}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					<motion.div
						animate={{
							top: activeIndex * 39,
							width: activeWidth,
						}}
						transition={springConfig}
						className="absolute left-[18px] h-[38px] bg-rb-neutral-2 rounded-xl z-10 pointer-events-none"
					>
						{/* Active Pill (Left) */}
						<div className="absolute left-[10px] top-[9px] w-[6px] h-[20px] rounded-full bg-rb-accent-1 scale-y-85" />
						{/* Active Dot (Right) */}
						<div className="absolute right-[5px] top-[16px] w-[6px] h-[6px] rounded-full bg-rb-accent-1" />
					</motion.div>

					{/* LAYER 3: Navigation Buttons (Top Layer) */}
					{navItems.map((item) => {
						const isActive = activeItem === item.id;
						const isHovered = hoveredItemId === item.id;

						return (
							<button
								key={item.id}
								ref={(el) => handleRef(item.id, el)}
								onMouseEnter={() => setHoveredItemId(item.id)}
								onClick={() => setActiveItem(item.id)}
								className="group relative ml-[18px] flex h-[38px] w-fit items-center justify-between pl-[10px] pr-[35px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-rb-accent-1 active:scale-[0.98] transition-all cursor-pointer duration-200 z-20"
							>
								<div className="flex items-center gap-5 z-10">
									<div className="w-[6px] invisible" />

									<motion.span
										className="text-[16px] tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
										animate={{
											color: isActive
												? "var(--rb-accent-1)"
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
