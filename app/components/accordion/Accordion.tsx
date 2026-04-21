import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionItemData {
	id: string;
	iconPath: string;
	title: string;
	content: string;
}

interface AccordionItemProps {
	item: AccordionItemData;
	isOpen: boolean;
	isAnyOpen: boolean;
	isBeforeOpen: boolean;
	isAfterOpen: boolean;
	isLastBeforeOpen: boolean;
	isFirstAfterOpen: boolean;
	isFirst: boolean;
	isLast: boolean;
	onClick: () => void;
}

const accordionData: AccordionItemData[] = [
	{
		id: "item-1",
		iconPath: "M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75Z",
		title: "What is design engineering?",
		content:
			"Where design intuition meets code execution — enabling you to see UI problems and build solutions from the ground up.",
	},
	{
		id: "item-2",
		iconPath: "M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 0 1 .878.645 49.17 49.17 0 0 1 .376 5.452.657.657 0 0 1-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 0 0-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 0 1-.595 4.845.75.75 0 0 1-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 0 1-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 0 1-.658.643 49.118 49.118 0 0 1-4.708-.36.75.75 0 0 1-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 0 0 5.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 0 0 .659-.663 47.703 47.703 0 0 0-.31-4.82.75.75 0 0 1 .83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 0 0 .657-.642Z",
		title: "What is the craft of UI?",
		content:
			"A course about building things *well* — mastering the web platform so you're not limited by tools or libraries.",
	},
	{
		id: "item-3",
		iconPath: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM6.262 6.072a8.25 8.25 0 1 0 10.562-.766 4.5 4.5 0 0 1-1.318 1.357L14.25 7.5l.165.33a.809.809 0 0 1-1.086 1.085l-.604-.302a1.125 1.125 0 0 0-1.298.21 l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 0 1-2.288 4.04l-.723.724a1.125 1.125 0 0 1-1.298.21l-.153-.076a1.125 1.125 0 0 1-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 0 1-.21-1.298L9.75 12l-1.64-1.64a6 6 0 0 1-1.676-3.257l-.172-1.03Z",
		title: "Why focus on the web platform?",
		content:
			"Because when you work *with* the web — not fight it — you unlock performance, accessibility, and durability that last.",
	},
	{
		id: "item-4",
		iconPath: "M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z",
		title: "Why does craft matter?",
		content:
			"Because it's more than making something work — it's making something feel right: inclusive, resilient, and scalable.",
	},
	{
		id: "item-5",
		iconPath: "M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z",
		title: "Who is this for?",
		content:
			"Designers who code, developers who design — anyone ready to stop chasing snippets and become the person who *can build anything*.",
	},
];

const AccordionItem: React.FC<AccordionItemProps> = ({
	item,
	isOpen,
	isAnyOpen,
	isBeforeOpen,
	isAfterOpen,
	isLastBeforeOpen,
	isFirstAfterOpen,
	isFirst,
	isLast,
	onClick,
}) => {
	// Radius logic based on standard, open, before-open, or after-open states
	const getBorderRadius = () => {
		if (isOpen) return "1rem";
		if (!isAnyOpen) {
			if (isFirst && isLast) return "1rem";
			if (isFirst) return "1rem 1rem 0 0";
			if (isLast) return "0 0 1rem 1rem";
			return "0";
		}
		if (isBeforeOpen && isLastBeforeOpen) return "0 0 1rem 1rem";
		if (isAfterOpen && isFirstAfterOpen) return "1rem 1rem 0 0";
		if (isFirst && isAfterOpen) return "1rem 1rem 0 0";
		if (isLast && isBeforeOpen) return "0 0 1rem 1rem";
		return "0";
	};

	return (
		<motion.div
			layout
			initial={false}
			animate={{
				y: isBeforeOpen ? -24 : isAfterOpen ? 24 : 0,
				opacity: isOpen ? 1 : isAnyOpen ? 0.5 : 1,
				backgroundColor: isOpen ? "#181A1E" : "#060010",
				borderRadius: getBorderRadius(),
				zIndex: isOpen ? 10 : 0,
			}}
			transition={{
				duration: 0.5,
				ease: [0.34, 1.56, 0.64, 1], // Equivalent to the provided cubic-bezier
			}}
			className="relative border border-[#333] -mt-[1px] first:mt-0 overflow-hidden group"
		>
			<button
				onClick={onClick}
				className="w-full flex items-center gap-4 p-4 text-left focus:outline-none relative overflow-hidden"
			>
				{/* Hover overlay effect from CSS */}
				<div className="absolute inset-0 bg-[#181A1E] opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

				<svg
					className="w-5 h-5 flex-shrink-0 text-white opacity-70 relative z-10"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d={item.iconPath} />
				</svg>

				<span className="flex-1 text-rb-accent-1 relative z-10 font-sans tracking-tight">
					{item.title}
				</span>

				<motion.svg
					className="w-5 h-5 flex-shrink-0 text-white opacity-70 relative z-10"
					viewBox="0 0 24 24"
					fill="currentColor"
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
				>
					<path d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" />
				</motion.svg>
			</button>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						initial={{ height: 0 }}
						animate={{ height: "auto" }}
						exit={{ height: 0 }}
						transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
						className="overflow-hidden"
					>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{ duration: 0.4, delay: 0.1 }}
							className="px-4 pb-4 pl-13 pr-4"
						>
							<p className="text-rb-accent-2 leading-relaxed text-sm">
								{item.content}
							</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default function AccordionStandard() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const handleToggle = (index: number) => {
		setActiveIndex(activeIndex === index ? null : index);
	};

	return (
		<div className="w-full max-w-[600px] mx-auto py-12 px-4 flex flex-col items-center">
			<div className="w-full relative">
				{accordionData.map((item, index) => {
					const isOpen = activeIndex === index;
					const isAnyOpen = activeIndex !== null;
					const isBeforeOpen = activeIndex !== null && index < activeIndex;
					const isAfterOpen = activeIndex !== null && index > activeIndex;
					const isLastBeforeOpen = activeIndex !== null && index === activeIndex - 1;
					const isFirstAfterOpen = activeIndex !== null && index === activeIndex + 1;

					return (
						<AccordionItem
							key={item.id}
							item={item}
							isOpen={isOpen}
							isAnyOpen={isAnyOpen}
							isBeforeOpen={isBeforeOpen}
							isAfterOpen={isAfterOpen}
							isLastBeforeOpen={isLastBeforeOpen}
							isFirstAfterOpen={isFirstAfterOpen}
							isFirst={index === 0}
							isLast={index === accordionData.length - 1}
							onClick={() => handleToggle(index)}
						/>
					);
				})}
			</div>
		</div>
	);
}