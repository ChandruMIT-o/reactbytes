"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import CellularAutomataBackground from "../../meta/background/cellular/CellularAutomataBackground";
import { fluxProps, componentCode, creditsData } from "./CellularAutomataData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";

const presets = [
	{
		id: "electric-silk",
		label: "Electric Silk",
		config: {
			title: "FLUX ENERGY",
			colorA: "#050812",
			colorB: "#1e1b4b",
			colorC: "#818cf8",
			speed: 0.5,
			scale: 1.0,
			intensity: 1.2,
		},
	},
	{
		id: "solar-winds",
		label: "Solar Winds",
		config: {
			title: "PLASMA FLOW",
			colorA: "#0c0202",
			colorB: "#78350f",
			colorC: "#fbbf24",
			speed: 0.8,
			scale: 1.5,
			intensity: 1.3,
		},
	},
	{
		id: "deep-ocean",
		label: "Deep Ocean",
		config: {
			title: "ABYSSAL PURE",
			colorA: "#020808",
			colorB: "#0e7490",
			colorC: "#2dd4bf",
			speed: 0.3,
			scale: 0.8,
			intensity: 1.1,
		},
	},
	{
		id: "ethereal-mist",
		label: "Ethereal Mist",
		config: {
			title: "NEBULA DRIFT",
			colorA: "#0a0a0a",
			colorB: "#262626",
			colorC: "#ffffff",
			speed: 0.1,
			scale: 2.0,
			intensity: 0.9,
		},
	},
];

export const CellularAutomataPage = () => {
	// Keep the component name as is but change the logic internally to avoid breaking routes
	const defaultPreset = presets[0];

	const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
	const [title, setTitle] = useState(defaultPreset.config.title);
	const [colorA, setColorA] = useState(defaultPreset.config.colorA);
	const [colorB, setColorB] = useState(defaultPreset.config.colorB);
	const [colorC, setColorC] = useState(defaultPreset.config.colorC);
	const [speed, setSpeed] = useState(defaultPreset.config.speed);
	const [scale, setScale] = useState(defaultPreset.config.scale);
	const [intensity, setIntensity] = useState(defaultPreset.config.intensity);
	const [opacity, setOpacity] = useState(1.0);
	const [vignetteIntensity, setVignetteIntensity] = useState(0.6);
	const [blurAmount, setBlurAmount] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
		setCurrentPreset(presetId);
		setTitle(preset.config.title);
		setColorA(preset.config.colorA);
		setColorB(preset.config.colorB);
		setColorC(preset.config.colorC);
		setSpeed(preset.config.speed);
		setScale(preset.config.scale);
		setIntensity(preset.config.intensity);
		setOpacity(1.0);
		setVignetteIntensity(0.6);
		setBlurAmount(0);
	};

	const handleReset = () => applyPreset(defaultPreset.id);

	const usageCode = `<FluxBackground
  colorA="${colorA}"
  colorB="${colorB}"
  colorC="${colorC}"
  speed={${speed}}
  scale={${scale}}
  intensity={${intensity}}
  opacity={${opacity}}
  vignetteIntensity={${vignetteIntensity}}
  blurAmount={${blurAmount}}
>
  <h1 className="text-white font-bold">{title}</h1>
</FluxBackground>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="cellular-title">
				<HeaderText text="Flux Energy Flow" option={3} />
			</div>
			<ParagraphText
				text="A shimmering, multi-layered energy flow. Using high-performance Simplex noise and chromatic refraction, this animation creates a premium 'liquid silk' effect that responds to interaction. Highly performant and visually striking."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[560px] rounded-[28px] overflow-hidden border border-white/10 bg-black shadow-2xl relative">
							<CellularAutomataBackground
								colorA={colorA}
								colorB={colorB}
								colorC={colorC}
								speed={speed}
								scale={scale}
								intensity={intensity}
								opacity={opacity}
								vignetteIntensity={vignetteIntensity}
								blurAmount={blurAmount}
							>
								<div className="flex flex-col items-center gap-3 text-center px-6">
									<div className="text-[clamp(1.5rem,5vw,3.5rem)] font-bold tracking-[0.2em] text-white">
										{title}
									</div>
									<div className="max-w-lg text-white/50 text-xs md:text-sm tracking-widest uppercase bg-black/50 backdrop-blur-xl px-8 py-2.5 rounded-full border border-white/10">
										Stochastic Energy Field
									</div>
								</div>
							</CellularAutomataBackground>
						</div>
					}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase tracking-[0.1em]">Engine Parameters</h3>
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
						label="Hero Text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Enter text..."
					/>

					<DiscreteSlider
						label="Flow Velocity"
						min={0.1}
						max={2.0}
						step={0.1}
						value={speed}
						onChange={setSpeed}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Noise Complexity (Scale)"
						min={0.5}
						max={3.0}
						step={0.1}
						value={scale}
						onChange={setScale}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Energy Intensity"
						min={0.5}
						max={2.0}
						step={0.1}
						value={intensity}
						onChange={setIntensity}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Display Opacity"
						min={0.0}
						max={1.0}
						step={0.1}
						value={opacity}
						onChange={setOpacity}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Vignette Strength"
						min={0.0}
						max={1.0}
						step={0.1}
						value={vignetteIntensity}
						onChange={setVignetteIntensity}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider
						label="Atmospheric Blur"
						min={0}
						max={20}
						step={1}
						value={blurAmount}
						onChange={setBlurAmount}
						maxDecimals={0}
						showTicks={false}
					/>

					<div className="space-y-4 pt-4 border-t border-rb-neutral-4/30">
						<ColorPicker
							label="Void Phase"
							value={colorA}
							onChange={setColorA}
							compact={true}
							presets={["#050812", "#0a0a0a", "#020808", "#0c0202"]}
						/>

						<ColorPicker
							label="Flow Phase"
							value={colorB}
							onChange={setColorB}
							compact={true}
							presets={["#1e1b4b", "#1a1a1a", "#0e7490", "#78350f"]}
						/>

						<ColorPicker
							label="Strand Phase"
							value={colorC}
							onChange={setColorC}
							compact={true}
							presets={["#818cf8", "#ffffff", "#2dd4bf", "#fbbf24"]}
						/>
					</div>
				</PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={fluxProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default CellularAutomataPage;
