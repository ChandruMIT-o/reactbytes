"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { MagneticText } from "../../meta/text/Interactive/MagneticText";
import { magneticTextProps, magneticTextComponentCode, creditsData } from "./MagneticTextData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";

const DEFAULT_TEXT = "ELASTICITY";
const DEFAULT_MAX_DISTANCE = 140;
const DEFAULT_REPEL_FORCE = 30;
const DEFAULT_HOVER_COLOR = "#c084fc";
const DEFAULT_CLASS = "text-5xl font-bold";

const presets = [
	{
		id: "default",
		label: "Default Bounce",
		config: {
			text: "ELASTICITY",
			maxDistance: 140,
			repelForce: 30,
			hoverColor: "#c084fc",
			color: "#FFFFFF",
			uppercase: true,
			textClassName: "text-5xl font-bold",
		},
	},
	{
		id: "intense",
		label: "Intense Push",
		config: {
			text: "REPULSION",
			maxDistance: 250,
			repelForce: 80,
			hoverColor: "#ef4444",
			color: "#FFFFFF",
			uppercase: true,
			textClassName: "text-6xl tracking-widest font-black uppercase",
		},
	},
];

export const MagneticTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [maxDistance, setMaxDistance] = useState(DEFAULT_MAX_DISTANCE);
	const [repelForce, setRepelForce] = useState(DEFAULT_REPEL_FORCE);
	const [hoverColor, setHoverColor] = useState(DEFAULT_HOVER_COLOR);
	const [color, setColor] = useState("#FFFFFF");
	const [uppercase, setUppercase] = useState(true);
	const [textClassName, setTextClassName] = useState(DEFAULT_CLASS);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setMaxDistance(preset.config.maxDistance);
			setRepelForce(preset.config.repelForce);
			setHoverColor(preset.config.hoverColor);
			setColor(preset.config.color || "#FFFFFF");
			setUppercase(preset.config.uppercase ?? true);
			setTextClassName(preset.config.textClassName);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<MagneticText
  text="${text}"
  maxDistance={${maxDistance}}
  repelForce={${repelForce}}
  hoverColor="${hoverColor}"
  color="${color}"
  uppercase={${uppercase}}
  textClassName="${textClassName}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="magnetic-text-title">
				<HeaderText text="Magnetic Repel" option={3} />
			</div>
			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10">
							<MagneticText
								key={key}
								text={text}
								maxDistance={maxDistance}
								repelForce={repelForce}
								hoverColor={hoverColor}
								color={color}
								uppercase={uppercase}
								textClassName={textClassName}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={magneticTextComponentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between ">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<DefaultComboBox
								options={presets}
								value={currentPreset}
								onChange={applyPreset}
								label="Presets"
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
						label="Magnet Radius"
						min={50}
						max={400}
						step={10}
						value={maxDistance}
						onChange={setMaxDistance}
						maxDecimals={0}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Repel Strength"
						min={0}
						max={150}
						step={5}
						value={repelForce}
						onChange={setRepelForce}
						maxDecimals={0}
						showTicks={true}
					/>

					<ColorPicker
						label="Base Color"
						value={color}
						onChange={(val) => {
							setColor(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<ColorPicker
						label="Active Color"
						value={hoverColor}
						onChange={(val) => {
							setHoverColor(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<DefaultTextInput
						label="Styling Classes"
						value={textClassName}
						onChange={(val) => {
							setTextClassName(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="e.g. text-5xl font-bold"
					/>
				</PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={magneticTextProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default MagneticTextPage;
