"use client";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export const MissionSimple = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	const springConfig = { damping: 25, stiffness: 150 };
	const softMouseX = useSpring(mouseX, springConfig);
	const softMouseY = useSpring(mouseY, springConfig);

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!containerRef.current) return;
		const { left, top } = containerRef.current.getBoundingClientRect();
		mouseX.set(e.clientX - left);
		mouseY.set(e.clientY - top);
	};

	const textVariant = {
		initial: { opacity: 0, y: -30, filter: "blur(12px)" },
		whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
		viewport: { once: true, margin: "-100px" },
	};

	return (
		<div className="w-full mx-auto pointer-events-auto">
			<div
				ref={containerRef}
				onMouseMove={handleMouseMove}
				className="relative group overflow-hidden"
			>

				<div className="relative z-10">

					{/* High-Impact Paragraph 1 */}
					<motion.h2
						{...textVariant}
						transition={{ duration: 1, delay: 0.1 }}
						className="text-3xl md:text-3xl lg:text-4xl font-bold text-rb-accent-1 leading-[1.25] tracking-tight mb-10"
					>
						Our goal is straightforward: to equip developers with{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-1 to-rb-accent-2 italic decoration-rb-accent-1/30">
							flexible
						</span>
						,{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-2 to-rb-accent-3 italic font-serif">
							visually stunning
						</span>
						, and{" "}
						<span className="relative inline-block text-rb-accent-1">
							entirely free
							<svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 100 6" fill="none" preserveAspectRatio="none">
								<path d="M0 5C20 1 40 5 60 2C80 -1 100 4 100 4" stroke="var(--rb-accent-3)" strokeWidth="2" strokeLinecap="round" />
							</svg>
						</span>{" "}
						components that push web projects to the next level.
					</motion.h2>

					{/* Refined Paragraph 2 */}
					<motion.p
						{...textVariant}
						transition={{ duration: 1, delay: 0.2 }}
						className="text-[18px] md:text-lg text-rb-accent-2/50 leading-relaxed font-light max-w-3xl flex flex-col md:flex-row items-start md:items-center gap-4"
					>
						<span>
							To make that happen, React Bytes is built on a foundation of{" "}
							<span className="text-rb-accent-1 font-semibold">
								developer-centric principles
							</span>, now upgraded with{" "}
							<span className="text-rb-accent-3 font-semibold group-hover:text-rb-accent-2 transition-colors duration-500">
								powerful new customization features.
							</span>
						</span>
					</motion.p>

					{/* CTA Shortcut */}
					<motion.div
						{...textVariant}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="mt-16"
					>
						<button className="group/btn relative px-6 py-3 rounded-2xl bg-rb-accent-1 text-rb-neutral-1 text-[12px] font-bold tracking-widest uppercase overflow-hidden transition-all duration-300 hover:pr-10">
							<span className="relative z-10">Explore the library</span>
							<ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" size={16} />
						</button>
					</motion.div>
				</div>
			</div>

			<style jsx>{`
				.noise-overlay {
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
				}
			`}</style>
		</div>
	);
};

export default MissionSimple;
