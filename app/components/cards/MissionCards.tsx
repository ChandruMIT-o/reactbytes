"use client";
import React, { useState, useRef, useEffect } from "react";
import { Target, Rocket, ShieldCheck, Heart, Zap, LucideIcon, Globe } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

interface MissionPoint {
	id: string;
	icon: LucideIcon;
	label: string;
	headline: string;
	description: string;
	accent: string;
}

const missionPoints: MissionPoint[] = [
	{
		id: "goal",
		icon: Target,
		label: "The Goal",
		headline: "Straightforward & Impactful.",
		description:
			"Our objective is to equip developers with flexible, visually stunning, and entirely free components that push web projects to the next level.",
		accent: "var(--rb-accent-2)",
	},
	{
		id: "vision",
		icon: Rocket,
		label: "The Vision",
		headline: "Pushing the Boundaries.",
		description:
			"We engineer tools that help your project stand out with bold creativity and unique interactivity, making the professional web more accessible.",
		accent: "var(--rb-accent-3)",
	},
	{
		id: "foundation",
		icon: ShieldCheck,
		label: "Foundation",
		headline: "Developer-Centric Roots.",
		description:
			"Built on a foundation of real-world developer experience, ensuring every byte you use is meaningful, adaptable, and highly performant.",
		accent: "var(--rb-accent-1)",
	},
	{
		id: "community",
		icon: Heart,
		label: "Commitment",
		headline: "Free & Open Forever.",
		description:
			"React Bytes is a commitment to the open-source community. No paywalls or hidden costs—just pure, modular freedom for everyone.",
		accent: "var(--rb-accent-2)",
	},
];

export const MissionCards = () => {
	const [activePoint, setActivePoint] = useState(missionPoints[0]);
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [isHovering, setIsHovering] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const currentIndex = missionPoints.findIndex((p) => p.id === activePoint.id);
	const nextPoint = missionPoints[(currentIndex + 1) % missionPoints.length];

	// Auto-play logic
	useEffect(() => {
		const interval = setInterval(() => {
			setActivePoint((prev) => {
				const idx = missionPoints.findIndex((p) => p.id === prev.id);
				const nextIdx = (idx + 1) % missionPoints.length;
				return missionPoints[nextIdx];
			});
		}, 6000);

		return () => clearInterval(interval);
	}, [activePoint.id]);

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
		initial: { opacity: 0, scale: 0.98, filter: "blur(10px)" },
		animate: { 
			opacity: 1, 
			scale: 1, 
			filter: "blur(0px)",
			transition: {
				duration: 0.7,
				ease: [0.19, 1, 0.22, 1],
				staggerChildren: 0.1,
				delayChildren: 0.15
			}
		},
		exit: { 
			opacity: 0, 
			scale: 1.02, 
			filter: "blur(10px)",
			transition: {
				duration: 0.5,
				ease: "easeInOut"
			}
		},
	};

	const itemVariants: Variants = {
		initial: { opacity: 0, y: 20, filter: "blur(5px)" },
		animate: { opacity: 1, y: 0, filter: "blur(0px)" },
		exit: { opacity: 0, y: -15 },
	};

	return (
		<div className="w-full py-6 font-sans selection:bg-rb-accent-3 selection:text-rb-neutral-2">
			<style jsx>{`
				.noise-overlay {
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
				}
			`}</style>

			<div className="bg-rb-neutral-3/50 p-1 rounded-[28px] w-full relative">
				<div
					ref={containerRef}
					onMouseMove={handleMouseMove}
					onMouseEnter={() => setIsHovering(true)}
					onMouseLeave={() => setIsHovering(false)}
					className="bg-rb-neutral-1 rounded-[24px] w-full overflow-hidden border border-rb-neutral-4/60 relative group/inner shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
				>
					{/* Grain/Noise Overlay */}
					<div className="absolute inset-0 noise-overlay opacity-[0.03] pointer-events-none z-50 mix-blend-overlay" />

					{/* Interactive Spotlight Gradient */}
					<motion.div
						className="pointer-events-none absolute inset-0 z-0"
						animate={{
							opacity: isHovering ? 1 : 0,
							background: `radial-gradient(1000px circle at ${mousePosition.x}px ${mousePosition.y}px, color-mix(in srgb, var(--rb-accent-2), transparent 97%), transparent 50%)`,
						}}
						transition={{ duration: 1, ease: "easeInOut" }}
					/>

					<div className="relative z-10 flex flex-col md:flex-row min-h-[480px]">
						{/* Horizontal Navigation for Mobile, Sidebar for Desktop */}
						<div className="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-rb-neutral-4/50 p-4 md:p-6 flex flex-col bg-rb-neutral-2/40 backdrop-blur-xl">
							<div className="mb-8 mt-2 px-3 flex items-center gap-3">
								<div className="w-8 h-8 rounded-lg bg-rb-accent-2/10 flex items-center justify-center border border-rb-accent-2/20 text-rb-accent-2">
									<Globe size={16} strokeWidth={2.5} />
								</div>
								<span className="text-[11px] font-bold uppercase tracking-[0.3em] text-rb-accent-1/40">Mission</span>
							</div>

							<div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
								{missionPoints.map((point) => {
									const isActive = activePoint.id === point.id;
									const isNext = nextPoint.id === point.id;
									return (
										<motion.button
											key={point.id}
											onClick={() => setActivePoint(point)}
											className="relative flex-shrink-0 md:flex-shrink-1 text-left px-5 py-4 rounded-2xl transition-all duration-500 flex items-center gap-4 group/btn overflow-hidden"
											style={{
												color: isActive ? "var(--rb-neutral-2)" : "var(--rb-accent-2)",
											}}
										>
											<span className="relative z-40 flex items-center gap-4 whitespace-nowrap">
												<point.icon
													size={18}
													className={`transition-all duration-500 ${isActive ? "text-rb-neutral-2 scale-110" : "text-rb-accent-2/40 group-hover/btn:text-rb-accent-2"}`}
												/>
												<span
													className={`text-[14px] font-semibold tracking-tight transition-colors duration-500 ${isActive ? "text-rb-neutral-2" : "text-rb-accent-1/60 group-hover/btn:text-rb-accent-1"}`}
												>
													{point.label}
												</span>
											</span>

											{isActive && (
												<motion.div
													layoutId="active-point-pill"
													className="absolute inset-0 bg-rb-accent-1 z-10"
													transition={springTransition}
												/>
											)}

											{isActive && (
												<motion.div
													layoutId="active-point-trail"
													className="absolute inset-0 bg-rb-accent-1/20 z-0 scale-[1.08] blur-sm"
													transition={{ ...springTransition, damping: 25 }}
												/>
											)}

											{isNext && (
												<motion.div
													key={`mission-progress-${point.id}`}
													initial={{ scaleX: 0 }}
													animate={{ scaleX: 1 }}
													transition={{ duration: 6, ease: "linear" }}
													className="absolute inset-x-0 bottom-0 h-[3px] bg-rb-accent-2 z-20 origin-left pointer-events-none"
												/>
											)}
										</motion.button>
									);
								})}
							</div>
						</div>

						{/* Right Content Area */}
						<div className="flex-1 p-8 md:p-14 lg:p-20 flex items-center relative overflow-hidden bg-gradient-to-tr from-rb-neutral-1 via-rb-neutral-1 to-rb-neutral-2/20">
							{/* Background Decoration */}
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none">
								<svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
									<circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" className="text-rb-accent-2" />
									<circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" className="text-rb-accent-1 opacity-50" />
									<path d="M50 0V100M0 50H100" stroke="currentColor" strokeWidth="0.2" className="text-rb-accent-3" />
								</svg>
							</div>

							<AnimatePresence mode="wait">
								<motion.div
									key={activePoint.id}
									initial="initial"
									animate="animate"
									exit="exit"
									variants={containerVariants}
									className="relative w-full z-10"
								>
									<motion.div
										variants={itemVariants}
										className="flex items-center gap-4 mb-10"
									>
										<div 
											className="w-10 h-10 rounded-xl flex items-center justify-center border border-rb-neutral-4 bg-rb-neutral-2/50 backdrop-blur-sm"
											style={{ color: activePoint.accent }}
										>
											<activePoint.icon size={20} />
										</div>
										<div className="h-[1px] flex-1 bg-rb-neutral-4" />
									</motion.div>

									<motion.h2 
										variants={itemVariants}
										className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-rb-accent-1 mb-6 leading-tight tracking-tight"
									>
										{activePoint.headline.split(" ").map((word, i) => (
											<span key={i} className="inline-block mr-3 overflow-hidden">
												<motion.span 
													className="inline-block"
													initial={{ y: "100%" }}
													animate={{ y: 0 }}
													transition={{ duration: 0.8, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
												>
													{word === "Impactful." || word === "Boundaries." || word === "Forever." ? (
														<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-2 to-rb-accent-3">
															{word}
														</span>
													) : (
														word
													)}
												</motion.span>
											</span>
										))}
									</motion.h2>

									<motion.p
										variants={itemVariants}
										className="text-[17px] md:text-[19px] text-rb-accent-1/60 leading-relaxed font-normal max-w-xl mb-12"
									>
										{activePoint.description}
									</motion.p>

									<motion.div variants={itemVariants} className="flex gap-4">
										<button 
											className="px-8 py-3.5 rounded-2xl bg-rb-accent-1 text-rb-neutral-1 text-[13px] font-bold tracking-wider uppercase flex items-center gap-3 hover:bg-rb-accent-2 transition-all duration-300"
										>
											Join Community
											<Zap size={14} />
										</button>
									</motion.div>
								</motion.div>
							</AnimatePresence>

							{/* Animated Glow */}
							<AnimatePresence mode="wait">
								<motion.div
									key={`bg-glow-${activePoint.id}`}
									className="absolute bottom-0 right-0 w-96 h-96 blur-[140px] opacity-20 pointer-events-none"
									initial={{ opacity: 0, scale: 0.5, x: 100, y: 100 }}
									animate={{ opacity: 0.25, scale: 1, x: 0, y: 0 }}
									exit={{ opacity: 0, scale: 1.5, x: 50, y: 50 }}
									style={{ backgroundColor: activePoint.accent }}
									transition={{ duration: 1.5, ease: "circOut" }}
								/>
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MissionCards;
