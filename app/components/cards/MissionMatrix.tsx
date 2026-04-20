"use client";
import React, { useState } from "react";
import { Target, Rocket, ShieldCheck, Heart, ArrowUpRight, Sparkles, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MissionItem {
	id: string;
	icon: LucideIcon;
	title: string;
	subtitle: string;
	description: string;
	color: string;
	pattern: string;
}

const missionItems: MissionItem[] = [
	{
		id: "objective",
		icon: Target,
		title: "The Objective",
		subtitle: "Straightforward & Impactful",
		description: "Equipping developers with flexible, visually stunning, and entirely free components that push web projects to the next level.",
		color: "var(--rb-accent-1)",
		pattern: "radial-gradient(circle at 0% 0%, var(--rb-accent-1) 0%, transparent 50%)",
	},
	{
		id: "ambition",
		icon: Rocket,
		title: "The Ambition",
		subtitle: "Pushing the Boundaries",
		description: "Engineering tools that help your project stand out with bold creativity, unique interactivity, and performance first architecture.",
		color: "var(--rb-accent-2)",
		pattern: "radial-gradient(circle at 100% 0%, var(--rb-accent-2) 0%, transparent 50%)",
	},
	{
		id: "core",
		icon: ShieldCheck,
		title: "The Core",
		subtitle: "Developer-Centric Roots",
		description: "Built on real-world developer experience, ensuring every byte is meaningful, adaptable, and highly performant for any stack.",
		color: "var(--rb-accent-3)",
		pattern: "radial-gradient(circle at 0% 100%, var(--rb-accent-3) 0%, transparent 50%)",
	},
	{
		id: "vow",
		icon: Heart,
		title: "The Vow",
		subtitle: "Free & Open Forever",
		description: "A deep commitment to the open-source community. No paywalls, no black boxes—just pure, modular freedom for everyone.",
		color: "var(--rb-accent-1)",
		pattern: "radial-gradient(circle at 100% 100%, var(--rb-accent-1) 0%, transparent 50%)",
	},
];

export const MissionMatrix = () => {
	const [hoveredId, setHoveredId] = useState<string | null>(null);

	return (
		<div className="w-full py-12 font-sans">
			<style jsx>{`
				.glass-card {
					background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
					backdrop-filter: blur(10px);
				}
				.matrix-grid {
					display: grid;
					grid-template-columns: repeat(1, 1fr);
					gap: 1.5rem;
				}
				@media (min-width: 768px) {
					.matrix-grid {
						grid-template-columns: repeat(2, 1fr);
					}
				}
			`}</style>

			<div className="matrix-grid">
				{missionItems.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: -30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: index * 0.1 }}
						onMouseEnter={() => setHoveredId(item.id)}
						onMouseLeave={() => setHoveredId(null)}
						className="relative group perspective-1000"
					>
						{/* Background Glow */}
						<div 
							className="absolute -inset-1 rounded-[32px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-2xl"
							style={{ background: item.color }}
						/>

						<div className="relative h-full glass-card border border-rb-neutral-4/40 rounded-[28px] p-8 overflow-hidden flex flex-col justify-between transition-all duration-500 group-hover:border-rb-neutral-4 group-hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
							{/* Pattern Overlay */}
							<div 
								className="absolute inset-0 opacity-0 group-hover:opacity-[0.05] transition-opacity duration-700 pointer-events-none"
								style={{ background: item.pattern }}
							/>

							{/* Content Top */}
							<div className="relative z-10">
								<div className="flex justify-between items-start mb-10">
									<div 
										className="w-14 h-14 rounded-2xl flex items-center justify-center border border-rb-neutral-4/60 bg-rb-neutral-2/50 text-rb-accent-1 group-hover:scale-110 transition-transform duration-500 shadow-lg"
										style={{ color: item.color }}
									>
										<item.icon size={28} strokeWidth={1.5} />
									</div>
									<motion.div 
										animate={{ opacity: hoveredId === item.id ? 1 : 0.3, scale: hoveredId === item.id ? 1.1 : 1 }}
										className="text-rb-accent-3"
									>
										<ArrowUpRight size={24} />
									</motion.div>
								</div>

								<div className="space-y-3">
									<p className="text-[11px] font-bold uppercase tracking-[0.4em] text-rb-accent-2/40 group-hover:text-rb-accent-2/60 transition-colors duration-500">
										{item.subtitle}
									</p>
									<h3 className="text-2xl md:text-3xl font-bold text-rb-accent-1 leading-tight">
										{item.title}
									</h3>
								</div>
							</div>

							{/* Content Bottom */}
							<div className="relative z-10 mt-8">
								<p className="text-[15px] md:text-[16px] text-rb-accent-1/50 group-hover:text-rb-accent-1/70 transition-colors duration-500 leading-relaxed font-light">
									{item.description}
								</p>
								
								<div className="mt-8 flex items-center gap-2 overflow-hidden h-6">
									<AnimatePresence>
										{hoveredId === item.id && (
											<motion.div
												initial={{ x: -20, opacity: 0 }}
												animate={{ x: 0, opacity: 1 }}
												exit={{ x: 20, opacity: 0 }}
												className="flex items-center gap-2 text-[12px] font-bold text-rb-accent-1 tracking-widest uppercase cursor-pointer"
											>
												Learn More
												<div className="w-8 h-[1px] bg-rb-accent-1" />
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>

							{/* Decorative Number */}
							<span className="absolute bottom-[-20%] right-[-5%] text-[12rem] font-black text-rb-neutral-4/5 pointer-events-none select-none group-hover:text-rb-neutral-4/10 group-hover:bottom-[-10%] transition-all duration-700">
								0{index + 1}
							</span>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default MissionMatrix;
