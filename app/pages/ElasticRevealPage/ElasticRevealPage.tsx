"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ElasticReveal } from "../../meta/text/Hover/ElasticReveal";
import { loaderProps, componentCode, creditsData } from "./ElasticRevealData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";

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
			baseColor: "#60a5fa",
			hoverColor: "#FFFFFF",
			uppercase: true,
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
			baseColor: "#c084fc",
			hoverColor: "#FFFFFF",
			uppercase: true,
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
			baseColor: "#9ca3af",
			hoverColor: "#34d399",
			uppercase: true,
		},
	},
];

export const ElasticRevealPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [direction, setDirection] = useState<"up" | "down">(DEFAULT_DIRECTION as any);
	const [baseColor, setBaseColor] = useState("#60a5fa");
	const [hoverColor, setHoverColor] = useState("#FFFFFF");
	const [uppercase, setUppercase] = useState(true);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setDuration(preset.config.duration);
			setStagger(preset.config.stagger);
			setDirection(preset.config.direction as any);
			setBaseColor(preset.config.baseColor);
			setHoverColor(preset.config.hoverColor);
			setUppercase(preset.config.uppercase ?? true);
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
  baseColor="${baseColor}"
  hoverColor="${hoverColor}"
  uppercase={${uppercase}}
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
						<div className="w-full h-[400px] relative overflow-hidden flex flex-col items-center justify-center p-10 bg-rb-neutral-1 rounded-xl gap-8">
							<ElasticReveal
								key={key}
								text={text}
								duration={duration}
								stagger={stagger}
								direction={direction}
								baseColor={baseColor}
								hoverColor={hoverColor}
								uppercase={uppercase}
							/>

						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
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
						onChange={(val: string) => {
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
						label="Entrance Duration"
						min={0.1}
						max={2}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Stagger Delay"
						min={0}
						max={0.2}
						step={0.01}
						value={stagger}
						onChange={setStagger}
						maxDecimals={2}
						showTicks={true}
					/>

					<DefaultComboBox
						label="Reveal Direction"
						options={[
							{ id: "up", label: "Roll Up" },
							{ id: "down", label: "Roll Down" },
						]}
						value={direction}
						onChange={(val: string) => setDirection(val as "up" | "down")}
						dynamicWidth={true}
					/>

					<ColorPicker
						label="Base Color"
						value={baseColor}
						onChange={(val: string) => {
							setBaseColor(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<ColorPicker
						label="Active Color"
						value={hoverColor}
						onChange={(val: string) => {
							setHoverColor(val);
							setKey((prev) => prev + 1);
						}}
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
