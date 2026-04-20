"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import ButtonGroup, { TabItem } from "../../components/buttongroup/ButtonGroup";
import { changelogData } from "./ChangelogData";
import { GitCommit, Sparkles, Bug, AlertTriangle, PenTool } from "lucide-react";

const filterTabs: TabItem[] = [
	{ id: "all", label: "All Logs" },
	{ id: "feature", label: "Features" },
	{ id: "fix", label: "Fixes" },
	{ id: "breaking", label: "Breaking" },
];

const getTypeConfig = (type: string) => {
	switch (type) {
		case "feature":
			return { icon: <Sparkles size={14} />, class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
		case "fix":
			return { icon: <Bug size={14} />, class: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
		case "breaking":
			return { icon: <AlertTriangle size={14} />, class: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
		case "chore":
			return { icon: <PenTool size={14} />, class: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
		default:
			return { icon: <GitCommit size={14} />, class: "bg-rb-neutral-3 text-rb-accent-2 border-rb-neutral-4" };
	}
};

export const ChangelogPage = () => {
	const [activeFilter, setActiveFilter] = useState("all");

	const filteredData = useMemo(() => {
		if (activeFilter === "all") return changelogData;

		return changelogData.map((entry) => ({
			...entry,
			changes: entry.changes.filter((c) => c.type === activeFilter),
		})).filter((entry) => entry.changes.length > 0);
	}, [activeFilter]);

	return (
		<div className="flex flex-col gap-10 pb-20 font-sans">
			{/* Header Section */}
			<section id="changelog-header" className="relative flex flex-col items-center justify-center text-center pt-10 pb-6">
				<motion.div
					initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
					animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
					transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
					className="max-w-3xl px-6 flex flex-col items-center"
				>
					<HeaderText text="Changelog" option={3} />
					<div className="mt-4">
						<ParagraphText
							text="Stay up to date with the latest features, improvements, and bug fixes."
							option={4}
							className="text-center"
						/>
					</div>
				</motion.div>
			</section>

			{/* Filters */}
			<section id="changelog-filters" className="flex justify-center px-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: 0.2 }}
				>
					<ButtonGroup
						items={filterTabs}
						initialActive="all"
						onChange={(id) => setActiveFilter(id)}
					/>
				</motion.div>
			</section>

			{/* Timeline Section */}
			<section id="changelog-timeline" className="max-w-4xl mx-auto w-full px-4 pt-10">
				<div className="relative border-l border-rb-neutral-4/50 ml-4 md:ml-8 gap-12 flex flex-col">
					<AnimatePresence mode="popLayout">
						{filteredData.map((entry, index) => (
							<motion.div
								key={entry.version}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="relative pl-8 md:pl-12"
							>
								{/* Timeline node */}
								<div className="absolute left-[-5px] top-1.5 h-[9px] w-[9px] rounded-full bg-rb-accent-3 ring-4 ring-rb-neutral-4/30" />
								
								<div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
									<h2 className="text-2xl font-bold tracking-tight text-rb-accent-1">
										{entry.version}
									</h2>
									<span className="text-sm font-medium text-rb-accent-2/60">
										{entry.date}
									</span>
								</div>

								{entry.description && (
									<p className="text-rb-accent-2/80 mb-6 text-[15px] leading-relaxed max-w-2xl">
										{entry.description}
									</p>
								)}

								<ul className="flex flex-col gap-3">
									<AnimatePresence>
										{entry.changes.map((change, cIndex) => {
											const config = getTypeConfig(change.type);
											return (
												<motion.li
													layout
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, scale: 0.9 }}
													transition={{ duration: 0.2 }}
													key={`${entry.version}-${cIndex}`}
													className="flex items-start gap-3 bg-rb-neutral-3/30 border border-rb-neutral-4/40 p-4 rounded-2xl hover:bg-rb-neutral-3/50 transition-colors"
												>
													<span
														className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.class} uppercase tracking-wider mt-0.5`}
													>
														{config.icon}
														{change.type}
													</span>
													<span className="text-rb-accent-1 text-[15px] leading-relaxed">
														{change.description}
													</span>
												</motion.li>
											);
										})}
									</AnimatePresence>
								</ul>
							</motion.div>
						))}
					</AnimatePresence>
					
					{filteredData.length === 0 && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="pl-8 md:pl-12 py-10"
						>
							<p className="text-rb-accent-2/60 italic">No updates found for this category.</p>
						</motion.div>
					)}
				</div>
			</section>
		</div>
	);
};

export default ChangelogPage;
