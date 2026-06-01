"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import VoidOrb from "../../meta/background/space/VoidOrb";
import { loaderProps, componentCode, creditsData } from "./VoidOrbData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { RotateCcw } from "lucide-react";

// Archetype presets matching the Filip Zrnzević artistic sandbox
const presets = [
	{
		id: "void",
		label: "Monochrome Shadow",
		config: {
			primaryColor: "#ffffff",
			secondaryColor: "#7c7c7c",
			accentColor: "#000000",
			fractalScale: 0.35,
			fractalX: 0.0,
			fractalY: 0.0,
			lightCount: 1,
			lightIntensity: 1.2,
			lightSpeed: 0.8,
			grainStrength: 0.16,
			grainSize: 3.5,
			animationSpeed: 0.015,
			autoRotate: true,
		},
	},
	{
		id: "solar",
		label: "Solar Flare",
		config: {
			primaryColor: "#ff9e00",
			secondaryColor: "#ff0055",
			accentColor: "#220000",
			fractalScale: 0.5,
			fractalX: 0.0,
			fractalY: 0.0,
			lightCount: 3,
			lightIntensity: 1.5,
			lightSpeed: 2.0,
			grainStrength: 0.12,
			grainSize: 4.0,
			animationSpeed: 0.03,
			autoRotate: true,
		},
	},
	{
		id: "nebula",
		label: "Deep Nebula",
		config: {
			primaryColor: "#00f0ff",
			secondaryColor: "#aa00ff",
			accentColor: "#050015",
			fractalScale: 0.28,
			fractalX: 0.0,
			fractalY: 0.0,
			lightCount: 4,
			lightIntensity: 1.8,
			lightSpeed: 1.2,
			grainStrength: 0.18,
			grainSize: 2.8,
			animationSpeed: 0.01,
			autoRotate: true,
		},
	},
	{
		id: "emerald",
		label: "Emerald Matrix",
		config: {
			primaryColor: "#00ff66",
			secondaryColor: "#003311",
			accentColor: "#000500",
			fractalScale: 0.45,
			fractalX: 0.0,
			fractalY: 0.0,
			lightCount: 2,
			lightIntensity: 1.0,
			lightSpeed: 1.5,
			grainStrength: 0.22,
			grainSize: 5.0,
			animationSpeed: 0.025,
			autoRotate: true,
		},
	},
];

export const VoidOrbPage = () => {
	const [primaryColor, setPrimaryColor] = useState(presets[0].config.primaryColor);
	const [secondaryColor, setSecondaryColor] = useState(presets[0].config.secondaryColor);
	const [accentColor, setAccentColor] = useState(presets[0].config.accentColor);
	const [fractalScale, setFractalScale] = useState(presets[0].config.fractalScale);
	const [fractalX, setFractalX] = useState(presets[0].config.fractalX);
	const [fractalY, setFractalY] = useState(presets[0].config.fractalY);
	const [lightCount, setLightCount] = useState(presets[0].config.lightCount);
	const [lightIntensity, setLightIntensity] = useState(presets[0].config.lightIntensity);
	const [lightSpeed, setLightSpeed] = useState(presets[0].config.lightSpeed);
	const [grainStrength, setGrainStrength] = useState(presets[0].config.grainStrength);
	const [grainSize, setGrainSize] = useState(presets[0].config.grainSize);
	const [animationSpeed, setAnimationSpeed] = useState(presets[0].config.animationSpeed);
	const [autoRotate, setAutoRotate] = useState(presets[0].config.autoRotate);

	const [currentPreset, setCurrentPreset] = useState("void");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setPrimaryColor(preset.config.primaryColor);
			setSecondaryColor(preset.config.secondaryColor);
			setAccentColor(preset.config.accentColor);
			setFractalScale(preset.config.fractalScale);
			setFractalX(preset.config.fractalX);
			setFractalY(preset.config.fractalY);
			setLightCount(preset.config.lightCount);
			setLightIntensity(preset.config.lightIntensity);
			setLightSpeed(preset.config.lightSpeed);
			setGrainStrength(preset.config.grainStrength);
			setGrainSize(preset.config.grainSize);
			setAnimationSpeed(preset.config.animationSpeed);
			setAutoRotate(preset.config.autoRotate);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("void");
	};

	const usageCode = `<VoidOrb
  primaryColor="${primaryColor}"
  secondaryColor="${secondaryColor}"
  accentColor="${accentColor}"
  fractalScale={${fractalScale}}
  fractalX={${fractalX}}
  fractalY={${fractalY}}
  lightCount={${lightCount}}
  lightIntensity={${lightIntensity}}
  lightSpeed={${lightSpeed}}
  grainStrength={${grainStrength}}
  grainSize={${grainSize}}
  animationSpeed={${animationSpeed}}
  autoRotate={${autoRotate}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="void-orb-title">
				<HeaderText text="Void Orb" option={3} />
			</div>
			<ParagraphText
				text="An interactive WebGL canvas background rendering a high-fidelity fractal-swirled orb space. Built on Three.js shader planes, it supports multiple orbiting lights, procedural static film grain, and responds fluidly to pointer positions and pointer down clicks."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[450px] rounded-2xl relative overflow-hidden bg-black cursor-crosshair">
							<VoidOrb
								primaryColor={primaryColor}
								secondaryColor={secondaryColor}
								accentColor={accentColor}
								fractalScale={fractalScale}
								fractalX={fractalX}
								fractalY={fractalY}
								lightCount={lightCount}
								lightIntensity={lightIntensity}
								lightSpeed={lightSpeed}
								grainStrength={grainStrength}
								grainSize={grainSize}
								animationSpeed={animationSpeed}
								autoRotate={autoRotate}
								className="w-full h-full"
							>
								{/* Sibling content overlays properly wrapped (Rule 3 compliant) */}
								<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-10 select-none">
									<h2 className="text-white text-5xl font-extrabold tracking-tighter uppercase text-center font-mono drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
										Void Orb
									</h2>
									<p className="text-white/60 text-xs font-mono tracking-widest mt-2.5 uppercase text-center">
										Move cursor to sweep lights • Click to warp spatial bounds
									</p>
								</div>
							</VoidOrb>
						</div>
					}
					onReplay={handleReplay}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
					header={
						<div className="flex items-center justify-between">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Controls
								</h3>
							</div>
							<DefaultComboBox
								label="Presets"
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
					<ColorPicker
						label="Primary Glow Color"
						value={primaryColor}
						onChange={(val) => {
							setPrimaryColor(val);
							setCurrentPreset("custom");
						}}
					/>

					<ColorPicker
						label="Secondary Accent Color"
						value={secondaryColor}
						onChange={(val) => {
							setSecondaryColor(val);
							setCurrentPreset("custom");
						}}
					/>

					<ColorPicker
						label="Void Ambient Stop"
						value={accentColor}
						onChange={(val) => {
							setAccentColor(val);
							setCurrentPreset("custom");
						}}
					/>

					<DiscreteSlider2
						label="Orb Sizing Scale"
						min={0.05}
						max={1.5}
						step={0.01}
						value={fractalScale}
						onChange={(val) => {
							setFractalScale(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Offset X"
						min={-1.5}
						max={1.5}
						step={0.05}
						value={fractalX}
						onChange={(val) => {
							setFractalX(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Offset Y"
						min={-1.5}
						max={1.5}
						step={0.05}
						value={fractalY}
						onChange={(val) => {
							setFractalY(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Light Sources"
						min={1}
						max={8}
						step={1}
						value={lightCount}
						onChange={(val) => {
							setLightCount(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Glow Power"
						min={0.2}
						max={3.0}
						step={0.1}
						value={lightIntensity}
						onChange={(val) => {
							setLightIntensity(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Light Speed"
						min={0.0}
						max={4.0}
						step={0.1}
						value={lightSpeed}
						onChange={(val) => {
							setLightSpeed(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Noise Strength"
						min={0.0}
						max={0.4}
						step={0.01}
						value={grainStrength}
						onChange={(val) => {
							setGrainStrength(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Grain Density"
						min={1.0}
						max={8.0}
						step={0.1}
						value={grainSize}
						onChange={(val) => {
							setGrainSize(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Warp Velocity"
						min={0.0}
						max={0.1}
						step={0.002}
						value={animationSpeed}
						onChange={(val) => {
							setAnimationSpeed(val);
							setCurrentPreset("custom");
						}}
						maxDecimals={3}
						showTicks={false}
					/>

					<ToggleComponent
						label="Enable Auto Rotation"
						checked={autoRotate}
						onChange={(val) => {
							setAutoRotate(val);
							setCurrentPreset("custom");
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

export default VoidOrbPage;
