"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import AsciiWave from "../../meta/background/wave/AsciiWave/AsciiWave";
import { loaderProps, componentCode, creditsData, charList } from "./AsciiWaveData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";

const DEFAULT_GAP = 40;
const DEFAULT_RADIUS = 30;
const DEFAULT_SPEED_IN = 0.5;
const DEFAULT_SPEED_OUT = 0.6;
const DEFAULT_REST_SCALE = 0.09;
const DEFAULT_MIN_HOVER_SCALE = 1;
const DEFAULT_MAX_HOVER_SCALE = 3;
const DEFAULT_WAVE_SPEED = 1200;
const DEFAULT_WAVE_WIDTH = 180;
const DEFAULT_CHARS_STR = "@#$%&*+=?AX01∑∆πΩ";
const DEFAULT_COLOR_MODE = true;
const DEFAULT_BG_COLOR = "#050505";

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			gap: 40,
			radiusVmin: 30,
			speedIn: 0.5,
			speedOut: 0.6,
			restScale: 0.09,
			minHoverScale: 1,
			maxHoverScale: 3,
			waveSpeed: 1200,
			waveWidth: 180,
			charsStr: "@#$%&*+=?AX01∑∆πΩ",
			colorMode: true,
			backgroundColor: "#050505",
		},
	},
	{
		id: "dense",
		label: "Dense Matrix",
		config: {
			gap: 20,
			radiusVmin: 20,
			speedIn: 0.7,
			speedOut: 0.8,
			restScale: 0.05,
			minHoverScale: 1.5,
			maxHoverScale: 4,
			waveSpeed: 800,
			waveWidth: 120,
			charsStr: "01",
			colorMode: false,
			backgroundColor: "#111111",
		},
	},
	{
		id: "sparse",
		label: "Sparse & Fast",
		config: {
			gap: 60,
			radiusVmin: 50,
			speedIn: 0.3,
			speedOut: 0.4,
			restScale: 0.15,
			minHoverScale: 1.2,
			maxHoverScale: 2.5,
			waveSpeed: 2000,
			waveWidth: 300,
			charsStr: "XO+-",
			colorMode: true,
			backgroundColor: "#000000",
		},
	},
];

export const AsciiWavePage = () => {
	const [gap, setGap] = useState(DEFAULT_GAP);
	const [radiusVmin, setRadiusVmin] = useState(DEFAULT_RADIUS);
	const [speedIn, setSpeedIn] = useState(DEFAULT_SPEED_IN);
	const [speedOut, setSpeedOut] = useState(DEFAULT_SPEED_OUT);
	const [restScale, setRestScale] = useState(DEFAULT_REST_SCALE);
	const [minHoverScale, setMinHoverScale] = useState(DEFAULT_MIN_HOVER_SCALE);
	const [maxHoverScale, setMaxHoverScale] = useState(DEFAULT_MAX_HOVER_SCALE);
	const [waveSpeed, setWaveSpeed] = useState(DEFAULT_WAVE_SPEED);
	const [waveWidth, setWaveWidth] = useState(DEFAULT_WAVE_WIDTH);
	const [charsStr, setCharsStr] = useState(DEFAULT_CHARS_STR);
	const [colorMode, setColorMode] = useState(DEFAULT_COLOR_MODE);
	const [backgroundColor, setBackgroundColor] = useState(DEFAULT_BG_COLOR);
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setGap(preset.config.gap);
			setRadiusVmin(preset.config.radiusVmin);
			setSpeedIn(preset.config.speedIn);
			setSpeedOut(preset.config.speedOut);
			setRestScale(preset.config.restScale);
			setMinHoverScale(preset.config.minHoverScale);
			setMaxHoverScale(preset.config.maxHoverScale);
			setWaveSpeed(preset.config.waveSpeed);
			setWaveWidth(preset.config.waveWidth);
			setCharsStr(preset.config.charsStr);
			setColorMode(preset.config.colorMode);
			setBackgroundColor(preset.config.backgroundColor);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<AsciiWave
  gap={${gap}}
  radiusVmin={${radiusVmin}}
  speedIn={${speedIn}}
  speedOut={${speedOut}}
  restScale={${restScale}}
  minHoverScale={${minHoverScale}}
  maxHoverScale={${maxHoverScale}}
  waveSpeed={${waveSpeed}}
  waveWidth={${waveWidth}}
  chars={['${charsStr.split('').join("', '")}']}
  colorMode={${colorMode}}
  backgroundColor="${backgroundColor}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="ascii-wave-title">
				<HeaderText text="ASCII Wave" option={3} />
			</div>
			<ParagraphText
				text="An interactive ASCII grid that reacts to cursor movement and clicks with dynamic waves of color and scaling."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center border border-rb-neutral-4">
							<AsciiWave
								key={key}
								gap={gap}
								radiusVmin={radiusVmin}
								speedIn={speedIn}
								speedOut={speedOut}
								restScale={restScale}
								minHoverScale={minHoverScale}
								maxHoverScale={maxHoverScale}
								waveSpeed={waveSpeed}
								waveWidth={waveWidth}
								chars={charsStr.split('')}
								colorMode={colorMode}
								backgroundColor={backgroundColor}
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
						label="Grid Gap"
						min={10}
						max={100}
						step={5}
						value={gap}
						onChange={setGap}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Cursor Radius (vmin)"
						min={10}
						max={100}
						step={5}
						value={radiusVmin}
						onChange={setRadiusVmin}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Speed In"
						min={0.1}
						max={2.0}
						step={0.1}
						value={speedIn}
						onChange={setSpeedIn}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Speed Out"
						min={0.1}
						max={2.0}
						step={0.1}
						value={speedOut}
						onChange={setSpeedOut}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Rest Scale"
						min={0.01}
						max={0.5}
						step={0.01}
						value={restScale}
						onChange={setRestScale}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Min Hover Scale"
						min={0.5}
						max={3.0}
						step={0.1}
						value={minHoverScale}
						onChange={setMinHoverScale}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Max Hover Scale"
						min={1.0}
						max={6.0}
						step={0.1}
						value={maxHoverScale}
						onChange={setMaxHoverScale}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Wave Speed"
						min={500}
						max={3000}
						step={100}
						value={waveSpeed}
						onChange={setWaveSpeed}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Wave Width"
						min={50}
						max={500}
						step={10}
						value={waveWidth}
						onChange={setWaveWidth}
						showTicks={false}
					/>

					<DefaultComboBox
						label="Character Set"
						options={charList.map((char) => ({
							id: char,
							label: `${char}`,
						}))}
						value={charsStr}
						onChange={(value) => setCharsStr(value)}
					/>

					<ToggleComponent
						label="Color Mode"
						checked={colorMode}
						onChange={(val) => {
							setColorMode(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<ColorPicker
						label="Background"
						value={backgroundColor}
						onChange={setBackgroundColor}
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

export default AsciiWavePage;
