"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { MagneticText } from "../../meta/text/Interactive/MagneticText";
import { magneticTextProps, magneticTextComponentCode, creditsData } from "./MagneticTextData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { ComboBox } from "../../components/combobox/ComboBox";

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
			textClassName: "text-6xl tracking-widest font-black uppercase",
		},
	},
];

const colorOptions = [
	{ id: "#c084fc", label: "Purple (#c084fc)" },
	{ id: "#ef4444", label: "Red (#ef4444)" },
	{ id: "#10b981", label: "Emerald (#10b981)" },
	{ id: "inherit", label: "None (Inherit)" },
];

export const MagneticTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [maxDistance, setMaxDistance] = useState(DEFAULT_MAX_DISTANCE);
	const [repelForce, setRepelForce] = useState(DEFAULT_REPEL_FORCE);
	const [hoverColor, setHoverColor] = useState(DEFAULT_HOVER_COLOR);
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
  textClassName="${textClassName}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="magnetic-text-title">
				<HeaderText text="Magnetic Repel" option={3} />
			</div>
			<ParagraphText
				text="Math-based physics pushing letters dynamically away from the cursor as you move closer."
				option={4}
			/>

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
								textClassName={textClassName}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={magneticTextComponentCode}
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
						label="Text"
						value={text}
						onChange={(e) => {
							setText(e.target.value);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter text..."
					/>
					<TextInput
						label="Tailwind Classes"
						value={textClassName}
						onChange={(e) => {
							setTextClassName(e.target.value);
							setKey((prev) => prev + 1);
						}}
						placeholder="e.g. text-5xl font-bold"
					/>

					<ComboBox
						label="Hover Color"
						options={colorOptions}
						value={hoverColor}
						onChange={(val) => {
							setHoverColor(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<DiscreteSlider
						label="Max Distance (px)"
						min={50}
						max={400}
						step={10}
						value={maxDistance}
						onChange={setMaxDistance}
						maxDecimals={0}
						showTicks={false}
					/>
					
					<DiscreteSlider
						label="Repel Force"
						min={0}
						max={150}
						step={5}
						value={repelForce}
						onChange={setRepelForce}
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
				<PropsTable categories={magneticTextProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default MagneticTextPage;
