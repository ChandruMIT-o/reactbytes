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
	{ id: "variable-weight", label: "Variable Weight" },
	{ id: "a11y", label: "Accessibility" },
	{ id: "mcp", label: "MCP" },
	{ id: "troubleshoot", label: "Troubleshooting" },
	{ id: "changelog", label: "Changelog" },
];

export default function LeftSidebarMenu({
	activeItem,
	setActiveItem,
	menuSubtitle,
	items = navItems,
}: {
	activeItem: string;
	setActiveItem: (id: string) => void;
	menuSubtitle: string;
	items?: NavItem[];
}) {
	const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const activeIndex = items.findIndex((item) => item.id === activeItem);
	const hoverIndex = items.findIndex((item) => item.id === hoveredItemId);

	// Spring configurations for premium feel
	const springConfig = {
		type: "spring",
		stiffness: 250,
		damping: 30,
	} as const;

	// Icon based on subtitle
	const getHeaderIcon = () => {
		if (menuSubtitle.toLowerCase().includes("text")) {
			return (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="w-[14px] h-[14px] text-rb-neutral-2"
				>
					<polyline points="4 7 4 4 20 4 20 7" />
					<line x1="9" y1="20" x2="15" y2="20" />
					<line x1="12" y1="4" x2="12" y2="20" />
				</svg>
			);
		}
		if (menuSubtitle.toLowerCase().includes("background")) {
			return (
				<svg
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="w-[14px] h-[14px] text-rb-neutral-2"
				>
					<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
					<line x1="3" y1="9" x2="21" y2="9" />
					<line x1="9" y1="21" x2="9" y2="9" />
				</svg>
			);
		}
		return (
			<svg
				viewBox="0 0 24 24"
				fill="currentColor"
				className="w-[16px] h-[16px] text-rb-neutral-2"
			>
				<path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.99 9a.75.75 0 1 1-1.06 1.06l-.46-.46V20.5a1.5 1.5 0 0 1-1.5 1.5H15a.75.75 0 0 1-.75-.75V15a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75v6.25c0 .414-.336.75-.75.75H5.5a1.5 1.5 0 0 1-1.5-1.5v-7.059l-.46.46a.75.75 0 1 1-1.06-1.06l8.99-9Z" />
			</svg>
		);
	};

	return (
		<div className="flex flex-col font-sans mb-2 w-[224px]">
			<div className="relative w-full flex flex-col">
				{/* Continuous Vertical Connecting Line */}
				<div className="absolute left-[29px] top-[14px] bottom-0 w-[2px] bg-rb-neutral-4 z-0 rounded-full" />

				{/* Section Header / Subtitle */}
				<div
					className="relative z-10 mb-2 ml-[18px] flex items-center justify-between group/header cursor-pointer"
					onClick={() => setIsCollapsed(!isCollapsed)}
				>
					<div className="flex items-center gap-3">
						<div className="w-[24px] h-[24px] bg-rb-accent-1 rounded-[8px] flex items-center justify-center shrink-0 group-hover/header:scale-105 transition-transform">
							{getHeaderIcon()}
						</div>
						<div className="text-xs text-rb-accent-1 font-semibold tracking-wide uppercase">
							{menuSubtitle}
						</div>
					</div>

					{/* Collapse Toggle Button */}
					<button className="mr-3 p-1 rounded-md hover:bg-rb-neutral-4 text-rb-font-secondary hover:text-rb-accent-1 transition-colors">
						<motion.div
							animate={{ rotate: isCollapsed ? 0 : 180 }}
							transition={springConfig}
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M6 9l6 6 6-6" />
							</svg>
						</motion.div>
					</button>
				</div>

				<motion.nav
					initial={false}
					animate={
						isCollapsed
							? {
									height: 0,
									opacity: 0,
									filter: "blur(16px)",
									marginBottom: 0,
									scale: 0.98,
								}
							: {
									height: "auto",
									opacity: 1,
									filter: "blur(0px)",
									marginBottom: 16,
									scale: 1,
								}
					}
					transition={{
						height: { type: "spring", stiffness: 220, damping: 24 },
						scale: { duration: 0.3 },
						opacity: { duration: 0.2 },
						filter: { duration: 0.3 },
					}}
					className="relative z-10 flex flex-col gap-[2px] overflow-hidden pt-2 origin-top"
					onMouseLeave={() => setHoveredItemId(null)}
				>
					<AnimatePresence mode="popLayout">
						{hoveredItemId && hoverIndex !== -1 && (
							<motion.div
								key="hover-indicator"
								layoutId="hover-pill"
								initial={{
									opacity: 0,
									scale: 0.95,
									x: -8,
									filter: "blur(4px)",
								}}
								animate={{
									opacity: isCollapsed ? 0 : 1,
									top: hoverIndex * 46 + 8,
									x: isCollapsed ? -20 : 0,
									scale: isCollapsed ? 0.95 : 1,
									filter: isCollapsed
										? "blur(12px)"
										: "blur(0px)",
								}}
								exit={{
									opacity: 0,
									scale: 0.98,
									x: 4,
									filter: "blur(8px)",
									transition: {
										duration: 0.2,
										ease: "easeOut",
									},
								}}
								transition={springConfig}
								className="absolute left-[16px] right-0 h-[44px] bg-rb-neutral-4/60 backdrop-blur-sm rounded-xl z-0 pointer-events-none"
							>
								{/* Hover Pill (Left) */}
								<motion.div
									initial={{ scaleY: 0, opacity: 0 }}
									animate={{ scaleY: 0.75, opacity: 1 }}
									className="absolute left-[10px] top-[10px] w-[6px] h-[24px] rounded-full bg-rb-accent-1"
									transition={{
										...springConfig,
										delay: 0.02,
									}}
								/>
								{/* Hover Dot (Right) */}
								<motion.div
									initial={{ scale: 0, opacity: 0 }}
									animate={{ scale: 0.75, opacity: 1 }}
									className="absolute right-[14px] top-[18.5px] w-[7px] h-[7px] rounded-full bg-rb-accent-1 shadow-[0_0_8px_rgba(255,255,255,0.3)]"
									transition={{
										...springConfig,
										delay: 0.04,
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>
					<AnimatePresence>
						{activeIndex !== -1 && (
							<motion.div
								key="active-indicator"
								initial={{ opacity: 0, scale: 0.98 }}
								animate={{
									top: activeIndex * 46 + 8,
									x: isCollapsed ? -20 : 0,
									opacity: isCollapsed ? 0 : 1,
									scale: isCollapsed ? 0.95 : 1,
									filter: isCollapsed
										? "blur(12px)"
										: "blur(0px)",
								}}
								exit={{ opacity: 0, scale: 1.02 }}
								transition={springConfig}
								className="absolute left-[18px] right-0 h-[44px] bg-rb-accent-1 rounded-xl z-10 pointer-events-none"
							>
								<motion.div
									initial={{ opacity: 0, x: -4 }}
									animate={{ opacity: 1, x: 0 }}
									className="absolute left-[10px] top-[10px] w-[6px] h-[24px] rounded-full bg-rb-neutral-2 scale-y-85"
									transition={{ ...springConfig, delay: 0.1 }}
								/>
								<motion.div
									initial={{ opacity: 0, scale: 0.5 }}
									animate={{ opacity: 1, scale: 1 }}
									className="absolute right-[14px] top-[18.5px] w-[7px] h-[7px] rounded-full bg-rb-neutral-2"
									transition={{
										...springConfig,
										delay: 0.15,
									}}
								/>
							</motion.div>
						)}
					</AnimatePresence>
					{/* LAYER 3: Navigation Buttons */}
					{items.map((item, index) => {
						const isActive = activeItem === item.id;
						const isHovered = hoveredItemId === item.id;

						return (
							<motion.button
								key={item.id}
								onMouseEnter={() => setHoveredItemId(item.id)}
								onClick={() => setActiveItem(item.id)}
								initial={false}
								animate={
									isCollapsed
										? {
												x: -20,
												opacity: 0,
												scale: 0.9,
												filter: "blur(10px)",
											}
										: {
												x: 0,
												opacity: 1,
												scale: 1,
												filter: "blur(0px)",
											}
								}
								transition={{
									...springConfig,
									delay: isCollapsed
										? (items.length - index - 1) * 0.015
										: index * 0.025,
									opacity: { duration: 0.2 },
								}}
								className="group relative ml-[18px] flex h-[44px] w-full items-center px-[10px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-rb-neutral-2 active:scale-[0.98] transition-all cursor-pointer duration-200 z-20"
							>
								<div className="flex items-center gap-5 z-10 w-full overflow-hidden">
									<div className="w-[6px] shrink-0 invisible" />
									<motion.span
										className="text-[16px] tracking-tight"
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
										}}
									>
										{item.label}
									</motion.span>
								</div>
							</motion.button>
						);
					})}
				</motion.nav>
			</div>
		</div>
	);
}
