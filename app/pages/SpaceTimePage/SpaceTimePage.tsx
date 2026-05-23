"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { SpaceTime } from "../../meta/background/topographic/SpaceTime";
import { loaderProps, componentCode, creditsData } from "./SpaceTimeData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_LOOP_DURATION = 1200;
const DEFAULT_STROKE_COLOR = "#00e5ff";
const DEFAULT_BG_COLOR = "#020205";
const DEFAULT_STROKE_WIDTH = 4;
const DEFAULT_PARALLAX_AMOUNT = 0.04;
const DEFAULT_WARP_STRENGTH = -8;
const DEFAULT_DISTORTION_SCALE = 7;
const DEFAULT_GLOW_INTENSITY = 0.4;
const DEFAULT_NOISE_ENABLED = true;

const presets = [
	{
		id: "default",
		label: "Neon Cyan Warp",
		config: {
			loopDuration: 1200,
			strokeColor: "#00e5ff",
			bgColor: "#020205",
			strokeWidth: 4,
			parallaxAmount: 0.04,
			warpStrength: -8,
			distortionScale: 7,
			glowIntensity: 0.4,
			noiseEnabled: true,
		},
	},
	{
		id: "cyber-gold",
		label: "Cyber Gold Wobble",
		config: {
			loopDuration: 2200,
			strokeColor: "#ffaa00",
			bgColor: "#050300",
			strokeWidth: 3,
			parallaxAmount: 0.08,
			warpStrength: -12,
			distortionScale: 15,
			glowIntensity: 0.6,
			noiseEnabled: true,
		},
	},
	{
		id: "acid-matrix",
		label: "Acid Matrix Grid",
		config: {
			loopDuration: 600,
			strokeColor: "#39ff14",
			bgColor: "#000800",
			strokeWidth: 2,
			parallaxAmount: 0.02,
			warpStrength: 5,
			distortionScale: 4,
			glowIntensity: 0.3,
			noiseEnabled: false,
		},
	},
];

export const SpaceTimePage = () => {
	const [loopDuration, setLoopDuration] = useState(DEFAULT_LOOP_DURATION);
	const [strokeColor, setStrokeColor] = useState(DEFAULT_STROKE_COLOR);
	const [bgColor, setBgColor] = useState(DEFAULT_BG_COLOR);
	const [strokeWidth, setStrokeWidth] = useState(DEFAULT_STROKE_WIDTH);
	const [parallaxAmount, setParallaxAmount] = useState(DEFAULT_PARALLAX_AMOUNT);
	const [warpStrength, setWarpStrength] = useState(DEFAULT_WARP_STRENGTH);
	const [distortionScale, setDistortionScale] = useState(DEFAULT_DISTORTION_SCALE);
	const [glowIntensity, setGlowIntensity] = useState(DEFAULT_GLOW_INTENSITY);
	const [noiseEnabled, setNoiseEnabled] = useState(DEFAULT_NOISE_ENABLED);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setLoopDuration(preset.config.loopDuration);
			setStrokeColor(preset.config.strokeColor);
			setBgColor(preset.config.bgColor);
			setStrokeWidth(preset.config.strokeWidth);
			setParallaxAmount(preset.config.parallaxAmount);
			setWarpStrength(preset.config.warpStrength);
			setDistortionScale(preset.config.distortionScale);
			setGlowIntensity(preset.config.glowIntensity);
			setNoiseEnabled(preset.config.noiseEnabled);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<SpaceTime
  loopDuration={${loopDuration}}
  strokeColor="${strokeColor}"
  bgColor="${bgColor}"
  strokeWidth={${strokeWidth}}
  parallaxAmount={${parallaxAmount}}
  warpStrength={${warpStrength}}
  distortionScale={${distortionScale}}
  glowIntensity={${glowIntensity}}
  noiseEnabled={${noiseEnabled}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="spacetime-title">
				<HeaderText text="Spacetime Grid" option={3} />
			</div>
			<ParagraphText
				text="A sophisticated interactive background animation representing a 3D topographic spacetime gravity-well cone. Features dynamic cursor parallax tracking, turbulence/wobble distortion filters, time-warping click-rebound effects, and clean modular React styling."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<SpaceTime
							key={key}
							loopDuration={loopDuration}
							strokeColor={strokeColor}
							bgColor={bgColor}
							strokeWidth={strokeWidth}
							parallaxAmount={parallaxAmount}
							warpStrength={warpStrength}
							distortionScale={distortionScale}
							glowIntensity={glowIntensity}
							noiseEnabled={noiseEnabled}
							className="w-full h-[500px] rounded-xl border border-rb-neutral-4"
						>
							<div className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none select-none">
								<h2 
									className="text-3xl font-black tracking-[0.25em] text-white uppercase drop-shadow-lg transition-colors duration-500"
									style={{ textShadow: `0 0 12px ${strokeColor}aa` }}
								>
									Spacetime
								</h2>
								<p 
									className="text-xs font-mono tracking-[0.3em] uppercase opacity-70 transition-colors duration-500"
									style={{ color: strokeColor }}
								>
									Topographic Warp Canvas
								</p>
							</div>
						</SpaceTime>
					}
					onReplay={handleReplay}
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
					<DiscreteSlider2
						label="Loop Duration (ms)"
						min={300}
						max={3000}
						step={50}
						value={loopDuration}
						onChange={(val) => {
							setLoopDuration(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Stroke Width (px)"
						min={0.5}
						max={10}
						step={0.5}
						value={strokeWidth}
						onChange={setStrokeWidth}
						maxDecimals={1}
						showTicks={true}
					/>

					<DiscreteSlider2
						label="Parallax Amount"
						min={0}
						max={0.2}
						step={0.005}
						value={parallaxAmount}
						onChange={setParallaxAmount}
						maxDecimals={3}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Warp Strength"
						min={-20}
						max={20}
						step={1}
						value={warpStrength}
						onChange={setWarpStrength}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Distortion Wobble Scale"
						min={0}
						max={30}
						step={1}
						value={distortionScale}
						onChange={setDistortionScale}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Glow Intensity"
						min={0}
						max={1}
						step={0.05}
						value={glowIntensity}
						onChange={setGlowIntensity}
						maxDecimals={2}
						showTicks={false}
					/>

					<ToggleComponent
						label="Cyberpunk Noise Filter"
						checked={noiseEnabled}
						onChange={setNoiseEnabled}
					/>

					<ColorPicker
						label="Stroke Color"
						value={strokeColor}
						onChange={setStrokeColor}
					/>

					<ColorPicker
						label="Canvas Bg Color"
						value={bgColor}
						onChange={setBgColor}
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

export default SpaceTimePage;
