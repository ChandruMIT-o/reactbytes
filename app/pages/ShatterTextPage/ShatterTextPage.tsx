"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ShatterText } from "../../meta/text/Interactive/ShatterText";
import { shatterTextProps, shatterTextComponentCode, creditsData } from "./ShatterTextData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "FRAGMENTED";
const DEFAULT_SCATTER_FACTOR = 400;
const DEFAULT_CLASS = "text-5xl font-black text-rb-accent-1";

const presets = [
	{
		id: "default",
		label: "Default Fracture",
		config: {
			text: "FRAGMENTED",
			scatterFactor: 400,
			textClassName: "text-5xl font-black text-rb-accent-1",
		},
	},
	{
		id: "explosive",
		label: "Explosive Scatter",
		config: {
			text: "SUPERNOVA",
			scatterFactor: 800,
			textClassName: "text-6xl tracking-widest font-black uppercase text-rose-500",
		},
	},
];

export const ShatterTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [scatterFactor, setScatterFactor] = useState(DEFAULT_SCATTER_FACTOR);
	const [textClassName, setTextClassName] = useState(DEFAULT_CLASS);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setScatterFactor(preset.config.scatterFactor);
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

	const usageCode = `<ShatterText
  text="${text}"
  scatterFactor={${scatterFactor}}
  textClassName="${textClassName}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="shatter-text-title">
				<HeaderText text="Cinematic Shatter" option={3} />
			</div>
			<ParagraphText
				text="Calculates random X, Y, and rotation coordinates for a chaotic blur-reveal. Click on the text to replay the animation."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10">
							<ShatterText
								key={key}
								text={text}
								scatterFactor={scatterFactor}
								textClassName={textClassName}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={shatterTextComponentCode}
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
						placeholder="e.g. text-5xl font-black text-rose-500"
					/>

					<DiscreteSlider
						label="Scatter Factor"
						min={100}
						max={1500}
						step={50}
						value={scatterFactor}
						onChange={(val) => {
							setScatterFactor(val);
							setKey((prev) => prev + 1);
						}}
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
				<PropsTable categories={shatterTextProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default ShatterTextPage;
