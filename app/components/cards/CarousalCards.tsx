"use client";
import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Fingerprint, Network, Cpu, Sliders, Code, LucideIcon } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface MissionFacet {
	id: string;
	icon: LucideIcon;
	label: string;
	headline: string;
	description: string;
	accent: string;
}

const missionFacets: MissionFacet[] = [
	{
		id: "presets",
		icon: Sparkles,
		label: "Customization",
		headline: "Built-In Presets & Variants.",
		description:
			"Toggle between beautifully curated presets and highly adaptable variants. Find the exact match for your project's aesthetic in seconds.",
		accent: "var(--rb-accent-1)",
	},
	{
		id: "modular",
		icon: Cpu,
		label: "Architecture",
		headline: "Fully Modular Freedom.",
		description:
			"Not a monolithic dependency. Install strictly what you need. Copy and paste the raw code or use our CLI to avoid bundle bloat.",
		accent: "var(--rb-accent-3)",
	},
	{
		id: "agnostic",
		icon: Network,
		label: "Integration",
		headline: "Stack Agnostic Design.",
		description:
			"React, TypeScript, Tailwind, or plain CSS — our components adapt to your workflow, giving you full ownership and visibility.",
		accent: "var(--rb-accent-2)",
	},
	{
		id: "ownership",
		icon: Code,
		label: "Open Source",
		headline: "Free For Everyone.",
		description:
			"Complete visibility and ownership of the code. Not just a black-box import—every byte is yours to modify, extend, and use freely.",
		accent: "var(--rb-accent-1)",
	},
	{
		id: "props",
		icon: Sliders,
		label: "Control",
		headline: "Prop-First Approach.",
		description:
			"Thoughtful props allow you to fine-tune the look, feel, and behavior of every component without ever touching the source code.",
		accent: "var(--rb-accent-3)",
	},
];

export const CarousalCards = () => {
	const [activeFacet, setActiveFacet] = useState(missionFacets[0]);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const currentIndex = missionFacets.findIndex((f) => f.id === activeFacet.id);
	const nextFacet = missionFacets[(currentIndex + 1) % missionFacets.length];

	// Auto-play logic
	useEffect(() => {
		const interval = setInterval(() => {
			setActiveFacet((prev) => {
				const idx = missionFacets.findIndex((f) => f.id === prev.id);
				const nextIdx = (idx + 1) % missionFacets.length;
				return missionFacets[nextIdx];
			});
		}, 5000);

		return () => clearInterval(interval);
	}, [activeFacet.id]);

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		setMousePosition({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		});
	};

	const springTransition = {
		type: "spring",
		stiffness: 260,
		damping: 30,
		mass: 1,
	} as const;

	const containerVariants: Variants = {
		initial: { opacity: 0, x: 10, filter: "blur(8px)" },
		animate: {
			opacity: 1,
			x: 0,
			filter: "blur(0px)",
			transition: {
				duration: 0.6,
				ease: [0.19, 1, 0.22, 1],
				staggerChildren: 0.08,
				delayChildren: 0.1
			}
		},
		exit: {
			opacity: 0,
			x: -10,
			filter: "blur(8px)",
			transition: {
				duration: 0.4,
				ease: "easeInOut"
			}
		},
	};

	const itemVariants: Variants = {
		initial: { opacity: 0, y: 15, filter: "blur(4px)" },
		animate: { opacity: 1, y: 0, filter: "blur(0px)" },
		exit: { opacity: 0, y: -10 },
	};

	return (
		<div className="w-full py-8 font-sans selection:bg-rb-accent-2 selection:text-rb-neutral-2">
			<style jsx>{`
				.noise-overlay {
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
				}
			`}</style>

			<div className="bg-rb-neutral-3 p-1 rounded-[24px] w-full relative">
				<div
					ref={containerRef}
					onMouseMove={handleMouseMove}
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					className="bg-rb-neutral-1 rounded-[18px] w-full overflow-hidden border border-rb-neutral-4 relative group/inner shadow-2xl"
				>
					{/* Grain/Noise Overlay */}
					<div className="absolute inset-0 noise-overlay opacity-[0.02] pointer-events-none z-50 mix-blend-overlay" />

					{/* Interactive Spotlight Gradient */}
					<motion.div
						className="pointer-events-none absolute inset-0 z-0"
						animate={{
							opacity: isHovering ? 1 : 0,
							background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, color-mix(in srgb, var(--rb-accent-3), transparent 96%), transparent 40%)`,
						}}
						transition={{ duration: 0.7, ease: "easeInOut" }}
					/>

					{/* Subtle Background Grid */}
					<motion.div
						className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay"
						style={{
							backgroundImage: "radial-gradient(var(--rb-accent-2) 1px, transparent 1px)",
							backgroundSize: "40px 40px",
							maskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
							WebkitMaskImage: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 100%)`,
						}}
					/>

					<div className="relative z-10 grid grid-cols-1 md:grid-cols-12 min-h-[500px]">
						{/* Left Navigation Sidebar */}
						<div className="md:col-span-4 border-b md:border-b-0 md:border-r border-rb-neutral-4 p-3 md:p-4 flex flex-col bg-rb-neutral-2/60 backdrop-blur-md">
							<div className="mb-8 mt-4 px-4 flex items-center gap-3">
								<div className="w-9 h-9 rounded-lg bg-rb-neutral-3 flex items-center justify-center border border-rb-neutral-4 text-rb-accent-3/80">
									<Fingerprint size={18} strokeWidth={2} />
								</div>
								<span className="text-[10px] font-bold uppercase tracking-[0.25em] text-rb-accent-1/30">Organization</span>
							</div>

							<div className="space-y-1 max-h-[440px] overflow-y-auto scrollbar-none pr-1">
								{missionFacets.map((facet) => {
									const isActive = activeFacet.id === facet.id;
									const isNext = nextFacet.id === facet.id;
									return (
										<motion.button
											key={facet.id}
											onClick={() => setActiveFacet(facet)}
											className="relative w-full text-left px-5 py-3.5 rounded-xl transition-all duration-300 flex items-center gap-4 group/btn overflow-hidden"
											style={{
												color: isActive ? "var(--rb-neutral-2)" : "var(--rb-accent-2)",
											}}
											whileHover="hover"
										>
											<span className="relative z-40 flex items-center gap-4">
												<facet.icon
													size={16}
													className={`transition-colors duration-300 ${isActive ? "text-rb-neutral-2" : "text-rb-accent-3/50 group-hover/btn:text-rb-accent-1"}`}
												/>
												<span
													className={`text-[14px] font-medium tracking-tight transition-colors duration-300 ${isActive ? "text-rb-neutral-2" : "text-rb-accent-1/50 group-hover/btn:text-rb-accent-1"}`}
												>
													{facet.label}
												</span>
											</span>

											{isActive && (
												<motion.div
													layoutId="active-facet-pill"
													className="absolute inset-0 bg-rb-accent-1 z-10"
													transition={springTransition}
												/>
											)}

											{isActive && (
												<motion.div
													layoutId="active-facet-trail"
													className="absolute inset-0 bg-rb-accent-2/10 z-0 scale-105"
													transition={{ ...springTransition, damping: 25 }}
												/>
											)}

											{isNext && (
												<motion.div
													key={`next-progress-${facet.id}`}
													initial={{ scaleX: 0 }}
													animate={{ scaleX: 1 }}
													transition={{ duration: 5, ease: "linear" }}
													className="absolute inset-x-0 bottom-0 h-[2px] bg-rb-accent-3 z-20 origin-left pointer-events-none"
												/>
											)}

											{!isActive && (
												<motion.div
													className="absolute inset-0 z-0 pointer-events-none rounded-xl"
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
						</div>

						{/* Right Content Area */}
						<div className="md:col-span-8 p-10 md:p-16 flex items-center relative overflow-hidden bg-gradient-to-br from-rb-neutral-1 to-rb-neutral-2/30">
							{/* Soft Dynamic Glow */}
							<AnimatePresence mode="wait">
								<motion.div
									key={`glow-${activeFacet.id}`}
									className="absolute -top-32 -left-32 w-80 h-80 blur-[120px] opacity-10 pointer-events-none"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 0.15, scale: 1 }}
									exit={{ opacity: 0, scale: 1.2 }}
									style={{ backgroundColor: activeFacet.accent }}
									transition={{ duration: 1 }}
								/>
							</AnimatePresence>

							<AnimatePresence mode="wait">
								<motion.div
									key={activeFacet.id}
									initial="initial"
									animate="animate"
									exit="exit"
									variants={containerVariants}
									className="relative w-full max-w-2xl z-10"
								>
									<motion.div
										variants={itemVariants}
										className="w-12 h-[2px] mb-10 overflow-hidden rounded-full bg-rb-neutral-4"
									>
										<motion.div
											className="h-full w-full"
											animate={{ backgroundColor: activeFacet.accent }}
											transition={{ duration: 0.5 }}
										/>
									</motion.div>

									<motion.h2
										variants={itemVariants}
										className="text-2xl md:text-4xl lg:text-5xl font-bold text-rb-accent-1 mb-6 leading-[1.15] tracking-tight font-sans"
									>
										{activeFacet.headline.split(" ").map((word, i) => (
											<span key={i} className="inline-block mr-2.5">
												{word === "Modular" || word === "Free" || word === "Agnostic" ? (
													<span className="text-transparent bg-clip-text bg-gradient-to-br from-rb-accent-1 to-rb-accent-3">
														{word}
													</span>
												) : (
													word
												)}
											</span>
										))}
									</motion.h2>

									<motion.p
										variants={itemVariants}
										className="text-[17px] text-rb-accent-1/50 leading-relaxed font-light font-sans max-w-lg mb-12"
									>
										{activeFacet.description}
									</motion.p>

									<motion.div variants={itemVariants}>
										<button className="group relative flex items-center gap-3 px-7 py-3 rounded-full bg-rb-neutral-3 text-rb-accent-1 hover:text-rb-accent-3 border border-rb-neutral-4 transition-all duration-500 text-[13px] font-semibold tracking-wide uppercase">
											Explore System
											<div className="w-4 h-[1px] bg-current transition-all duration-500 group-hover:w-7" />
										</button>
									</motion.div>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CarousalCards;
