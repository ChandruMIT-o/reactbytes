"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { KineticText } from "../../meta/text/Interactive/KineticText";
import { loaderProps, componentCode, creditsData } from "./KineticTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "KINETIC";
const DEFAULT_COLOR = "#ffffff";
const DEFAULT_ACTIVE_STROKE = "rgba(0, 245, 255, 0.45)";
const DEFAULT_STROKE = "rgba(255, 255, 255, 0.08)";
const DEFAULT_STAGGER = 80;

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "KINETIC",
			color: "#ffffff",
			activeStrokeColor: "rgba(0, 245, 255, 0.45)",
			strokeColor: "rgba(255, 255, 255, 0.08)",
			staggerDelay: 80,
		},
	},
	{
		id: "matrix",
		label: "Matrix Green",
		config: {
			text: "MATRIX",
			color: "#00ff66",
			activeStrokeColor: "rgba(0, 255, 102, 0.5)",
			strokeColor: "rgba(0, 50, 20, 0.15)",
			staggerDelay: 50,
		},
	},
	{
		id: "cyberpunk",
		label: "Cyberpunk Neon",
		config: {
			text: "CYBER",
			color: "#ffe600",
			activeStrokeColor: "rgba(255, 0, 110, 0.6)",
			strokeColor: "rgba(255, 230, 0, 0.05)",
			staggerDelay: 120,
		},
	},
];

export const KineticTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [activeStrokeColor, setActiveStrokeColor] = useState(DEFAULT_ACTIVE_STROKE);
	const [strokeColor, setStrokeColor] = useState(DEFAULT_STROKE);
	const [staggerDelay, setStaggerDelay] = useState(DEFAULT_STAGGER);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setColor(preset.config.color);
			setActiveStrokeColor(preset.config.activeStrokeColor);
			setStrokeColor(preset.config.strokeColor);
			setStaggerDelay(preset.config.staggerDelay);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<KineticText
  text="${text}"
  color="${color}"
  activeStrokeColor="${activeStrokeColor}"
  strokeColor="${strokeColor}"
  staggerDelay={${staggerDelay}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="kinetic-text-title">
				<HeaderText text="Kinetic Ribbon Text" option={3} />
			</div>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[450px] relative overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-3xl">
							<KineticText
								key={key}
								text={text}
								color={color}
								activeStrokeColor={activeStrokeColor}
								strokeColor={strokeColor}
								staggerDelay={staggerDelay}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between">
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

					<DiscreteSlider2
						label="Stagger Delay (ms)"
						min={10}
						max={300}
						step={10}
						value={staggerDelay}
						onChange={setStaggerDelay}
						maxDecimals={0}
						showTicks={true}
					/>

					<ColorPicker
						label="Letter Color"
						value={color}
						onChange={setColor}
					/>

					<ColorPicker
						label="Active Ribbon Color"
						value={activeStrokeColor}
						onChange={setActiveStrokeColor}
					/>

					<ColorPicker
						label="Inactive Ribbon Color"
						value={strokeColor}
						onChange={setStrokeColor}
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

export default KineticTextPage;
