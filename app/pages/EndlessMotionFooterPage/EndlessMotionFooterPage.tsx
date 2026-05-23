"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { EndlessMotionFooter } from "../../meta/footer/EndlessMotionFooter/EndlessMotionFooter";
import { loaderProps, componentCode, creditsData } from "./EndlessMotionFooterData";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";

const DEFAULT_TEXT = "Endless Motion";
const DEFAULT_BG_COLOR = "#0b84ff";
const DEFAULT_TEXT_COLOR = "#e8e5d8";
const DEFAULT_MIN_SCALE = 0.5;
const DEFAULT_LINE_COUNT = 5;
const DEFAULT_INFINITE = true;
const DEFAULT_AUTO_SCROLL = true;
const DEFAULT_AUTO_SCROLL_SPEED = 1;

const presets = [
	{
		id: "default",
		label: "Classic Ocean",
		config: {
			text: "React Bytes",
			bgColor: "#0b84ff",
			textColor: "#e8e5d8",
			minScale: 0.5,
			lineCount: 5,
			infinite: true,
			autoScroll: true,
			autoScrollSpeed: 1,
		}
	},
	{
		id: "cyberpunk",
		label: "Cyberpunk Acid",
		config: {
			text: "NEON SIGNAL",
			bgColor: "#0c0c0e",
			textColor: "#39ff14",
			minScale: 0.3,
			lineCount: 6,
			infinite: true,
			autoScroll: true,
			autoScrollSpeed: 2.5,
		}
	},
	{
		id: "crimson",
		label: "Crimson Phantom",
		config: {
			text: "GLITCH IN VOID",
			bgColor: "#800000",
			textColor: "#ffffff",
			minScale: 0.6,
			lineCount: 4,
			infinite: true,
			autoScroll: true,
			autoScrollSpeed: 1.5,
		}
	},
	{
		id: "monochrome",
		label: "Monochrome Sleek",
		config: {
			text: "MINIMALISM",
			bgColor: "#ffffff",
			textColor: "#111111",
			minScale: 0.4,
			lineCount: 5,
			infinite: false,
			autoScroll: false,
			autoScrollSpeed: 0,
		}
	}
];

export const EndlessMotionFooterPage = () => {
	const [text, setText] = useState(DEFAULT_TEXT);
	const [bgColor, setBgColor] = useState(DEFAULT_BG_COLOR);
	const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
	const [minScale, setMinScale] = useState(DEFAULT_MIN_SCALE);
	const [lineCount, setLineCount] = useState(DEFAULT_LINE_COUNT);
	const [infinite, setInfinite] = useState(DEFAULT_INFINITE);
	const [autoScroll, setAutoScroll] = useState(DEFAULT_AUTO_SCROLL);
	const [autoScrollSpeed, setAutoScrollSpeed] = useState(DEFAULT_AUTO_SCROLL_SPEED);
	const [mode, setMode] = useState<'internal' | 'page-footer'>('internal');
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setBgColor(preset.config.bgColor);
			setTextColor(preset.config.textColor);
			setMinScale(preset.config.minScale);
			setLineCount(preset.config.lineCount);
			setInfinite(preset.config.infinite);
			setAutoScroll(preset.config.autoScroll);
			setAutoScrollSpeed(preset.config.autoScrollSpeed);
			setKey((prev) => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
		setMode("internal");
	};

	const usageCode = `<EndlessMotionFooter
  text="${text}"
  bgColor="${bgColor}"
  textColor="${textColor}"
  minScale={${minScale}}
  lineCount={${lineCount}}
  infinite={${infinite}}
  mode="${mode}"
  autoScroll={${autoScroll}}
  autoScrollSpeed={${autoScrollSpeed}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="endless-motion-footer-title">
				<HeaderText text="Endless Motion Footer" option={3} />
			</div>
			<ParagraphText
				text="A smooth-scrolling decorative footer component. Utilizing Lenis for custom scroll-trigger interpolation, it repeatedly renders typographic waves that organically scale down based on their vertical proximity to the screen."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden flex items-center justify-center rounded-xl border border-white/5 bg-[#0b84ff] shadow-xl">
							<EndlessMotionFooter
								key={`${mode}-${key}`}
								text={text}
								bgColor={bgColor}
								textColor={textColor}
								minScale={minScale}
								lineCount={lineCount}
								infinite={infinite}
								mode={mode}
								autoScroll={autoScroll}
								autoScrollSpeed={autoScrollSpeed}
								className="absolute inset-0 w-full h-full z-0"
							/>
						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
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
					<DefaultTextInput
						label="Repeated Text"
						value={text}
						onChange={(val) => setText(val)}
						placeholder="Enter text..."
					/>

					<DefaultComboBox
						label="Scrolling Mode"
						options={[
							{ id: "internal", label: "Self-Contained (Internal)" },
							{ id: "page-footer", label: "Infinite Page Footer" }
						]}
						value={mode}
						onChange={(val) => setMode(val as 'internal' | 'page-footer')}
						dynamicWidth={true}
					/>

					<DiscreteSlider2
						label="Min Scale Multiplier"
						min={0.1}
						max={1.0}
						step={0.05}
						value={minScale}
						onChange={(val) => setMinScale(val)}
						maxDecimals={2}
						showTicks={false}
					/>

					<DiscreteSlider2
						label="Line Count (Rows)"
						min={2}
						max={8}
						step={1}
						value={lineCount}
						onChange={(val) => setLineCount(val)}
						maxDecimals={0}
						showTicks={false}
					/>

					<ToggleComponent
						label="Infinite Smooth Scroll"
						checked={infinite}
						onChange={(val) => setInfinite(val)}
					/>

					<ToggleComponent
						label="Auto Scroll (Drift)"
						checked={autoScroll}
						onChange={(val) => setAutoScroll(val)}
					/>

					<DiscreteSlider2
						label="Auto Scroll Speed"
						min={0.2}
						max={4.0}
						step={0.1}
						value={autoScrollSpeed}
						onChange={(val) => setAutoScrollSpeed(val)}
						maxDecimals={1}
						showTicks={false}
					/>

					<ColorPicker
						label="Text Color"
						value={textColor}
						onChange={(val) => setTextColor(val)}
					/>

					<ColorPicker
						label="Background Color"
						value={bgColor}
						onChange={(val) => setBgColor(val)}
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

			{mode === "page-footer" && (
				<div className="w-full h-[400px] relative overflow-hidden rounded-xl border border-white/5 bg-[#0b84ff] shadow-xl mt-5">
					<div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white border border-white/10 uppercase tracking-wider">
						Live Bottom Page Footer Demonstration
					</div>
					<EndlessMotionFooter
						key={`page-footer-${key}`}
						text={text}
						bgColor={bgColor}
						textColor={textColor}
						minScale={minScale}
						lineCount={lineCount}
						infinite={infinite}
						mode="page-footer"
						autoScroll={autoScroll}
						autoScrollSpeed={autoScrollSpeed}
						className="absolute inset-0 w-full h-full z-0"
					/>
				</div>
			)}
		</div>
	);
};

export default EndlessMotionFooterPage;
