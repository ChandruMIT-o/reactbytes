"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { Dither } from "../../meta/background/dotted/Dither";
import { loaderProps, componentCode, creditsData } from "./DitherData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const DEFAULT_SPACING = 10;
const DEFAULT_SCALE = 450;
const DEFAULT_INTENSITY = 7;
const DEFAULT_DURATION = 2;
const DEFAULT_STAGGER = 4;
const DEFAULT_COLOR_DARK = "#02a";
const DEFAULT_COLOR_LIGHT = "#29e";
const DEFAULT_COLOR_BG = "#005";

const presets = [
	{
		id: "default",
		label: "Default Matrix",
		config: {
			spacing: 10,
			scale: 450,
			intensity: 7,
			duration: 2,
			stagger: 4,
			colorDark: "#02a",
			colorLight: "#29e",
			colorBg: "#005"
		}
	},
	{
		id: "inferno",
		label: "Inferno Grid",
		config: {
			spacing: 8,
			scale: 250,
			intensity: 9,
			duration: 1.5,
			stagger: 3.5,
			colorDark: "#660000",
			colorLight: "#ff4400",
			colorBg: "#110000"
		}
	},
	{
		id: "acid",
		label: "Acid Rain",
		config: {
			spacing: 12,
			scale: 300,
			intensity: 6,
			duration: 3,
			stagger: 6,
			colorDark: "#003300",
			colorLight: "#00ff00",
			colorBg: "#000000"
		}
	},
	{
		id: "ghost",
		label: "Ghost Wave",
		config: {
			spacing: 14,
			scale: 600,
			intensity: 12,
			duration: 4,
			stagger: 8,
			colorDark: "#222222",
			colorLight: "#aaaaaa",
			colorBg: "#0c0c0c"
		}
	}
];

export const DitherPage = () => {
	const [spacing, setSpacing] = useState(DEFAULT_SPACING);
	const [scale, setScale] = useState(DEFAULT_SCALE);
	const [intensity, setIntensity] = useState(DEFAULT_INTENSITY);
	const [duration, setDuration] = useState(DEFAULT_DURATION);
	const [stagger, setStagger] = useState(DEFAULT_STAGGER);
	const [colorDark, setColorDark] = useState(DEFAULT_COLOR_DARK);
	const [colorLight, setColorLight] = useState(DEFAULT_COLOR_LIGHT);
	const [colorBg, setColorBg] = useState(DEFAULT_COLOR_BG);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setSpacing(preset.config.spacing);
			setScale(preset.config.scale);
			setIntensity(preset.config.intensity);
			setDuration(preset.config.duration);
			setStagger(preset.config.stagger);
			setColorDark(preset.config.colorDark);
			setColorLight(preset.config.colorLight);
			setColorBg(preset.config.colorBg);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<Dither
  spacing={${spacing}}
  scale={${scale}}
  intensity={${intensity}}
  duration={${duration}}
  stagger={${stagger}}
  colorDark="${colorDark}"
  colorLight="${colorLight}"
  colorBg="${colorBg}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="dither-title">
				<HeaderText text="Dither Mesh" option={3} />
			</div>
			<ParagraphText
				text="An organic, canvas-based mesh background utilizing Perlin noise field math and GSAP stagger animations to simulate fluid, dithered transitions."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center rounded-xl border border-white/5">
							<Dither
								key={key}
								spacing={spacing}
								scale={scale}
								intensity={intensity}
								duration={duration}
								stagger={stagger}
								colorDark={colorDark}
								colorLight={colorLight}
								colorBg={colorBg}
								className="absolute inset-0 w-full h-full z-0"
							/>
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
						label="Dot Spacing (px)"
						min={5}
						max={30}
						step={1}
						value={spacing}
						onChange={(val) => {
							setSpacing(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Noise Scale"
						min={100}
						max={800}
						step={10}
						value={scale}
						onChange={(val) => {
							setScale(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Noise Intensity"
						min={1}
						max={20}
						step={1}
						value={intensity}
						onChange={(val) => {
							setIntensity(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={0}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Animation Loop Duration (s)"
						min={0.5}
						max={10}
						step={0.5}
						value={duration}
						onChange={(val) => {
							setDuration(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={1}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Stagger Grid Amount"
						min={1}
						max={15}
						step={0.5}
						value={stagger}
						onChange={(val) => {
							setStagger(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={1}
						showTicks={false}
					/>

					<ColorPicker
						label="Core Dot Color"
						value={colorLight}
						onChange={(val) => {
							setColorLight(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<ColorPicker
						label="Underlayer Color"
						value={colorDark}
						onChange={(val) => {
							setColorDark(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<ColorPicker
						label="Background Color"
						value={colorBg}
						onChange={(val) => {
							setColorBg(val);
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

export default DitherPage;
