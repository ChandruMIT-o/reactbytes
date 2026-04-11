"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { GooeyMorph } from "../../meta/text/Morph/GooeyMorph";
import { loaderProps, componentCode, creditsData } from "./GooeyMorphTextData";
import { ComboBox } from "../../components/combobox/ComboBox";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_WORDS = "CREATE, DESIGN, DEVELOP";
const DEFAULT_DURATION = 3;
const DEFAULT_MORPH_SPEED = 1;
const DEFAULT_COLOR = "text-rb-accent-1";
const DEFAULT_Y_OFFSET = 20;

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			words: "CREATE, DESIGN, DEVELOP",
			duration: 3,
			morphSpeed: 1,
			color: "text-rb-accent-1",
			yOffset: 20,
		},
	},
	{
		id: "coding",
		label: "Coding Flow",
		config: {
			words: "CODE, BUILD, SHIP",
			duration: 2,
			morphSpeed: 0.8,
			color: "text-rb-accent-2",
			yOffset: 30,
		},
	},
	{
		id: "slow-vibes",
		label: "Slow Vibes",
		config: {
			words: "BREATHE, RELAX, CREATE",
			duration: 5,
			morphSpeed: 2,
			color: "text-rb-accent-3",
			yOffset: 10,
		},
	},
];

const colorOptions = [
	{ id: "text-rb-accent-1", label: "Accent 1" },
	{ id: "text-rb-accent-2", label: "Accent 2" },
	{ id: "text-rb-accent-3", label: "Accent 3" },
	{ id: "text-white", label: "White" },
];

export const GooeyMorphTextPage = () => {
	const [wordsInput, setWordsInput] = useState(DEFAULT_WORDS);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [morphSpeed, setMorphSpeed] = useState(DEFAULT_MORPH_SPEED);
	const [yOffset, setYOffset] = useState(DEFAULT_Y_OFFSET);
	const [textColorClass, setTextColorClass] = useState(DEFAULT_COLOR);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const words = wordsInput.split(",").map((word) => word.trim());

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setWordsInput(preset.config.words);
			setDuration(preset.config.duration);
			setMorphSpeed(preset.config.morphSpeed);
			setYOffset(preset.config.yOffset);
			setTextColorClass(preset.config.color);
			setKey((prev) => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<GooeyMorph
  words={${JSON.stringify(words)}}
  duration={${duration}}
  morphSpeed={${morphSpeed}}
  yOffset={${yOffset}}
  textColorClass="${textColorClass}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="gooey-morph-title">
				<HeaderText text="Gooey Morph" option={3} />
			</div>
			<ParagraphText
				text="A mesmerizing text transformation effect that uses SVG filters to create a liquid-like 'gooey' transition between different words. Optimized with custom spring physics and vertical motion."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10 bg-rb-neutral-2 border border-white/5 rounded-xl">
							<div className="noise opacity-[0.04] absolute inset-0 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
							<div className="absolute inset-0 bg-gradient-to-b from-rb-accent-1/5 to-transparent pointer-events-none" />
							<GooeyMorph
								key={key}
								words={words}
								duration={duration}
								morphSpeed={morphSpeed}
								yOffset={yOffset}
								textColorClass={textColorClass}
							/>
						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-[180px]">
									<DefaultComboBox
										options={presets}
										value={currentPreset}
										onChange={applyPreset}
									/>
								</div>
								<button
									onClick={handleReset}
									className="group p-2.5 rounded-full bg-rb-neutral-3 text-rb-accent-1/40 border border-rb-neutral-4 hover:text-rb-accent-3 transition-all duration-300"
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
					<TextInput
						label="Words (comma separated)"
						value={wordsInput}
						onChange={(e) => {
							setWordsInput(e.target.value);
							setKey((prev) => prev + 1);
						}}
						placeholder="Word1, Word2, Word3..."
					/>

					<ComboBox
						label="Text Color"
						options={colorOptions}
						value={textColorClass}
						onChange={setTextColorClass}
					/>

					<DiscreteSlider
						label="Duration (s)"
						min={1}
						max={10}
						step={0.5}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Morph Speed (s)"
						min={0.1}
						max={3}
						step={0.1}
						value={morphSpeed}
						onChange={setMorphSpeed}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Y Offset (px)"
						min={0}
						max={100}
						step={1}
						value={yOffset}
						onChange={setYOffset}
						maxDecimals={0}
						showTicks={false}
					/>
				</PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={loaderProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default GooeyMorphTextPage;
