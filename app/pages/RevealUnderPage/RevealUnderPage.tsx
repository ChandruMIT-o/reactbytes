"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { RevealUnder } from "../../meta/text/TextEnter/RevealUnder";
import { loaderProps, componentCode, creditsData } from "./RevealUnderData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_FIRST = "Hello";
const DEFAULT_SECOND = "World";
const DEFAULT_DURATION = 1.5;
const DEFAULT_DIRECTION = "right";
const DEFAULT_COLOR = "#E8EAF0";

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
			color: "#E8EAF0",
			uppercase: true,
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
			color: "#A78BFA",
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
			color: "#2DD4BF",
		},
	},
];

export const RevealUnderPage = () => {
	const [firstWord, setFirstWord] = useState(DEFAULT_FIRST);
	const [secondWord, setSecondWord] = useState(DEFAULT_SECOND);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [direction, setDirection] = useState<any>(DEFAULT_DIRECTION);
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [uppercase, setUppercase] = useState(true);
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
			setColor(preset.config.color);
			setUppercase(preset.config.uppercase ?? true);
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
  color="${color}"
  uppercase={${uppercase}}
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
								color={color}
								uppercase={uppercase}
								textClassName="text-6xl font-bold tracking-tight font-mono"
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between ">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<DefaultComboBox
								label="Presets"
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
					<DefaultTextInput
						label="First Word"
						value={firstWord}
						onChange={(val) => {
							setFirstWord(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter word..."
					/>

					<DefaultTextInput
						label="Second Word"
						value={secondWord}
						onChange={(val) => {
							setSecondWord(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter word..."
					/>

					<ToggleComponent
						label="Uppercase Mode"
						checked={uppercase}
						onChange={(val) => {
							setUppercase(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<DiscreteSlider2
						label="Reveal Duration"
						min={0.1}
						max={3}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={true}
					/>

					<DefaultComboBox
						label="Reveal Direction"
						options={directionOptions}
						value={direction}
						onChange={(val) => {
							setDirection(val);
							setKey((prev) => prev + 1);
						}}
						dynamicWidth={true}
					/>

					<ColorPicker
						label="Accent Color"
						value={color}
						onChange={setColor}
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
