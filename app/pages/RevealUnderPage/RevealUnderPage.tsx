"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { RevealUnder } from "../../meta/text/TextEnter/RevealUnder";
import { loaderProps, componentCode, creditsData } from "./RevealUnderData";
import { ComboBox } from "../../components/combobox/ComboBox";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw, Play } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_FIRST = "Hello";
const DEFAULT_SECOND = "World";
const DEFAULT_DURATION = 1.5;
const DEFAULT_DIRECTION = "right";
const DEFAULT_COLOR = "text-rb-accent-1";

const directionOptions = [
	{ id: "right", label: "Right" },
	{ id: "left", label: "Left" },
	{ id: "top", label: "Top" },
	{ id: "bottom", label: "Bottom" },
];

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			first: "Hello",
			second: "World",
			direction: "right",
			duration: 1.5,
			color: "text-rb-accent-1",
		},
	},
	{
		id: "up",
		label: "Classic Reveal Up",
		config: {
			first: "Reveal",
			second: "Under",
			direction: "top",
			duration: 1.5,
			color: "text-rb-accent-2",
		},
	},
	{
		id: "rapid",
		label: "Rapid Punch",
		config: {
			first: "PUNCH",
			second: "OUT",
			direction: "left",
			duration: 0.6,
			color: "text-rb-accent-3",
		},
	},
];

const colorOptions = [
	{ id: "text-rb-accent-1", label: "Accent 1" },
	{ id: "text-rb-accent-2", label: "Accent 2" },
	{ id: "text-rb-accent-3", label: "Accent 3" },
	{ id: "text-white", label: "White" },
];

export const RevealUnderPage = () => {
	const [firstWord, setFirstWord] = useState(DEFAULT_FIRST);
	const [secondWord, setSecondWord] = useState(DEFAULT_SECOND);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [direction, setDirection] = useState<any>(DEFAULT_DIRECTION);
	const [textColorClass, setTextColorClass] = useState(DEFAULT_COLOR);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setFirstWord(preset.config.first);
			setSecondWord(preset.config.second);
			setDirection(preset.config.direction);
			setDuration(preset.config.duration);
			setTextColorClass(preset.config.color);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<RevealUnder
  firstWord="${firstWord}"
  secondWord="${secondWord}"
  direction="${direction}"
  duration={${duration}}
  textColorClass="${textColorClass}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="reveal-under-title">
				<HeaderText text="Reveal Under" option={3} />
			</div>
			<ParagraphText
				text="A sophisticated reveal animation where one word slides away to uncover another word hidden beneath it. Now upgraded with multi-directional support."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10">
							<RevealUnder
								key={key}
								firstWord={firstWord}
								secondWord={secondWord}
								direction={direction}
								duration={duration}
								textColorClass={textColorClass}
								textClassName="text-6xl font-bold tracking-tight font-mono"
							/>
						</div>
					}
					onReplay={handleReplay}
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
							<DefaultComboBox
								options={presets}
								value={currentPreset}
								onChange={applyPreset}
								dynamicWidth={true}
							/>
							<div className="flex items-center gap-3">

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
						label="First Word"
						value={firstWord}
						onChange={(e) => {
							setFirstWord(e.target.value);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter word..."
					/>
					<TextInput
						label="Second Word"
						value={secondWord}
						onChange={(e) => {
							setSecondWord(e.target.value);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter word..."
					/>

					<ComboBox
						label="Reveal Direction"
						options={directionOptions}
						value={direction}
						onChange={(val) => {
							setDirection(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<ComboBox
						label="Text Color"
						options={colorOptions}
						value={textColorClass}
						onChange={setTextColorClass}
					/>

					<DiscreteSlider
						label="Duration (s)"
						min={0.1}
						max={3}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
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

export default RevealUnderPage;
