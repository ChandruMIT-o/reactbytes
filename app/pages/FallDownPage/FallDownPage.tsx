"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { FallDown } from "../../meta/text/TextEnter/FallDown";
import { loaderProps, componentCode, creditsData } from "./FallDownData";
import { ComboBox } from "../../components/combobox/ComboBox";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw, Play } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "All Hail Rameez";
const DEFAULT_DURATION = 0.5;
const DEFAULT_STAGGER = 0.045;
const DEFAULT_INITIAL_Y = -60;
const DEFAULT_COLOR = "text-rb-accent-1";

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "All Hail Rameez",
			duration: 0.5,
			stagger: 0.045,
			initialY: -60,
			color: "text-[#E8EAF0]",
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
			color: "text-rb-accent-2",
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
			color: "text-rb-accent-1",
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
			color: "text-rb-accent-3",
		},
	},
];

const colorOptions = [
	{ id: "text-[#E8EAF0]", label: "Default Off-White" },
	{ id: "text-rb-accent-1", label: "Accent 1" },
	{ id: "text-rb-accent-2", label: "Accent 2" },
	{ id: "text-rb-accent-3", label: "Accent 3" },
	{ id: "text-white", label: "Pure White" },
	{ id: "text-emerald-400", label: "Emerald" },
	{ id: "text-rose-400", label: "Rose" },
	{ id: "text-amber-400", label: "Amber" },
];

export const FallDownPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [initialY, setInitialY] = useState(DEFAULT_INITIAL_Y);
	const [textColorClass, setTextColorClass] = useState(DEFAULT_COLOR);
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
			setTextColorClass(preset.config.color);
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
  textColorClass="${textColorClass}"
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
								textColorClass={textColorClass}
								textClassName="text-6xl font-bold tracking-tight font-mono"
							/>
						</div>
					}
					onReplay={handleReplay}
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
								<DefaultComboBox
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
					<TextInput
						label="Text Content"
						value={text}
						onChange={(e) => {
							setText(e.target.value);
							setKey((prev) => prev + 1); // Auto-replay on text change
						}}
						placeholder="Enter text..."
						onClear={() => setText("")}
					/>

					<ComboBox
						label="Text Color"
						options={colorOptions}
						value={textColorClass}
						onChange={setTextColorClass}
					/>

					<DiscreteSlider
						label="Duration (s)"
						min={0.1}
						max={3}
						step={0.1}
						value={duration}
						onChange={setDuration}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Stagger (s)"
						min={0}
						max={0.5}
						step={0.005}
						value={stagger}
						onChange={setStagger}
						maxDecimals={3}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Initial Y Offset"
						min={-400}
						max={0}
						step={10}
						value={initialY}
						onChange={setInitialY}
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

export default FallDownPage;
