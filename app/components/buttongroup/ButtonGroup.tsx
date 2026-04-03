"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TabItem = {
	id: string;
	label: string;
};

const tabs: TabItem[] = [
	{ id: "components", label: "Components" },
	{ id: "docs", label: "Docs" },
	{ id: "icons", label: "Icons" },
];

export default function ButtonGroup() {
	const [activeTab, setActiveTab] = useState<string>("components");

	return (
		<div className="flex items-center gap-[6px] p-1 rounded-full">
			{tabs.map((tab) => {
				const isActive = activeTab === tab.id;

				return (
					<motion.button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						whileHover="hover"
						className="relative px-3 py-[7px] rounded-full text-[16px] font-medium tracking-tight outline-none transition-colors duration-300 z-10"
						style={{
							color: isActive ? "#060010" : "#E6DFF1",
						}}
					>
						<span className="relative z-20">{tab.label}</span>

						{isActive && (
							<motion.div
								layoutId="active-pill"
								className="absolute inset-0 bg-gradient-to-tr from-[#F2EEE9] to-[#E5E0D8] rounded-full z-10"
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
									hover: { backgroundColor: "#181A1E" },
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
