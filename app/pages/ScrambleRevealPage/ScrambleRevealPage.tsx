"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ScrambleReveal } from "../../meta/text/TextEnter/ScrambleReveal";
import { loaderProps, componentCode, creditsData } from "./ScrambleRevealData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_TEXT = "CREATIVE";
const DEFAULT_SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
const DEFAULT_DURATION = 0.8;
const DEFAULT_SCRAMBLE_STAGGER = 0.05;
const DEFAULT_REVEAL_STAGGER = 0.1;

const presets = [
	{
		id: "default",
		label: "Classic Push",
		config: {
			text: "CREATIVE",
			scramble: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
			duration: 0.8,
			scrambleStagger: 0.05,
			revealStagger: 0.1,
		},
	},
	{
		id: "matrix",
		label: "System Reveal",
		config: {
			text: "INITIALIZING",
			scramble: "01",
			duration: 0.4,
			scrambleStagger: 0.02,
			revealStagger: 0.05,
		},
	},
	{
		id: "cinematic",
		label: "Cinematic Slow",
		config: {
			text: "PROCESSED",
			scramble: "!@#$%^&*",
			duration: 1.2,
			scrambleStagger: 0.08,
			revealStagger: 0.15,
		},
	},
];

export const ScrambleRevealPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [scrambleChars, setScrambleChars] = useState(DEFAULT_SCRAMBLE);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [scrambleStagger, setScrambleStagger] = useState(DEFAULT_SCRAMBLE_STAGGER);
	const [revealStagger, setRevealStagger] = useState(DEFAULT_REVEAL_STAGGER);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setScrambleChars(preset.config.scramble);
			setDuration(preset.config.duration);
			setScrambleStagger(preset.config.scrambleStagger);
			setRevealStagger(preset.config.revealStagger);
			setKey((prev) => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<ScrambleReveal
  text="${text}"
  scrambleChars="${scrambleChars}"
  duration={${duration}}
  scrambleStagger={${scrambleStagger}}
  revealStagger={${revealStagger}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="scramble-reveal-title">
				<HeaderText text="Scramble Reveal" option={3} />
			</div>
			<ParagraphText
				text="A dynamic text entrance where characters drop in as random symbols before being 'pushed' out by the final characters. Inspired by cinematic terminal reveals and sleek GSAP animations."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10 bg-rb-neutral-2 border border-white/5 rounded-xl">
							<ScrambleReveal
								key={key}
								text={text}
								scrambleChars={scrambleChars}
								duration={duration}
								scrambleStagger={scrambleStagger}
								revealStagger={revealStagger}
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
									Configuration
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
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<TextInput
							label="Target Text"
							value={text}
							onChange={(e) => {
								setText(e.target.value);
								setKey((prev) => prev + 1);
							}}
							placeholder="Enter text..."
						/>

						<TextInput
							label="Scramble Characters"
							value={scrambleChars}
							onChange={(e) => {
								setScrambleChars(e.target.value);
								setKey((prev) => prev + 1);
							}}
							placeholder="e.g. !@#$%"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
						<DiscreteSlider
							label="Phase Duration (s)"
							min={0.1}
							max={3}
							step={0.1}
							value={duration}
							onChange={setDuration}
							maxDecimals={1}
							showTicks={false}
						/>

						<DiscreteSlider
							label="Scramble Stagger (s)"
							min={0}
							max={0.5}
							step={0.01}
							value={scrambleStagger}
							onChange={setScrambleStagger}
							maxDecimals={2}
							showTicks={false}
						/>

						<DiscreteSlider
							label="Reveal Stagger (s)"
							min={0}
							max={0.5}
							step={0.01}
							value={revealStagger}
							onChange={setRevealStagger}
							maxDecimals={2}
							showTicks={false}
						/>
					</div>
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

export default ScrambleRevealPage;

