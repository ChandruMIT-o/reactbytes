"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ElasticReveal } from "../../meta/text/Hover/ElasticReveal";
import { loaderProps, componentCode, creditsData } from "./ElasticRevealData";
import { ComboBox } from "../../components/combobox/ComboBox";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "REACTBYTES";
const DEFAULT_DURATION = 0.6;
const DEFAULT_STAGGER = 0.02;
const DEFAULT_DIRECTION = "up";

const presets = [
	{
		id: "default",
		label: "Classic Roll",
		config: {
			text: "REACTBYTES",
			duration: 0.6,
			stagger: 0.02,
			direction: "up",
			base: "text-rb-accent-2",
			hover: "text-rb-accent-1",
		},
	},
	{
		id: "social",
		label: "Social Style",
		config: {
			text: "INSTAGRAM",
			duration: 0.8,
			stagger: 0.04,
			direction: "down",
			base: "text-rb-accent-3",
			hover: "text-white",
		},
	},
	{
		id: "rapid",
		label: "Rapid Kick",
		config: {
			text: "GO FAST",
			duration: 0.3,
			stagger: 0.01,
			direction: "up",
			base: "text-white/40",
			hover: "text-rb-accent-1",
		},
	},
];

const colorOptions = [
	{ id: "text-rb-accent-1", label: "Accent 1" },
	{ id: "text-rb-accent-2", label: "Accent 2" },
	{ id: "text-rb-accent-3", label: "Accent 3" },
	{ id: "text-white", label: "White" },
	{ id: "text-white/40", label: "Muted White" },
];

export const ElasticRevealPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [direction, setDirection] = useState<any>(DEFAULT_DIRECTION);
	const [baseColorClass, setBaseColorClass] = useState("text-rb-accent-2");
	const [hoverColorClass, setHoverColorClass] = useState("text-rb-accent-1");
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setDuration(preset.config.duration);
			setStagger(preset.config.stagger);
			setDirection(preset.config.direction);
			setBaseColorClass(preset.config.base);
			setHoverColorClass(preset.config.hover);
			setKey((prev) => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<ElasticReveal
  text="${text}"
  duration={${duration}}
  stagger={${stagger}}
  direction="${direction}"
  baseColorClass="${baseColorClass}"
  hoverColorClass="${hoverColorClass}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="elastic-reveal-title">
				<HeaderText text="Elastic Reveal" option={3} />
			</div>
			<ParagraphText
				text="A high-energy hover interaction where characters roll away to reveal a new state. Featuring staggered character delays and customizable easing for a fluid, spring-like feel."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex flex-col items-center justify-center p-10 bg-rb-neutral-2 border border-white/5 rounded-xl gap-8">
							<ElasticReveal
								key={key}
								text={text}
								duration={duration}
								stagger={stagger}
								direction={direction}
								baseColorClass={baseColorClass}
								hoverColorClass={hoverColorClass}
							/>

						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
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

					<div className="grid grid-cols-2 gap-4">
						<ComboBox
							label="Base Color"
							options={colorOptions}
							value={baseColorClass}
							onChange={setBaseColorClass}
						/>
						<ComboBox
							label="Hover Color"
							options={colorOptions}
							value={hoverColorClass}
							onChange={setHoverColorClass}
						/>
					</div>

					<ComboBox
						label="Direction"
						options={[
							{ id: "up", label: "Roll Up" },
							{ id: "down", label: "Roll Down" },
						]}
						value={direction}
						onChange={setDirection}
					/>

					<DiscreteSlider
						label="Duration (s)"
						min={0.1}
						max={2}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Stagger (s)"
						min={0}
						max={0.2}
						step={0.01}
						value={stagger}
						onChange={setStagger}
						maxDecimals={2}
						showTicks={false}
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

export default ElasticRevealPage;
