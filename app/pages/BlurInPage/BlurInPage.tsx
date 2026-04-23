"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { BlurIn } from "../../meta/text/TextEnter/BlurIn";
import { loaderProps, componentCode, creditsData } from "./BlurInData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "All Hail Rameez";
const DEFAULT_DURATION = 0.6;
const DEFAULT_STAGGER = 0.04;
const DEFAULT_BLUR = 12;
const DEFAULT_COLOR = "#E8EAF0";

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "All Hail Rameez",
			duration: 0.6,
			stagger: 0.04,
			initialBlur: 12,
			color: "#E8EAF0",
			uppercase: false,
		},
	},
	{
		id: "ethereal",
		label: "Ethereal Mist",
		config: {
			text: "ETHEREAL",
			duration: 1.5,
			stagger: 0.1,
			initialBlur: 32,
			color: "#A78BFA",
		},
	},
	{
		id: "sharp",
		label: "Rapid Entry",
		config: {
			text: "REACTION",
			duration: 0.3,
			stagger: 0.02,
			initialBlur: 8,
			color: "#2DD4BF",
		},
	},
	{
		id: "cascade",
		label: "Slow Cascade",
		config: {
			text: "BLURRING",
			duration: 2.0,
			stagger: 0.05,
			initialBlur: 24,
			color: "#FB7185",
		},
	},
];

export const BlurInPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [initialBlur, setInitialBlur] = useState(DEFAULT_BLUR);
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [uppercase, setUppercase] = useState(false);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setDuration(preset.config.duration);
			setStagger(preset.config.stagger);
			setInitialBlur(preset.config.initialBlur);
			setColor(preset.config.color);
			setUppercase(preset.config.uppercase ?? false);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<BlurIn
  text="${text}"
  duration={${duration}}
  stagger={${stagger}}
  initialBlur={${initialBlur}}
  color="${color}"
  uppercase={${uppercase}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="blur-in-title">
				<HeaderText text="Blur In" option={3} />
			</div>
			<ParagraphText
				text="A smooth staggered entrance animation where characters materialize from a blurred state. Fully customizable timing and blur intensity."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10">
							<BlurIn
								key={key}
								text={text}
								duration={duration}
								stagger={stagger}
								initialBlur={initialBlur}
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
						label="Display Text"
						value={text}
						onChange={(val) => {
							setText(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter text..."
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
						label="Transition Duration"
						min={0.1}
						max={3}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Stagger Delay"
						min={0}
						max={0.5}
						step={0.005}
						value={stagger}
						onChange={setStagger}
						maxDecimals={3}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Blur Intensity"
						min={0}
						max={100}
						step={2}
						value={initialBlur}
						onChange={setInitialBlur}
						showTicks={true}
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

export default BlurInPage;
