"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { MorphCarousel } from "@/app/meta/carousel/MorphCarousel/MorphCarousel";
import { MorphCarouselProps, componentCode, creditsData } from "./MorphCarouselData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";

const presets = [
	{
		id: "default",
		label: "Default",
		config: { distortion: 1.0, transitionDuration: 1200, scale: 3.5 }
	},
	{
		id: "liquid-high",
		label: "Liquid High",
		config: { distortion: 2.5, transitionDuration: 2000, scale: 5.0 }
	},
	{
		id: "snappy",
		label: "Snappy",
		config: { distortion: 0.5, transitionDuration: 600, scale: 2.0 }
	},
	{
		id: "subtle",
		label: "Subtle",
		config: { distortion: 0.3, transitionDuration: 1200, scale: 1.5 }
	},
	{
		id: "dreamy",
		label: "Dreamy",
		config: { distortion: 1.2, transitionDuration: 3000, scale: 4.0 }
	}
];

export const MorphCarouselPage = () => {
	const [distortion, setDistortion] = useState(1.0);
	const [transitionDuration, setTransitionDuration] = useState(1200);
	const [scale, setScale] = useState(3.5);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find(p => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setDistortion(preset.config.distortion);
			setTransitionDuration(preset.config.transitionDuration);
			setScale(preset.config.scale);
			setKey(prev => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<MorphCarousel
  distortion={${distortion}}
  transitionDuration={${transitionDuration}}
  scale={${scale}}
/>`;

	return (
		<div className="flex flex-col gap-16">
			{/* Header Section */}
			<section id="morph-carousel-title" className="flex flex-col gap-5">
				<HeaderText text="Morph Carousel" option={3} />
				<ParagraphText
					text="A high-performance WebGL-based carousel with fluid, distortion-heavy image morphing transitions. Perfect for cinematic showcases and immersive storytelling."
					option={4}
				/>

				<PreviewTab
					previewContent={
						<div className="w-full max-w-5xl">
							<MorphCarousel
								key={key}
								distortion={distortion}
								transitionDuration={transitionDuration}
								scale={scale}
							/>
						</div>
					}
					codeContent={componentCode}
					usageCode={usageCode}
					header={
						<div className="flex items-center justify-between w-full">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Controls
								</h3>
							</div>
							<DefaultComboBox
								options={presets}
								value={currentPreset}
								onChange={applyPreset}
								dynamicWidth={true}
								label="Presets"
							/>
							<div className="flex items-center gap-3">

								<button
									onClick={handleReset}
									className="group p-2.5 rounded-full bg-rb-neutral-3 text-rb-accent-1/40 border border-rb-neutral-4 hover:text-rb-accent-1 hover:bg-rb-neutral-4 transition-all duration-300"
									title="Reset to Defaults"
								>
									<RotateCcw
										size={16}
										className="group-hover:rotate-[-90deg] transition-transform duration-500"
									/>
								</button>
							</div>
						</div>
					}
				>
					<DiscreteSlider2
						label="Distortion"
						min={0}
						max={5}
						step={0.1}
						value={distortion}
						onChange={setDistortion}
						showTicks={true}
					/>
					<DiscreteSlider2
						label="Duration (ms)"
						min={200}
						max={5000}
						step={100}
						value={transitionDuration}
						onChange={setTransitionDuration}
						showTicks={true}
					/>
					<DiscreteSlider2
						label="Noise Scale"
						min={0.5}
						max={10}
						step={0.1}
						value={scale}
						onChange={setScale}
						showTicks={true}
					/>
				</PreviewTab>
			</section>

			{/* Installation Section */}
			<section id="installation-tabs">
				<HeaderText text="Installation" option={3} className="mb-10" />
				<InstallationTabs />
			</section>

			{/* API Reference Section */}
			<section id="api-reference">
				<HeaderText text="API Reference" option={3} className="mb-10" />
				<PropsTable
					categories={[
						{
							title: "Props",
							props: MorphCarouselProps
						}
					]}
				/>
			</section>

			{/* Credits Section */}
			<section id="credits">
				<HeaderText text="Credits" option={3} className="mb-10" />
				<Credits data={creditsData} />
			</section>
		</div>
	);
};

export default MorphCarouselPage;
