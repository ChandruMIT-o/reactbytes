"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { WaveText } from "../../meta/text/Interactive/WaveText";
import { waveTextProps, waveTextComponentCode, creditsData } from "./WaveTextData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { ComboBox } from "../../components/combobox/ComboBox";

const DEFAULT_TEXT = "RESONANCE";
const DEFAULT_MAX_DISTANCE = 120;
const DEFAULT_HOVER_COLOR = "#34d399";
const DEFAULT_CLASS = "text-5xl font-bold";

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "RESONANCE",
			maxDistance: 120,
			hoverColor: "#34d399",
			textClassName: "text-5xl font-bold",
		},
	},
	{
		id: "wide",
		label: "Wide Ripple",
		config: {
			text: "AMPLITUDE",
			maxDistance: 200,
			hoverColor: "#fbbf24",
			textClassName: "text-5xl tracking-widest font-black",
		},
	},
];

const colorOptions = [
	{ id: "#34d399", label: "Emerald (#34d399)" },
	{ id: "#fbbf24", label: "Amber (#fbbf24)" },
	{ id: "#60a5fa", label: "Blue (#60a5fa)" },
	{ id: "#c084fc", label: "Purple (#c084fc)" },
];

export const WaveTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [maxDistance, setMaxDistance] = useState(DEFAULT_MAX_DISTANCE);
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

	const usageCode = `<WaveText
  text="${text}"
  maxDistance={${maxDistance}}
  hoverColor="${hoverColor}"
  textClassName="${textClassName}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="wave-text-title">
				<HeaderText text="Proximity Ripple" option={3} />
			</div>
			<ParagraphText
				text="Letters scale, jump, and twist dynamically based on their distance to the cursor on the X-axis."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10">
							<WaveText
								key={key}
								text={text}
								maxDistance={maxDistance}
								hoverColor={hoverColor}
								textClassName={textClassName}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={waveTextComponentCode}
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
						placeholder="e.text-5xl font-bold"
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
						min={0}
						max={400}
						step={10}
						value={maxDistance}
						onChange={setMaxDistance}
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
				<PropsTable categories={waveTextProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default WaveTextPage;
