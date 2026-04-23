"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { VariableWeightText } from "../../meta/text/TextEnter/VariableWeightText";
import {
	loaderProps,
	componentCode,
	creditsData,
} from "./VariableWeightTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "VARIABLE OUTFIT";
const DEFAULT_INITIAL_WEIGHT = 100;
const DEFAULT_TARGET_WEIGHT = 900;
const DEFAULT_DURATION = 0.8;
const DEFAULT_STAGGER = 0.1;
const DEFAULT_COLOR = "#E8EAF0";

const presets = [
	{
		id: "default",
		label: "Default Bold",
		config: {
			text: "VARIABLE OUTFIT",
			initialWeight: 100,
			targetWeight: 900,
			duration: 0.8,
			stagger: 0.1,
			pulse: false,
			color: "#E8EAF0",
		},
	},
	{
		id: "pulse",
		label: "Breathing Cycle",
		config: {
			text: "BREATHING",
			initialWeight: 100,
			targetWeight: 800,
			duration: 2.0,
			stagger: 0.2,
			pulse: true,
			color: "#A78BFA",
		},
	},
	{
		id: "rapid",
		label: "Rapid Wave",
		config: {
			text: "VELOCITY",
			initialWeight: 200,
			targetWeight: 700,
			duration: 0.4,
			stagger: 0.05,
			pulse: false,
			color: "#2DD4BF",
		},
	},
];

export const VariableWeightTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [initialWeight, setInitialWeight] = useState(DEFAULT_INITIAL_WEIGHT);
	const [targetWeight, setTargetWeight] = useState(DEFAULT_TARGET_WEIGHT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [pulse, setPulse] = useState(false);
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [key, setKey] = useState(0);
	const [currentPreset, setCurrentPreset] = useState("default");

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setInitialWeight(preset.config.initialWeight);
			setTargetWeight(preset.config.targetWeight);
			setDuration(preset.config.duration);
			setStagger(preset.config.stagger);
			setPulse(preset.config.pulse);
			setColor(preset.config.color || DEFAULT_COLOR);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<VariableWeightText
  text="${text}"
  initialWeight={${initialWeight}}
  targetWeight={${targetWeight}}
  duration={${duration}}
  stagger={${stagger}}
  pulse={${pulse}}
  color="${color}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="variable-weight-title">
				<HeaderText text="Variable Weight Text" option={3} />
			</div>
			<ParagraphText
				text="A novel animation leveraging modern variable fonts. Characters shift their font weight in a staggered sequence, creating a wave-like breathing effect or a punchy entry."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[350px] relative overflow-hidden flex items-center justify-center">
							<VariableWeightText
								key={key}
								text={text}
								initialWeight={initialWeight}
								targetWeight={targetWeight}
								duration={duration}
								stagger={stagger}
								pulse={pulse}
								color={color}
								textClassName="text-7xl tracking-tighter"
							/>
						</div>
					}
					onReplay={!pulse ? handleReplay : undefined}
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
						label="Text Content"
						value={text}
						onChange={(val) => {
							setText(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter text..."
					/>

					<ColorPicker
						label="Text Color"
						value={color}
						onChange={setColor}
					/>

					<DiscreteSlider2
						label="Initial Weight"
						min={100}
						max={900}
						step={100}
						value={initialWeight}
						onChange={setInitialWeight}
						showTicks={true}
					/>
					<DiscreteSlider2
						label="Target Weight"
						min={100}
						max={900}
						step={100}
						value={targetWeight}
						onChange={setTargetWeight}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Duration (s)"
						min={0.1}
						max={3}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={true}
					/>

					<ToggleComponent
						label="Pulse Mode"
						checked={pulse}
						onChange={setPulse}
					/>

					<DiscreteSlider2
						label="Stagger (s)"
						min={0}
						max={0.5}
						step={0.01}
						value={stagger}
						onChange={setStagger}
						maxDecimals={2}
						showTicks={true}
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

export default VariableWeightTextPage;
