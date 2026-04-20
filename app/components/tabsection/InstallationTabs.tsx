"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const InstallationTabs = () => {
	const [activeTab, setActiveTab] = useState<"CLI" | "Manual">("CLI");
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const text =
			activeTab === "CLI"
				? "npm install react-bytes"
				: "Download from GitHub";
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const springConfig = {
		type: "spring",
		stiffness: 260,
		damping: 30,
	} as const;

	return (
		<div className="w-full max-w-4xl font-sans">
			{/* Tabs Row Wrapper */}
			<div className="bg-rb-neutral-3 p-1.5 pb-0 rounded-t-[20px] flex gap-1.5 w-max">
				{(["CLI", "Manual"] as const).map((tab) => (
					<motion.button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className="relative px-3 py-1.5 text-[16px] font-medium rounded-full outline-none transition-colors duration-300"
						style={{
							color:
								activeTab === tab
									? "var(--rb-neutral-2)"
									: "var(--rb-accent-2)",
						}}
						whileHover="hover"
					>
						<span className="relative z-10">{tab}</span>

						{activeTab === tab && (
							<motion.div
								layoutId="install-active-pill"
								className="absolute inset-0 bg-rb-accent-1 rounded-full z-0"
								transition={springConfig}
							/>
						)}

						{activeTab !== tab && (
							<motion.div
								className="absolute inset-0 rounded-full z-0"
								variants={{
									hover: {
										backgroundColor: "var(--rb-neutral-4)",
									},
								}}
								transition={{ duration: 0.2 }}
							/>
						)}
					</motion.button>
				))}
			</div>

			{/* Main Content Outer Wrapper (Acts as the thick grey border) */}
			<div className="bg-rb-neutral-3 p-1.5 rounded-[24px] rounded-tl-none w-full relative">
				{/* Actual Content Area */}
				<div className="bg-rb-neutral-1 rounded-[18px] w-full p-5 pr-14 text-rb-accent-2/60 font-mono text-[16px] border border-rb-neutral-4 min-h-[82px] flex flex-col justify-center overflow-hidden">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							{activeTab === "CLI" ? (
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-3">
										<span className="text-rb-accent-1 select-none">
											$
										</span>
										<span className="text-rb-accent-1">
											npm install react-bytes
										</span>
									</div>
								</div>
							) : (
								<div className="flex flex-col gap-2 font-sans">
									<p className="text-rb-accent-1">
										Clone the repository from GitHub:
									</p>
									<span className="text-rb-accent-1 font-mono text-sm">
										git clone https://github.com/ChandruMIT-o/reactbytes.git
									</span>
								</div>
							)}
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Copy Button */}
				<button
					onClick={handleCopy}
					className="absolute top-4 right-4 p-2.5 items-center justify-center rounded-full bg-rb-neutral-3 text-rb-accent-2/40 border border-rb-neutral-4 hover:text-rb-accent-2 hover:bg-rb-neutral-4 transition-all group"
					title="Copy to clipboard"
				>
					{copied ? (
						<Check size={14} className="text-emerald-500" />
					) : (
						<Copy
							size={14}
							className="group-hover:scale-110 transition-transform"
						/>
					)}
				</button>
			</div>
		</div>
	);
};

export default InstallationTabs;
