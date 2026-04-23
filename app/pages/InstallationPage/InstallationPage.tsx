import React from "react";
import { motion } from "framer-motion";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { Credits } from "../../components/buttongroup/Credits";
import { componentDocsData, creditsData } from "./InstallationData";
import AccordionStandard from "../../components/accordion/Accordion";
import DockedCarousel from "@/app/meta/carousel/DockedCarousel/DockedCarousel";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import ComboBox from "@/app/components/combobox/ComboBox";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";

const fadeUp = (delay: number = 0) => ({
	initial: { opacity: 0, y: 20, filter: "blur(8px)" },
	whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
	viewport: { once: true },
	transition: {
		duration: 0.8,
		delay,
		ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
	},
});

export const InstallationPage: React.FC = () => {
	const [toggleValue, setToggleValue] = React.useState(true);
	const [textValue, setTextValue] = React.useState("");

	return (
		<div className="min-h-screen bg-rb-neutral-1 text-rb-accent-1 selection:bg-rb-accent-1/20 py-20 pb-40 space-y-32">
			{/* Hero Section */}
			<section
				id="installation-hero"
				className="relative flex flex-col items-center justify-center text-center pt-10 pb-2 overflow-hidden"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.97 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] }}
					className="relative z-10 max-w-3xl px-6"
				>
					<motion.h1
						{...fadeUp(0.1)}
						className="text-5xl md:text-6xl font-bold tracking-tight text-rb-accent-1 mb-6 leading-[1.1]"
					>
						Get Started with{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-rb-accent-2 to-rb-accent-3">
							React Bytes
						</span>
					</motion.h1>

					<motion.p
						{...fadeUp(0.2)}
						className="text-[16px] md:text-[17px] text-rb-accent-2/50 max-w-2xl mx-auto leading-relaxed font-light"
					>
						Fast, light, and beautiful. Install React Bytes in seconds and start building premium interfaces with meticulously crafted UI components.
					</motion.p>
				</motion.div>
			</section>

			{/* Installation Section */}
			<section id="installation" className="max-w-4xl mx-auto w-full px-4">
				<motion.div {...fadeUp(0.3)} className="mb-6">
					<HeaderText text="Installation" option={4} />
					<div className="mt-2">
						<ParagraphText
							text="Choose your preferred package manager to install the core library."
							option={4}
						/>
					</div>
				</motion.div>

				<motion.div {...fadeUp(0.4)} id="installation-tabs">
					<InstallationTabs />
				</motion.div>
			</section>

			{/* Configuration Section */}
			<section id="peer-dependencies" className="max-w-4xl mx-auto w-full px-4">
				<motion.div {...fadeUp(0.5)} className="mb-6">
					<HeaderText text="Peer Dependencies" option={4} />
					<div className="mt-2">
						<ParagraphText
							text="React Bytes relies on these essential libraries for its high-performance animations and styling."
							option={4}
						/>
					</div>
				</motion.div>

				<motion.div {...fadeUp(0.6)} className="w-full">
					<PropsTable categories={componentDocsData} />
				</motion.div>
			</section>

			{/* Quick Start Section */}
			<section id="quick-start" className="max-w-4xl mx-auto w-full px-4">
				<motion.div {...fadeUp(0.7)} className="mb-6">
					<HeaderText text="Quick Start" option={4} />
					<div className="mt-2">
						<ParagraphText
							text="Import and use components directly in your React application."
							option={4}
						/>
					</div>
				</motion.div>

				<motion.div {...fadeUp(0.8)} className="bg-rb-neutral-3 p-1.5 rounded-[24px] w-full border border-rb-neutral-4/50">
					<div className="bg-rb-neutral-1 rounded-[18px] w-full p-6 text-rb-accent-2 font-mono text-sm overflow-x-auto whitespace-pre">
						<span className="text-rb-accent-3">import</span> {"{"} <span className="text-rb-accent-2">DefaultButton</span> {"}"} <span className="text-rb-accent-3">from</span> <span className="text-emerald-400">"react-bytes"</span>;

						<span className="text-rb-accent-3">function</span> <span className="text-rb-accent-2">App</span>() {"{"}
						<span className="text-rb-accent-3">return</span> (
						<span className="text-gray-500">&lt;</span><span className="text-rb-accent-2">DefaultButton</span> <span className="text-rb-accent-3">onClick</span>={"{"}() <span className="text-rb-accent-3">=&gt;</span> console.<span className="text-rb-accent-2">log</span>(<span className="text-emerald-400">"Clicked!"</span>){"}"}<span className="text-gray-500">&gt;</span>
						Get Started
						<span className="text-gray-500">&lt;/</span><span className="text-rb-accent-2">DefaultButton</span><span className="text-gray-500">&gt;</span>
						);
						{"}"}
					</div>
				</motion.div>
			</section>

			{/* Credits Section */}
			<section id="credits" className="max-w-4xl mx-auto w-full px-4 border-t border-rb-neutral-4/50 pt-10">
				<motion.div {...fadeUp(0.9)}>
					<Credits
						data={creditsData}
						mainTitle="Credits & Resources"
						subtitle="Built with passion by the React Bytes team and amazing open-source contributors."
					/>
				</motion.div>
			</section>
			<section className="flex flex-col items-center justify-center pb-32">
				<div className="flex flex-col gap-4 w-[320px]">
					<DiscreteSlider2 label="Intensity" />
					<ColorPicker label="Theme Color" />
					<DefaultComboBox 
						label="Language" 
						options={[
							{ id: "en", label: "English" },
							{ id: "es", label: "Spanish" },
							{ id: "fr", label: "French" },
						]} 
					/>
					<ToggleComponent 
						label="Auto-updates" 
						checked={toggleValue} 
						onChange={setToggleValue} 
					/>
					<DefaultTextInput 
						label="Project Name" 
						placeholder="My Awesome App"
						value={textValue}
						onChange={setTextValue}
					/>
				</div>
			</section>
		</div>
	);
};

