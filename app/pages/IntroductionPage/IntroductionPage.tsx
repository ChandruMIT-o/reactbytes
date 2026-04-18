import React from "react";
import { motion } from "framer-motion";
import HeaderText from "../../components/textfields/HeaderText";
import CarousalCards from "../../components/cards/CarousalCards";
import MissionSimple from "../../components/cards/MissionSimple";
import Credits from "../../components/buttongroup/Credits";

const creditsData = [
	{
		title: "Shoutouts",
		items: [
			{
				name: "ReactBits",
				role: "Official Website",
				url: "https://reactbits.dev/",
			},
			{
				name: "GitHub Profile",
				role: "ChandruMIT-o",
				url: "https://github.com/ChandruMIT-o",
			},
		],
	},
];

const fadeUp = (delay: number = 0) => ({
	initial: { opacity: 0, y: 20, filter: "blur(8px)" },
	animate: { opacity: 1, y: 0, filter: "blur(0px)" },
	transition: { duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] },
});


export const IntroductionPage = () => {
	return (
		<div className="flex flex-col gap-10 pb-20 font-sans">
			{/* Hero Section */}
			<section
				id="welcome"
				className="relative flex flex-col items-center justify-center text-center pt-6 pb-16 overflow-hidden mt-2"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
					className="relative z-10 max-w-3xl px-6"
				>
					<motion.div
						{...fadeUp(0.1)}
						className="mb-8 inline-flex rounded-full px-4 py-1.5 border border-rb-neutral-4 bg-rb-neutral-3/80 backdrop-blur-sm"
					>
						<span className="text-[13px] text-rb-accent-2/80 font-medium tracking-wide flex items-center gap-2.5">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rb-accent-3 opacity-75" />
								<span className="relative inline-flex rounded-full h-2 w-2 bg-rb-accent-3" />
							</span>
							Open Source · Free Forever
						</span>
					</motion.div>

					<motion.h1
						{...fadeUp(0.2)}
						className="text-5xl md:text-6xl font-bold tracking-tight text-rb-accent-1 mb-6 leading-[1.1]"
					>
						Elevate Your React{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-2 to-rb-accent-3">
							Web Applications
						</span>
					</motion.h1>

					<motion.p
						{...fadeUp(0.3)}
						className="text-[16px] md:text-[17px] text-rb-accent-2/50 max-w-2xl mx-auto leading-relaxed font-light"
					>
						React Bytes is an open-source collection of meticulously
						crafted UI components. Not your standard component
						library — engineered to help your project stand out with
						bold creativity and unique interactivity.
					</motion.p>
				</motion.div>
			</section>

			{/* Mission Section */}
			<section id="mission" className="max-w-6xl mx-auto w-full px-4 pt-6">
				<MissionSimple />
			</section>

			<section
				id="principles"
				className="max-w-6xl mx-auto w-full px-4 pt-6"
			>
				<div className="mb-1">
					<HeaderText text="Core Principles" option={4} />
				</div>

				<CarousalCards />
			</section>

			<section id="credits" className="max-w-6xl mx-auto w-full px-4 pt-12 pb-10 border-t border-rb-neutral-4/50">
				<Credits 
					data={creditsData} 
					mainTitle="Shoutout to ReactBits!" 
					subtitle="Exploring the roots of creative React components."
				/>
			</section>
		</div>
	);
};

export default IntroductionPage;
