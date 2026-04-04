"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type TabItem = {
	id: string;
	label: string;
};

interface ButtonGroupProps {
	items: TabItem[];
	initialActive?: string;
	groupId?: string;
}

export default function ButtonGroup({
	items,
	initialActive,
	groupId = "default",
}: ButtonGroupProps) {
	const [activeTab, setActiveTab] = useState<string>(
		initialActive || items[0]?.id,
	);

	return (
		<div className="flex items-center gap-[6px] p-1 rounded-full">
			{items.map((tab) => {
				const isActive = activeTab === tab.id;

				return (
					<motion.button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						whileHover="hover"
						className="relative px-3 py-[7px] rounded-full text-[16px] font-medium tracking-tight outline-none transition-colors duration-300 z-10"
						style={{
							color: isActive ? "var(--rb-neutral-2)" : "var(--rb-accent-2)",
						}}
					>
						<span className="relative z-20">{tab.label}</span>

						{isActive && (
							<motion.div
								layoutId={`${groupId}-active-pill`}
								className="absolute inset-0 bg-gradient-to-tr from-rb-accent-1 to-rb-accent-2 rounded-full z-10"
								transition={{
									type: "spring",
									bounce: 0.3,
									duration: 0.6,
								}}
							/>
						)}

						{!isActive && (
							<motion.div
								className="absolute inset-0 rounded-full z-0 pointer-events-none"
								variants={{
									hover: { backgroundColor: "var(--rb-neutral-3)" },
								}}
								transition={{ duration: 0.2 }}
							/>
						)}
					</motion.button>
				);
			})}
		</div>
	);
}
