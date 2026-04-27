"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { FallDown } from "../../meta/text/TextEnter/FallDown";
import { loaderProps, componentCode, creditsData } from "./FallDownData";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "All Hail Rameez";
const DEFAULT_DURATION = 0.5;
const DEFAULT_STAGGER = 0.045;
const DEFAULT_INITIAL_Y = -60;
const DEFAULT_COLOR = "#E8EAF0";

interface Preset {
	id: string;
	label: string;
	config: {
		text: string;
		duration: number;
		stagger: number;
		initialY: number;
		color: string;
		loop: boolean;
		uppercase: boolean;
	};
}

const presets: Preset[] = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "All Hail Rameez",
			duration: 0.5,
			stagger: 0.045,
			initialY: -60,
			color: "#E8EAF0",
			loop: false,
			uppercase: false,
		},
	},
	{
		id: "dramatic",
		label: "Dramatic Drop",
		config: {
			text: "REACTION",
			duration: 0.8,
			stagger: 0.08,
			initialY: -200,
			color: "#FF4D4D",
			loop: true,
			uppercase: true,
		},
	},
	{
		id: "cascade",
		label: "Soft Cascade",
		config: {
			text: "WATERFALL",
			duration: 1.2,
			stagger: 0.03,
			initialY: -40,
			color: "#4DFFB8",
			loop: false,
			uppercase: true,
		},
	},
	{
		id: "rapid",
		label: "Rapid Entry",
		config: {
			text: "FASTEST",
			duration: 0.3,
			stagger: 0.02,
			initialY: -100,
			color: "#4D96FF",
			loop: false,
			uppercase: true,
		},
	},
];

export const FallDownPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [initialY, setInitialY] = useState(DEFAULT_INITIAL_Y);
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [loop, setLoop] = useState(false);
	const [uppercase, setUppercase] = useState(false);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setDuration(preset.config.duration);
			setStagger(preset.config.stagger);
			setInitialY(preset.config.initialY);
			setColor(preset.config.color);
			setLoop(preset.config.loop);
			setUppercase(preset.config.uppercase);
			setKey((prev) => prev + 1); // Trigger replay on preset change
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<FallDown
  text="${text}"
  duration={${duration}}
  stagger={${stagger}}
  initialY={${initialY}}
  color="${color}"
  loop={${loop}}
  uppercase={${uppercase}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="fall-down-title">
				<HeaderText text="Fall Down" option={3} />
			</div>
			<ParagraphText
				text="A dynamic entrance animation where characters drop in from above. Inspired by JP Belley's work, this component features a custom bounce easing and staggered timing."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10">
							<FallDown
								key={key}
								text={text}
								duration={duration}
								stagger={stagger}
								initialY={initialY}
								color={color}
								loop={loop}
								uppercase={uppercase}
								textClassName="text-6xl font-bold tracking-tight font-mono"
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={componentCode}
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
								dynamicWidth={true}
								label="Presets"
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

					<ToggleComponent
						label="Loop Animation"
						checked={loop}
						onChange={setLoop}
					/>

					<DiscreteSlider2
						label="Drop Duration"
						min={0.1}
						max={3}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Stagger Delay"
						min={0}
						max={0.5}
						step={0.005}
						value={stagger}
						onChange={setStagger}
						maxDecimals={3}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Vertical Offset"
						min={-400}
						max={0}
						step={10}
						value={initialY}
						onChange={setInitialY}
						showTicks={true}
					/>

					<ColorPicker
						label="Accent Color"
						value={color}
						onChange={setColor}
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

export default FallDownPage;
