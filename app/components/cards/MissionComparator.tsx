"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Target, Rocket, ShieldCheck, Heart, LucideIcon, Sparkles } from "lucide-react";

interface MissionStage {
	id: string;
	icon: LucideIcon;
	label: string;
	title: string;
	subtitle: string;
	description: string;
	image: string;
	accent: string;
}

const missionStages: MissionStage[] = [
	{
		id: "objective",
		icon: Target,
		label: "Stage 1",
		title: "The Objective",
		subtitle: "Straightforward & Impactful",
		description: "Equipping developers with flexible, visually stunning, and entirely free components that push web projects to the next level.",
		image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2072",
		accent: "var(--rb-accent-1)",
	},
	{
		id: "ambition",
		icon: Rocket,
		label: "Stage 2",
		title: "The Ambition",
		subtitle: "Pushing the Boundaries",
		description: "Engineering tools that help your project stand out with bold creativity, unique interactivity, and performance first architecture.",
		image: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=2070",
		accent: "var(--rb-accent-2)",
	},
	{
		id: "core",
		icon: ShieldCheck,
		label: "Stage 3",
		title: "The Core",
		subtitle: "Developer-Centric Roots",
		description: "Built on real-world developer experience, ensuring every byte is meaningful, adaptable, and highly performant for any stack.",
		image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070",
		accent: "var(--rb-accent-3)",
	},
	{
		id: "vow",
		icon: Heart,
		label: "Stage 4",
		title: "The Vow",
		subtitle: "Free & Open Forever",
		description: "A deep commitment to the open-source community. No paywalls, no black boxes—just pure, modular freedom for everyone.",
		image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070",
		accent: "var(--rb-accent-1)",
	},
];

export const MissionComparator = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [activeStage, setActiveStage] = useState(0);
	const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

	// Find the actual scrollable <main> ancestor on mount
	useEffect(() => {
		if (!containerRef.current) return;
		let el: HTMLElement | null = containerRef.current;
		while (el) {
			const style = getComputedStyle(el);
			const overflowY = style.overflowY;
			if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
				setScrollContainer(el);
				return;
			}
			el = el.parentElement;
		}
		// Fallback: no scrollable ancestor found, useScroll will default to window
		setScrollContainer(null);
	}, []);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start start", "end end"],
		...(scrollContainer ? { container: { current: scrollContainer } } : {}),
	});

	const { scrollYProgress: entryProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "start start"],
		...(scrollContainer ? { container: { current: scrollContainer } } : {}),
	});

	const { scrollYProgress: exitProgress } = useScroll({
		target: containerRef,
		offset: ["end end", "end start"],
		...(scrollContainer ? { container: { current: scrollContainer } } : {}),
	});

	// Smooth physics for all animations
	const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, mass: 0.5 });
	const smoothEntry = useSpring(entryProgress, { stiffness: 80, damping: 30 });
	const smoothExit = useSpring(exitProgress, { stiffness: 80, damping: 30 });

	const percentage = useTransform(smoothProgress, [0, 1], [0, 100]);
	const [displayPercentage, setDisplayPercentage] = useState(0);

	useEffect(() => {
		return percentage.onChange((v) => {
			setDisplayPercentage(Math.round(v));
			// Update active stage based on scroll progress
			if (v < 5) setActiveStage(0);
			else if (v < 33) setActiveStage(1);
			else if (v < 66) setActiveStage(2);
			else setActiveStage(3);
		});
	}, [percentage]);

	// Entry: 3D flip IN as component scrolls into view
	const entryRotateX = useTransform(smoothEntry, [0, 1], [18, 0]);
	const entryRotateY = useTransform(smoothEntry, [0, 1], [-12, 0]);
	const entryScale = useTransform(smoothEntry, [0, 1], [0.82, 1]);
	const entryOpacity = useTransform(smoothEntry, [0, 0.4], [0, 1]);
	const entryY = useTransform(smoothEntry, [0, 1], [80, 0]);

	// Exit: 3D flip OUT as component scrolls out of view
	const exitRotateX = useTransform(smoothExit, [0, 1], [0, -18]);
	const exitRotateY = useTransform(smoothExit, [0, 1], [0, 12]);
	const exitScale = useTransform(smoothExit, [0, 1], [1, 0.82]);
	const exitOpacity = useTransform(smoothExit, [0, 0.6, 1], [1, 1, 0]);
	const exitY = useTransform(smoothExit, [0, 1], [0, -80]);

	return (
		<div ref={containerRef} className="relative w-full h-[500vh] font-sans" style={{ position: "relative" }}>
			<style jsx>{`
				.noise-overlay {
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
				}
			`}</style>

			<div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
				{/* Background isolation — distinct from page bg */}
				<div className="absolute inset-0 bg-rb-neutral-1" />
				{/* Subtle top/bottom edge vignettes for visual separation */}
				<div 
					className="absolute inset-x-0 top-0 h-24 z-[130] pointer-events-none"
					style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
				/>
				<div 
					className="absolute inset-x-0 bottom-0 h-24 z-[130] pointer-events-none"
					style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
				/>

				<div className="absolute inset-0 noise-overlay opacity-[0.04] pointer-events-none z-0 mix-blend-overlay" />
				<div 
					className="absolute inset-0 opacity-[0.05]"
					style={{
						backgroundImage: "radial-gradient(var(--rb-accent-3) 1px, transparent 1px)",
						backgroundSize: "80px 80px",
					}}
				/>

				<motion.div 
					className="relative w-full max-w-6xl aspect-[16/10] md:aspect-[16/9] mx-4 rounded-[32px] overflow-hidden border border-rb-neutral-4/40 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)] bg-rb-neutral-3"
					style={{
						rotateX: entryRotateX,
						rotateY: entryRotateY,
						scale: entryScale,
						opacity: entryOpacity,
						y: entryY,
						transformStyle: "preserve-3d",
					}}
				>
					{/* Image Layers */}
					{missionStages.map((stage, index) => {
						const totalTransitions = missionStages.length - 1;
						const start = index / totalTransitions;
						const end = (index + 1) / totalTransitions;
						
						// Each layer (except the last base) peels from RIGHT TO LEFT
						// eslint-disable-next-line react-hooks/rules-of-hooks
						const peel = useTransform(smoothProgress, [start, end], ["0%", "100%"]);

						return (
							<motion.div
								key={stage.id}
								className="absolute inset-0 overflow-hidden"
								style={{
									zIndex: missionStages.length - index,
									clipPath: index === missionStages.length - 1 ? "none" : `inset(0 ${peel} 0 0)`
								}}
							>
								{/* Image Layer */}
								<div className="relative w-full h-full">
									<img src={stage.image} alt={stage.title} className="w-full h-full object-cover" />
									<div className="absolute inset-0 bg-gradient-to-t from-rb-neutral-1 via-rb-neutral-1/10 to-transparent" />
									<div className="absolute inset-0 bg-gradient-to-r from-rb-neutral-1/30 to-transparent" />
								</div>

								{/* Content Overlay */}
								<div className="absolute inset-0 flex flex-col justify-end p-10 md:p-20 z-10" style={{ transform: "translateZ(80px)" }}>
									<div className="max-w-2xl">
										<motion.div
											initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
											animate={activeStage === index ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0.1, y: 10, filter: "blur(2px)" }}
											transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
										>
											<div className="flex items-center gap-3 mb-4">
												<div className="px-3 py-1 rounded-full border border-white/10 bg-black/30 backdrop-blur-md">
													<span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
														{stage.label}
													</span>
												</div>
												<div className="h-[1px] w-8 bg-white/20" />
												<Sparkles size={14} style={{ color: stage.accent }} />
											</div>

											<h2 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
												{stage.title}
											</h2>
											
											<p className="text-[18px] text-white/50 leading-relaxed font-light font-sans max-w-lg">
												{stage.description}
											</p>
										</motion.div>
									</div>
								</div>
							</motion.div>
						);
					})}

					{/* Divider Line synchronized with top layer reveal */}
					{missionStages.slice(0, -1).map((_, index) => {
						const totalTransitions = missionStages.length - 1;
						const start = index / totalTransitions;
						const end = (index + 1) / totalTransitions;
						
						// eslint-disable-next-line react-hooks/rules-of-hooks
						const dividerPos = useTransform(smoothProgress, [start, end], ["0%", "100%"]);
						// eslint-disable-next-line react-hooks/rules-of-hooks
						const dividerOpacity = useTransform(smoothProgress, [start - 0.02, start, end, end + 0.02], [0, 1, 1, 0]);

						return (
							<motion.div
								key={`divider-${index}`}
								className="absolute inset-y-0 w-[4px] bg-white/50 z-[100] blur-[1px]"
								style={{ 
									right: dividerPos,
									opacity: dividerOpacity,
									transform: "translateZ(100px)",
									boxShadow: "0 0 30px rgba(255,255,255,0.8)",
									pointerEvents: "none"
								}}
							/>
						);
					})}

					{/* Top Navigation / Progress */}
					<div className="absolute top-10 left-10 z-[120]" style={{ transform: "translateZ(120px)" }}>
						<div className="flex items-center gap-6">
							{missionStages.map((_, i) => (
								<div key={i} className="flex flex-col gap-2 group cursor-pointer">
									<motion.div 
										animate={{ 
											width: activeStage === i ? 40 : 12,
											backgroundColor: activeStage === i ? "white" : "rgba(255,255,255,0.2)" 
										}}
										className="h-1 rounded-full transition-all duration-500"
									/>
									<span className={`text-[9px] font-bold uppercase tracking-widest transition-opacity duration-500 ${activeStage === i ? "opacity-100" : "opacity-0 group-hover:opacity-40"}`}>
										0{i + 1}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="absolute top-10 right-10 z-[120] text-right" style={{ transform: "translateZ(120px)" }}>
						<span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 block mb-1">Index</span>
						<span className="text-6xl font-mono font-bold text-white leading-none">
							{Math.min(activeStage + 1, 4)}
						</span>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default MissionComparator;
