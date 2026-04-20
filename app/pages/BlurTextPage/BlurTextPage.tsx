import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { BlurText } from "../../meta/text/BlurText/BlurText";
import { loaderProps, componentCode, creditsData } from "./BlurTextData";
import { ComboBox } from "../../components/combobox/ComboBox";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw, Play } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "REACT BYTES";
const DEFAULT_DURATION = 0.5;
const DEFAULT_STAGGER = 0.1;
const DEFAULT_COLOR = "text-rb-accent-2";
const DEFAULT_BLUR = "4px";

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "REACT BYTES",
			duration: 0.5,
			stagger: 0.1,
			color: "text-rb-accent-2",
			blur: "4px",
		},
	},
	{
		id: "ethereal",
		label: "Ethereal Blur",
		config: {
			text: "ETHEREAL",
			duration: 2.5,
			stagger: 0.4,
			color: "text-rb-accent-1",
			blur: "12px",
		},
	},
	{
		id: "rapid",
		label: "Rapid Fire",
		config: {
			text: "MOTION",
			duration: 0.3,
			stagger: 0.05,
			color: "text-rb-accent-3",
			blur: "2px",
		},
	},
	{
		id: "ghost",
		label: "Ghost Mode",
		config: {
			text: "HAUNTED",
			duration: 1.8,
			stagger: 0.3,
			color: "text-white",
			blur: "32px",
		},
	},
];

const colorOptions = [
	{ id: "text-rb-accent-2", label: "Default Accent" },
	{ id: "text-rb-accent-1", label: "Accent 1" },
	{ id: "text-rb-accent-3", label: "Accent 3" },
	{ id: "text-white", label: "White" },
	{ id: "text-emerald-400", label: "Emerald" },
	{ id: "text-rose-400", label: "Rose" },
	{ id: "text-amber-400", label: "Amber" },
];

export const BlurTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [animationDuration, setAnimationDuration] =
		useState(DEFAULT_DURATION);
	const [staggerDelay, setStaggerDelay] = useState(DEFAULT_STAGGER);
	const [textColorClass, setTextColorClass] = useState(DEFAULT_COLOR);
	const [maxBlur, setMaxBlur] = useState(DEFAULT_BLUR);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setAnimationDuration(preset.config.duration);
			setStaggerDelay(preset.config.stagger);
			setTextColorClass(preset.config.color);
			setMaxBlur(preset.config.blur);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<BlurText
  text="${text}"
  animationDuration={${animationDuration}}
  staggerDelay={${staggerDelay}}
  textColorClass="${textColorClass}"
  maxBlur="${maxBlur}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="blur-text-title">
				<HeaderText text="Blur Text" option={3} />
			</div>
			<ParagraphText
				text="A smooth, stagger-animated text loader with dynamic blur effects. Fully customizable timing, blur intensity, and colors."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[300px] relative overflow-hidden">
							<BlurText
								key={key}
								staggerDelay={staggerDelay}
								animationDuration={animationDuration}
								text={text}
								textColorClass={textColorClass}
								maxBlur={maxBlur}
								textClassName="text-5xl font-bold tracking-[0.2em]"
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
						label="Text Content"
						value={text}
						onChange={(e) => setText(e.target.value)}
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
						value={animationDuration}
						onChange={setAnimationDuration}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Stagger (s)"
						min={0}
						max={1}
						step={0.05}
						value={staggerDelay}
						onChange={setStaggerDelay}
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

export default BlurTextPage;
