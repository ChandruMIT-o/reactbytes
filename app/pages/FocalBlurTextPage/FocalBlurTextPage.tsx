"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { FocalBlurText } from "../../meta/text/Interactive/FocalBlurText";
import { focalBlurTextProps, focalBlurTextComponentCode, creditsData } from "./FocalBlurTextData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { ComboBox } from "../../components/combobox/ComboBox";

const DEFAULT_TEXT = "PERSPECTIVE";
const DEFAULT_MAX_DISTANCE = 250;
const DEFAULT_MAX_BLUR = 12;
const DEFAULT_FOCUS_COLOR = "#60a5fa";
const DEFAULT_CLASS = "text-5xl font-black";

const presets = [
	{
		id: "default",
		label: "Default Perspective",
		config: {
			text: "PERSPECTIVE",
			maxDistance: 250,
			maxBlur: 12,
			focusColor: "#60a5fa",
			textClassName: "text-5xl font-black",
		},
	},
	{
		id: "heavy_blur",
		label: "Heavy Depth",
		config: {
			text: "MYSTERY",
			maxDistance: 150,
			maxBlur: 24,
			focusColor: "#f43f5e",
			textClassName: "text-6xl tracking-widest font-black uppercase",
		},
	},
];

const colorOptions = [
	{ id: "#60a5fa", label: "Blue (#60a5fa)" },
	{ id: "#f43f5e", label: "Rose (#f43f5e)" },
	{ id: "#34d399", label: "Emerald (#34d399)" },
	{ id: "inherit", label: "None (Inherit)" },
];

export const FocalBlurTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [maxDistance, setMaxDistance] = useState(DEFAULT_MAX_DISTANCE);
	const [maxBlur, setMaxBlur] = useState(DEFAULT_MAX_BLUR);
	const [focusColor, setFocusColor] = useState(DEFAULT_FOCUS_COLOR);
	const [textClassName, setTextClassName] = useState(DEFAULT_CLASS);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setMaxDistance(preset.config.maxDistance);
			setMaxBlur(preset.config.maxBlur);
			setFocusColor(preset.config.focusColor);
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

	const usageCode = `<FocalBlurText
  text="${text}"
  maxDistance={${maxDistance}}
  maxBlur={${maxBlur}}
  focusColor="${focusColor}"
  textClassName="${textClassName}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="focal-blur-title">
				<HeaderText text="Focal Depth Blur" option={3} />
			</div>
			<ParagraphText
				text="Applies dynamic gaussian blur, scaling, and opacity to simulate a camera lens focusing in and out based on cursor distance."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10">
							<FocalBlurText
								key={key}
								text={text}
								maxDistance={maxDistance}
								maxBlur={maxBlur}
								focusColor={focusColor}
								textClassName={textClassName}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={focalBlurTextComponentCode}
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
						placeholder="e.g. text-5xl font-black"
					/>

					<ComboBox
						label="Focus Color"
						options={colorOptions}
						value={focusColor}
						onChange={(val) => {
							setFocusColor(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<DiscreteSlider
						label="Max Distance (px)"
						min={50}
						max={600}
						step={10}
						value={maxDistance}
						onChange={setMaxDistance}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Max Blur (px)"
						min={0}
						max={36}
						step={1}
						value={maxBlur}
						onChange={setMaxBlur}
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
				<PropsTable categories={focalBlurTextProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default FocalBlurTextPage;
