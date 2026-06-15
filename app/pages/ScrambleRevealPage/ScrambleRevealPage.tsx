"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ScrambleReveal } from "../../meta/text/TextEnter/ScrambleReveal";
import { loaderProps, componentCode, creditsData } from "./ScrambleRevealData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";

const DEFAULT_TEXT = "CREATIVE";
const DEFAULT_SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
const DEFAULT_DURATION = 0.8;
const DEFAULT_SCRAMBLE_STAGGER = 0.05;
const DEFAULT_REVEAL_STAGGER = 0.1;

const presets = [
	{
		id: "default",
		label: "Classic Push",
		config: {
			text: "CREATIVE",
			scramble: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			duration: 0.8,
			scrambleStagger: 0.05,
			revealStagger: 0.1,
			color: "#34d399",
			uppercase: true,
		},
	},
	{
		id: "matrix",
		label: "System Reveal",
		config: {
			text: "INITIALIZING",
			scramble: "01",
			duration: 0.4,
			scrambleStagger: 0.02,
			revealStagger: 0.05,
			color: "#10b981",
			uppercase: true,
		},
	},
	{
		id: "cinematic",
		label: "Cinematic Slow",
		config: {
			text: "PROCESSED",
			scramble: "!@#$%^&*",
			duration: 1.2,
			scrambleStagger: 0.08,
			revealStagger: 0.15,
			color: "#60a5fa",
			uppercase: true,
		},
	},
];

export const ScrambleRevealPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [scrambleChars, setScrambleChars] = useState(DEFAULT_SCRAMBLE);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [scrambleStagger, setScrambleStagger] = useState(DEFAULT_SCRAMBLE_STAGGER);
	const [revealStagger, setRevealStagger] = useState(DEFAULT_REVEAL_STAGGER);
	const [color, setColor] = useState("#34d399");
	const [uppercase, setUppercase] = useState(true);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setScrambleChars(preset.config.scramble);
			setDuration(preset.config.duration);
			setScrambleStagger(preset.config.scrambleStagger);
			setRevealStagger(preset.config.revealStagger);
			setColor(preset.config.color || "#34d399");
			setUppercase(preset.config.uppercase ?? true);
			setKey((prev) => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<ScrambleReveal
  text="${text}"
  scrambleChars="${scrambleChars}"
  duration={${duration}}
  scrambleStagger={${scrambleStagger}}
  revealStagger={${revealStagger}}
  color="${color}"
  uppercase={${uppercase}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="scramble-reveal-title">
				<HeaderText text="Scramble Reveal" option={3} />
			</div>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10 bg-rb-neutral-2 border border-white/5 rounded-xl">
							<ScrambleReveal
								key={key}
								text={text}
								scrambleChars={scrambleChars}
								duration={duration}
								scrambleStagger={scrambleStagger}
								revealStagger={revealStagger}
								color={color}
								uppercase={uppercase}
							/>
						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between ">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Configuration
								</h3>
							</div>
							<div className="flex items-center gap-3">
								<DefaultComboBox
									options={presets}
									value={currentPreset}
									onChange={applyPreset}
									label="Presets"
									dynamicWidth={true}
								/>
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
						label="Target Text"
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
						label="Animation Speed"
						min={0.1}
						max={3}
						step={0.1}
						value={duration}
						onChange={(val) => {
							setDuration(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Scramble Stagger"
						min={0}
						max={0.5}
						step={0.01}
						value={scrambleStagger}
						onChange={(val) => {
							setScrambleStagger(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={2}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Reveal Stagger"
						min={0}
						max={0.5}
						step={0.01}
						value={revealStagger}
						onChange={(val) => {
							setRevealStagger(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={2}
						showTicks={true}
					/>

					<ColorPicker
						label="Accent Color"
						value={color}
						onChange={(val) => {
							setColor(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<DefaultTextInput
						label="Scramble Set"
						value={scrambleChars}
						onChange={(val) => {
							setScrambleChars(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="e.g. !@#$%"
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

export default ScrambleRevealPage;

