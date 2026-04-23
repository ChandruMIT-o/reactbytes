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

const DEFAULT_TEXT = "BLURRY MOTION";
const DEFAULT_DURATION = 0.6;
const DEFAULT_STAGGER = 0.05;
const DEFAULT_COLOR = "text-rb-accent-2";
const DEFAULT_ANIMATE_BY = "letters";
const DEFAULT_DIRECTION = "none";
const DEFAULT_DELAY = 0;
const DEFAULT_LOOP = false;
const DEFAULT_BLUR_AMOUNT = 10;

const presets = [
	{
		id: "soft-reveal",
		label: "Soft Reveal",
		config: {
			text: "SOFT REVEAL",
			duration: 0.5,
			stagger: 0.04,
			color: "text-rb-accent-2",
			animateBy: "letters",
			direction: "top",
			delay: 0,
			loop: false,
			blurAmount: 8,
		},
	},
	{
		id: "infinite-fog",
		label: "Infinite Fog",
		config: {
			text: "DREAMY...",
			duration: 1.2,
			stagger: 0.1,
			color: "text-rb-accent-1",
			animateBy: "letters",
			direction: "none",
			delay: 0,
			loop: true,
			blurAmount: 20,
		},
	},
	{
		id: "smoky",
		label: "Smoky Entrance",
		config: {
			text: "SMOKY MOTION",
			duration: 1.8,
			stagger: 0.08,
			color: "text-white",
			animateBy: "letters",
			direction: "bottom",
			delay: 0,
			loop: false,
			blurAmount: 40,
		},
	},
	{
		id: "sharp-reveal",
		label: "Sharp Reveal",
		config: {
			text: "CLEAN & SHARP",
			duration: 0.3,
			stagger: 0.02,
			color: "text-emerald-400",
			animateBy: "letters",
			direction: "top",
			delay: 0,
			loop: false,
			blurAmount: 4,
		},
	},
	{
		id: "slow-dissolve",
		label: "Slow Dissolve",
		config: {
			text: "DISSOLVING",
			duration: 2.5,
			stagger: 0.15,
			color: "text-rb-accent-3",
			animateBy: "words",
			direction: "none",
			delay: 0,
			loop: false,
			blurAmount: 32,
		},
	},
	{
		id: "pulse-flicker",
		label: "Rapid Flicker",
		config: {
			text: "FLICKERING",
			duration: 0.2,
			stagger: 0.03,
			color: "text-rose-400",
			animateBy: "letters",
			direction: "none",
			delay: 0,
			loop: true,
			blurAmount: 12,
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

const animateByOptions = [
	{ id: "letters", label: "Letters" },
	{ id: "words", label: "Words" },
];

const directionOptions = [
	{ id: "top", label: "Top" },
	{ id: "bottom", label: "Bottom" },
	{ id: "none", label: "None" },
];

export const BlurTextPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [textColorClass, setTextColorClass] = useState(DEFAULT_COLOR);
	const [animateBy, setAnimateBy] = useState<"letters" | "words">(
		DEFAULT_ANIMATE_BY as any
	);
	const [direction, setDirection] = useState<"top" | "bottom" | "none">(
		DEFAULT_DIRECTION as any
	);
	const [delay, setDelay] = useState(DEFAULT_DELAY);
	const [loop, setLoop] = useState(DEFAULT_LOOP);
	const [blurAmount, setBlurAmount] = useState(DEFAULT_BLUR_AMOUNT);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setDuration(preset.config.duration);
			setStagger(preset.config.stagger);
			setTextColorClass(preset.config.color);
			setAnimateBy(preset.config.animateBy as any);
			setDirection(preset.config.direction as any);
			setDelay(preset.config.delay);
			setLoop(preset.config.loop || false);
			setBlurAmount(preset.config.blurAmount);
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
  duration={${duration}}
  stagger={${stagger}}
  direction="${direction}"
  animateBy="${animateBy}"
  delay={${delay}}
  loop={${loop}}
  blurAmount={${blurAmount}}
  className="text-3xl sm:text-5xl font-bold ${textColorClass}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="blur-text-title">
				<HeaderText text="Blur Text" option={3} />
			</div>
			<ParagraphText
				text="A smooth, stagger-animated text entrance with dynamic blur and directional reveal effects. Powered by Framer Motion for high-fidelity micro-interactions."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[250px] sm:h-[300px] relative overflow-hidden flex items-center justify-center">
							<BlurText
								key={key}
								text={text}
								duration={duration}
								stagger={stagger}
								direction={direction}
								animateBy={animateBy}
								delay={delay}
								loop={loop}
								blurAmount={blurAmount}
								className={`text-3xl sm:text-5xl font-bold tracking-[0.1em] sm:tracking-[0.2em] ${textColorClass}`}
							/>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between gap-3">
							<div className="hidden sm:block">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<div className="flex items-center gap-3 flex-1 sm:flex-none justify-start sm:justify-end">
								<div className="flex-1 sm:flex-none">
									<DefaultComboBox
										options={presets}
										value={currentPreset}
										onChange={applyPreset}
										dynamicWidth={true}
									/>
								</div>
								<button
									onClick={handleReset}
									className="group p-2.5 rounded-full bg-rb-neutral-3 text-rb-accent-1/40 border border-rb-neutral-4 hover:text-rb-accent-3 transition-all duration-300 shrink-0"
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

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<ComboBox
							label="Text Color"
							options={colorOptions}
							value={textColorClass}
							onChange={setTextColorClass}
						/>
						<div className="flex flex-col gap-2">
							<span className="text-xs font-bold text-rb-accent-1 uppercase">
								Animation Loop
							</span>
							<button
								onClick={() => setLoop(!loop)}
								className={`
                  flex items-center justify-between px-4 py-2.5 rounded-full border transition-all duration-300
                  ${
										loop
											? "bg-rb-accent-1/10 border-rb-accent-1 text-rb-accent-1"
											: "bg-rb-neutral-3 border-rb-neutral-4 text-rb-accent-1/40 hover:border-rb-accent-1/20"
									}
                `}
							>
								<span className="text-sm font-medium">
									{loop ? "Enabled" : "Disabled"}
								</span>
								<div
									className={`w-2 h-2 rounded-full transition-all duration-500 ${
										loop
											? "bg-rb-accent-1 shadow-[0_0_8px_rgba(var(--rb-accent-1-rgb),0.5)]"
											: "bg-rb-neutral-4"
									}`}
								/>
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<ComboBox
							label="Animate By"
							options={animateByOptions}
							value={animateBy}
							onChange={(val: any) => setAnimateBy(val)}
						/>
						<ComboBox
							label="Direction"
							options={directionOptions}
							value={direction}
							onChange={(val: any) => setDirection(val)}
						/>
					</div>

					<DiscreteSlider
						label="Blur Amount (px)"
						min={0}
						max={100}
						step={1}
						value={blurAmount}
						onChange={setBlurAmount}
						maxDecimals={0}
						showTicks={false}
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
							max={1}
							step={0.01}
							value={stagger}
							onChange={setStagger}
							maxDecimals={2}
							showTicks={false}
						/>
					</div>

					<DiscreteSlider
						label="Initial Delay (s)"
						min={0}
						max={2}
						step={0.1}
						value={delay}
						onChange={setDelay}
						maxDecimals={1}
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

