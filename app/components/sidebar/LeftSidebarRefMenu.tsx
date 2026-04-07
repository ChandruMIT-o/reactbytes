"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = {
	id: string;
	label: string;
};

interface LeftSidebarRefMenuProps {
	items?: NavItem[];
	activeId?: string;
	onItemClick?: (id: string) => void;
}

export default function LeftSidebarRefMenu({
	items = [],
	activeId,
	onItemClick,
}: LeftSidebarRefMenuProps) {
	const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

	const activeIndex = items.findIndex((item) => item.id === activeId);
	const hoverIndex = items.findIndex((item) => item.id === hoveredItemId);

	const [itemWidths, setItemWidths] = useState<{ [key: string]: number }>({});
	const handleRef = (id: string, el: HTMLButtonElement | null) => {
		if (el) {
			const width = el.getBoundingClientRect().width;
			if (itemWidths[id] !== width) {
				setItemWidths((prev) => ({ ...prev, [id]: width }));
			}
		}
	};

	const activeWidth = activeId ? itemWidths[activeId] || 150 : 0;
	const hoverWidth = hoveredItemId ? itemWidths[hoveredItemId] || 150 : 0;

	// Spring configurations for premium feel
	const springConfig = {
		type: "spring",
		stiffness: 250,
		damping: 30,
	} as const;

	return (
		<div className="flex font-sans w-56">
			<div className="relative w-56 flex flex-col">
				{/* Continuous Vertical Connecting Line */}
				<div className="absolute left-[29px] top-[14px] bottom-8 w-[2px] bg-rb-neutral-4 z-0 rounded-full" />

				<div className="relative z-10 mb-2 ml-[18px] flex items-center gap-3">
					<div className="w-[24px] h-[24px] bg-rb-accent-1 rounded-[6px] flex items-center justify-center shrink-0">
						<svg
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-[14px] h-[14px] text-rb-neutral-2"
						>
							<line x1="8" y1="6" x2="21" y2="6" />
							<line x1="8" y1="12" x2="21" y2="12" />
							<line x1="8" y1="18" x2="21" y2="18" />
							<line x1="3" y1="6" x2="3.01" y2="6" />
							<line x1="3" y1="12" x2="3.01" y2="12" />
							<line x1="3" y1="18" x2="3.01" y2="18" />
						</svg>
					</div>
					<div className="text-[12px] text-rb-accent-1 font-semibold tracking-wide uppercase">
						On this page
					</div>
				</div>

				{/* Navigation Items */}
				<nav
					className="relative z-10 flex flex-col pt-2"
					onMouseLeave={() => setHoveredItemId(null)}
				>
					{/* LAYER 1: Hover Slider (Bottom) */}
					<AnimatePresence>
						{hoveredItemId && hoverIndex !== -1 && (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{
									opacity: 1,
									top: hoverIndex * 46 + 8,
									width: hoverWidth,
								}}
								exit={{ opacity: 0 }}
								transition={springConfig}
								className="absolute left-[18px] h-[44px] bg-rb-neutral-2 rounded-xl z-0 pointer-events-none"
							>
								{/* Hover Pill (Left) */}
								<motion.div
									className="absolute left-[10px] top-[10px] w-[6px] h-[24px] rounded-full bg-rb-accent-1/30 scale-y-75"
									transition={springConfig}
								/>
							</motion.div>
						)}
					</AnimatePresence>

					{activeId && activeIndex !== -1 && (
						<motion.div
							animate={{
								top: activeIndex * 46 + 8,
								width: activeWidth,
							}}
							transition={springConfig}
							className="absolute left-[18px] h-[44px] bg-rb-neutral-2 rounded-xl z-10 pointer-events-none"
						>
							{/* Active Pill (Left) */}
							<div className="absolute left-[10px] top-[10px] w-[6px] h-[24px] rounded-full bg-rb-accent-1 scale-y-85" />
							{/* Active Dot (Right) */}
							<div className="absolute right-[5px] top-[19px] w-[6px] h-[6px] rounded-full bg-rb-accent-1" />
						</motion.div>
					)}

					{/* LAYER 3: Navigation Buttons (Top Layer) */}
					{items.map((item) => {
						const isActive = activeId === item.id;
						const isHovered = hoveredItemId === item.id;

						return (
							<button
								key={item.id}
								ref={(el) => handleRef(item.id, el)}
								onMouseEnter={() => setHoveredItemId(item.id)}
								onClick={() => onItemClick?.(item.id)}
								className="group relative ml-[18px] flex h-[44px] w-fit items-center justify-between pl-[10px] pr-[35px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-rb-accent-1 active:scale-[0.98] transition-all cursor-pointer duration-200 z-20"
							>
								<div className="flex items-center gap-5 z-10">
									<div className="w-[6px] invisible" />

									<motion.span
										className="text-[16px] tracking-tight transition-transform duration-300 ease-out group-hover:translate-x-[3px] text-left"
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
