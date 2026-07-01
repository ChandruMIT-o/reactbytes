"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { GitCommit } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import CarousalCards from "../../components/cards/CarousalCards";
import MissionSimple from "../../components/cards/MissionSimple";
import Credits from "../../components/buttongroup/Credits";
import HeaderChaosBackground from "../../components/layout/HeaderChaosBackground";

interface Contributor {
	login: string;
	avatar_url: string;
	html_url: string;
	contributions: number;
	name?: string;
}

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
	initial: { opacity: 0, y: 30, filter: "blur(10px)" },
	animate: { opacity: 1, y: 0, filter: "blur(0px)" },
	transition: { duration: 0.7, delay, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] },
});

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
			delayChildren: 0.1,
		},
	},
};

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 40,
		scale: 0.9,
		filter: "blur(10px)",
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		filter: "blur(0px)",
		transition: {
			type: "spring" as const,
			bounce: 0.4,
			duration: 0.8,
		},
	},
};

const ContributorCard = ({ contributor }: { contributor: Contributor }) => {
	const cardRef = useRef<HTMLAnchorElement>(null);
	const [isHovered, setIsHovered] = useState(false);
	const [isPressed, setIsPressed] = useState(false);

	const x = useMotionValue(0.5);
	const y = useMotionValue(0.5);

	const rotateX = useTransform(y, [0, 1], [12, -12]);
	const rotateY = useTransform(x, [0, 1], [-12, 12]);

	const springConfig = { damping: 20, stiffness: 120, mass: 0.6 };
	const rotateXSpring = useSpring(rotateX, springConfig);
	const rotateYSpring = useSpring(rotateY, springConfig);

	const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const width = rect.width;
		const height = rect.height;

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;
		x.set(mouseX / width);
		y.set(mouseY / height);
	};

	const handleMouseLeave = () => {
		x.set(0.5);
		y.set(0.5);
		setIsHovered(false);
		setIsPressed(false);
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseDown = () => {
		setIsPressed(true);
	};

	const handleMouseUp = () => {
		setIsPressed(false);
	};

	return (
		<motion.a
			ref={cardRef}
			href={contributor.html_url}
			target="_blank"
			rel="noopener noreferrer"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			style={{
				rotateX: rotateXSpring,
				rotateY: rotateYSpring,
				transformStyle: "preserve-3d",
			}}
			variants={cardVariants}
			whileHover={{ scale: 1.04, y: -6 }}
			whileTap={{ scale: 0.98 }}
			className="relative flex flex-col items-center justify-between p-0 sm:p-[10px] sm:pb-8 sm:pt-[10px] rounded-full bg-rb-neutral-3/40 transition-all duration-500 w-[120px] h-[120px] sm:w-[240px] sm:h-[390px] select-none cursor-pointer overflow-hidden group backdrop-blur-md shadow-lg"
		>
			{/* Animated WebGL Chaos Background (Flipped X & Y) */}
			<HeaderChaosBackground isHovered={isHovered} isPressed={isPressed} flippedX={true} flippedY={true} />

			{/* Large Clean Borderless Avatar */}
			<div
				className="relative w-[120px] h-[120px] sm:w-[220px] sm:h-[220px] shrink-0 rounded-full overflow-hidden bg-rb-neutral-2 z-10 transition-all duration-500"
				style={{ transform: "translateZ(35px)" }}
			>
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={contributor.avatar_url}
					alt={`${contributor.login}'s avatar`}
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
					loading="lazy"
				/>
			</div>

			{/* Text Information Container */}
			<div
				className="hidden sm:flex flex-col items-center text-center min-w-0 z-10 flex-1 justify-center my-3"
				style={{ transform: "translateZ(25px)" }}
			>
				<h3 className="font-bold text-[18px] text-rb-accent-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rb-accent-1 group-hover:to-rb-accent-3 transition-all duration-300 truncate w-full px-4 tracking-tight">
					{contributor.name || contributor.login}
				</h3>

				<span className="text-[13px] text-rb-accent-2/45 font-medium truncate w-full px-4">
					@{contributor.login}
				</span>
			</div>

			{/* Enhanced Commits Badge */}
			<div
				className="hidden sm:flex z-10 mb-1 items-center gap-2 px-3.5 py-1 rounded-full bg-rb-neutral-4/30 border border-rb-neutral-4/50 text-[10px] text-rb-accent-2/80 font-bold tracking-wider uppercase group-hover:text-rb-accent-1 group-hover:bg-rb-accent-3/15 group-hover:border-rb-accent-3/30 transition-all duration-300"
				style={{ transform: "translateZ(15px)" }}
			>
				<GitCommit size={12} className="text-rb-accent-3 group-hover:rotate-[360px] transition-transform duration-700 ease-out" />
				<span className="flex items-center gap-1">
					<span className="text-rb-accent-3 font-extrabold group-hover:text-rb-accent-1 transition-colors duration-300">{contributor.contributions}</span>
					<span className="text-rb-accent-2/60 group-hover:text-rb-accent-1/90 transition-colors duration-300">{contributor.contributions === 1 ? 'commit' : 'commits'}</span>
				</span>
			</div>
		</motion.a>
	);
};

export const IntroductionPage = () => {
	const [contributors, setContributors] = useState<Contributor[]>([]);

	useEffect(() => {
		const fetchContributors = async () => {
			try {
				const cachedData = localStorage.getItem("rb_contributors");
				const cachedTime = localStorage.getItem("rb_contributors_time");

				if (cachedData && cachedTime) {
					const age = Date.now() - parseInt(cachedTime, 10);
					if (age < 24 * 60 * 60 * 1000) {
						setContributors(JSON.parse(cachedData));
						return;
					}
				}

				const res = await fetch("https://api.github.com/repos/ChandruMIT-o/reactbytes/contributors");
				if (!res.ok) throw new Error("Failed to fetch contributors");
				const data = await res.json();

				const resolvedList = await Promise.all(
					data.map(async (item: Contributor) => {
						let name = item.login;
						const userCacheKey = `rb_user_name_${item.login}`;
						const cachedName = localStorage.getItem(userCacheKey);

						if (cachedName) {
							name = cachedName;
						} else {
							try {
								const userRes = await fetch(`https://api.github.com/users/${item.login}`);
								if (userRes.ok) {
									const userData = await userRes.json();
									if (userData.name) {
										name = userData.name;
										localStorage.setItem(userCacheKey, userData.name);
									}
								}
							} catch (e) {
								console.error("Failed to fetch user name for " + item.login, e);
							}
						}

						return {
							login: item.login,
							avatar_url: item.avatar_url,
							html_url: item.html_url,
							contributions: item.contributions,
							name,
						};
					})
				);

				setContributors(resolvedList);
				localStorage.setItem("rb_contributors", JSON.stringify(resolvedList));
				localStorage.setItem("rb_contributors_time", Date.now().toString());
			} catch (error) {
				console.error("Error loading contributors", error);
				// Fallbacks removed per request
			}
		};

		fetchContributors();
	}, []);

	return (
		<div className="flex flex-col gap-10 pb-20 font-sans">
			{/* Hero Section */}
			<section
				id="welcome"
				className="relative flex flex-col items-center justify-center text-center pt-6 pb-2 overflow-hidden mt-2"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
					className="relative z-10 max-w-3xl px-6"
				>
					<motion.div
						{...fadeUp(0.1)}
						className="mb-8 inline-flex rounded-full px-4 py-1.5 border border-rb-neutral-4 bg-rb-neutral-3/80 backdrop-blur-sm shadow-xl shadow-black/10"
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
						className="text-5xl md:text-6xl font-extrabold tracking-tight text-rb-accent-1 mb-6 leading-[1.1]"
					>
						Elevate Your React{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-2 to-rb-accent-3">
							Web Applications
						</span>
					</motion.h1>

					<motion.p
						{...fadeUp(0.3)}
						className="text-[16px] md:text-[17px] text-rb-accent-2/60 max-w-2xl mx-auto leading-relaxed font-light"
					>
						React Bytes is an open-source collection of meticulously
						crafted UI components. Not your standard component
						library, engineered to help your project stand out with
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
				className="max-w-6xl mx-auto w-full px-4"
			>
				<div className="mb-1">
					<HeaderText text="Core Features" option={4} />
				</div>

				<CarousalCards />
			</section>

			{/* Contributors Section */}
			<section
				id="contributors"
				className="max-w-6xl mx-auto w-full px-4 pt-10"
			>
				<div className="mb-12 text-center flex flex-col items-center">
					<HeaderText id="contributions" text="Meet the Contributors" option={4} />
					<p className="text-[14px] text-rb-accent-2/50 font-light max-w-md mt-2">
						The creative minds helping build the next generation of interactive React UI components.
					</p>
				</div>

				{contributors.length > 0 && (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.1 }}
						className="flex flex-wrap gap-6 justify-center max-w-4xl mx-auto"
					>
						{contributors.map((contributor) => (
							<ContributorCard key={contributor.login} contributor={contributor} />
						))}
					</motion.div>
				)}
			</section>

			<section id="credits" className="max-w-6xl mx-auto w-full border-t border-rb-neutral-4/50 mt-10">
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