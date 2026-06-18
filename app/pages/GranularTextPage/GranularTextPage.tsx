"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { GranularText } from "../../meta/text/Interactive/GranularText";
import { loaderProps, componentCode, creditsData } from "./GranularTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "MORPH";
const DEFAULT_RADIUS = 65;
const DEFAULT_FORCE = 7;
const DEFAULT_GRAVITY = 0.35;
const DEFAULT_COOLDOWN = 100;
const DEFAULT_RECALL_SPEED = 0.14;
const DEFAULT_COLOR = "#ffffff";
const DEFAULT_ACTIVE_COLOR = "#f59e0b";
const DEFAULT_RECALL_COLOR = "#3b82f6";

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "MORPH",
			radius: 65,
			force: 7,
			gravity: 0.35,
			cooldown: 100,
			recallSpeed: 0.14,
			color: "#ffffff",
			activeColorHex: "#f59e0b",
			recallColorHex: "#3b82f6",
		},
	},
	{
		id: "gold",
		label: "Golden Dispersion",
		config: {
			text: "GOLD",
			radius: 80,
			force: 10,
			gravity: 0.2,
			cooldown: 150,
			recallSpeed: 0.08,
			color: "#ffd700",
			activeColorHex: "#ffd700",
			recallColorHex: "#ff8c00",
		},
	},
	{
		id: "crash",
		label: "High Gravity Collapse",
		config: {
			text: "CRASH",
			radius: 100,
			force: 12,
			gravity: 0.8,
			cooldown: 60,
			recallSpeed: 0.25,
			color: "#ef4444",
			activeColorHex: "#f59e0b",
			recallColorHex: "#ffffff",
		},
	},
];

export const GranularTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [radius, setRadius] = useState(DEFAULT_RADIUS);
	const [force, setForce] = useState(DEFAULT_FORCE);
	const [gravity, setGravity] = useState(DEFAULT_GRAVITY);
	const [cooldown, setCooldown] = useState(DEFAULT_COOLDOWN);
	const [recallSpeed, setRecallSpeed] = useState(DEFAULT_RECALL_SPEED);
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [activeColorHex, setActiveColorHex] = useState(DEFAULT_ACTIVE_COLOR);
	const [recallColorHex, setRecallColorHex] = useState(DEFAULT_RECALL_COLOR);
	const [coherence, setCoherence] = useState(100);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setRadius(preset.config.radius);
			setForce(preset.config.force);
			setGravity(preset.config.gravity);
			setCooldown(preset.config.cooldown);
			setRecallSpeed(preset.config.recallSpeed);
			setColor(preset.config.color);
			setActiveColorHex(preset.config.activeColorHex);
			setRecallColorHex(preset.config.recallColorHex);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<GranularText
  text="${text}"
  radius={${radius}}
  force={${force}}
  gravity={${gravity}}
  cooldown={${cooldown}}
  recallSpeed={${recallSpeed}}
  color="${color}"
  activeColorHex="${activeColorHex}"
  recallColorHex="${recallColorHex}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="granular-text-title">
				<HeaderText text="Granular Sand Text" option={3} />
			</div>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[450px] relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-3xl">
							<GranularText
								key={key}
								text={text}
								radius={radius}
								force={force}
								gravity={gravity}
								cooldown={cooldown}
								recallSpeed={recallSpeed}
								color={color}
								activeColorHex={activeColorHex}
								recallColorHex={recallColorHex}
								onCoherenceChange={setCoherence}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
							<div className="flex items-center gap-6 ml-4">
								<div className="flex flex-col gap-1">
									<h3 className="text-xs font-bold text-rb-accent-1 uppercase">
										Props
									</h3>
								</div>
								<div className="flex gap-4 text-xs font-mono">
									<div>
										<span className="text-zinc-500">COHERENCE:</span>{" "}
										<span
											className={`font-bold tracking-widest ${
												coherence < 100 ? "text-amber-500" : "text-emerald-400"
											}`}
										>
											{coherence}%
										</span>
									</div>
									<div className="hidden sm:block">
										<span className="text-zinc-500">FIELD:</span>{" "}
										<span className="text-zinc-300 font-bold">
											{coherence === 100 ? "STABLE" : "INTERPOLATING"}
										</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3 self-end sm:self-auto">
								<DefaultComboBox
									label="Presets"
									options={presets}
									value={currentPreset}
									onChange={applyPreset}
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
						label="Display Text"
						value={text}
						onChange={(val) => {
							setText(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter text..."
					/>

					<DiscreteSlider2
						label="Interaction Radius"
						min={20}
						max={200}
						step={5}
						value={radius}
						onChange={setRadius}
						maxDecimals={0}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Explosion Strength"
						min={1}
						max={20}
						step={0.5}
						value={force}
						onChange={setForce}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Gravity Downdraft"
						min={0.05}
						max={2.0}
						step={0.05}
						value={gravity}
						onChange={setGravity}
						maxDecimals={2}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Reassembly Latency"
						min={10}
						max={300}
						step={10}
						value={cooldown}
						onChange={setCooldown}
						maxDecimals={0}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Snap Recall Speed"
						min={0.01}
						max={0.5}
						step={0.01}
						value={recallSpeed}
						onChange={setRecallSpeed}
						maxDecimals={2}
						showTicks={true}
					/>

					<ColorPicker
						label="Stable Text Color"
						value={color}
						onChange={setColor}
					/>

					<ColorPicker
						label="Dispersion Color"
						value={activeColorHex}
						onChange={setActiveColorHex}
					/>

					<ColorPicker
						label="Recall Color"
						value={recallColorHex}
						onChange={setRecallColorHex}
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

export default GranularTextPage;
