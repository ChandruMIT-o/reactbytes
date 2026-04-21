"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { ShinyButton } from "../../meta/buttons/ShinyButton/ShinyButton";
import { shinyButtonProps, componentCode, creditsData } from "./ShinyButtonData";
import { Credits } from "../../components/buttongroup/Credits";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";

const presets = [
	{
		id: "blue-plasma",
		label: "Blue Plasma",
		config: {
			highlightColor: "rgb(0, 0, 255)",
			highlightSubtleColor: "#8484ff",
			duration: 3,
			baseColor: "#000000",
			textColor: "#ffffff",
		},
	},
	{
		id: "emerald-pulse",
		label: "Emerald Pulse",
		config: {
			highlightColor: "rgb(0, 255, 100)",
			highlightSubtleColor: "#a7f3d0",
			duration: 2,
			baseColor: "#022c22",
			textColor: "#ffffff",
		},
	},
	{
		id: "amber-glow",
		label: "Amber Glow",
		config: {
			highlightColor: "rgb(255, 165, 0)",
			highlightSubtleColor: "#fde68a",
			duration: 4,
			baseColor: "#1c0a00",
			textColor: "#ffffff",
		},
	},
	{
		id: "crimson-rush",
		label: "Crimson Rush",
		config: {
			highlightColor: "rgb(255, 0, 80)",
			highlightSubtleColor: "#fda4af",
			duration: 1.5,
			baseColor: "#2d000a",
			textColor: "#ffffff",
		},
	},
	{
		id: "monochrome",
		label: "Silver Blade",
		config: {
			highlightColor: "rgb(255, 255, 255)",
			highlightSubtleColor: "#d4d4d8",
			duration: 5,
			baseColor: "#09090b",
			textColor: "#ffffff",
		},
	},
];

export const ShinyButtonPage = () => {
    const defaultPreset = presets[0];

	const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
    const [text, setText] = useState("Join the waitlist");
	const [highlightColor, setHighlightColor] = useState(defaultPreset.config.highlightColor);
	const [highlightSubtleColor, setHighlightSubtleColor] = useState(defaultPreset.config.highlightSubtleColor);
	const [duration, setDuration] = useState(defaultPreset.config.duration);
	const [baseColor, setBaseColor] = useState(defaultPreset.config.baseColor);
	const [textColor, setTextColor] = useState(defaultPreset.config.textColor);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
		setCurrentPreset(presetId);
		setHighlightColor(preset.config.highlightColor);
		setHighlightSubtleColor(preset.config.highlightSubtleColor);
		setDuration(preset.config.duration);
		setBaseColor(preset.config.baseColor);
		setTextColor(preset.config.textColor);
	};

	const handleReset = () => applyPreset(defaultPreset.id);

	const usageCode = `<ShinyButton 
  text="${text}"
  highlightColor="${highlightColor}"
  duration={${duration}}
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="shiny-button-title">
				<HeaderText text="Shiny CTA" option={3} />
			</div>
			<ParagraphText
				text="A high-fidelity Call To Action button with a dynamic, rotating conic-gradient border and layered shimmer effects. Powered by CSS Houdini for buttery-smooth gradient transitions and responsive hover dynamics."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full min-h-[400px] flex items-center justify-center p-12 bg-black rounded-[32px] border border-white/5 relative overflow-hidden group">
							<ShinyButton 
                                text={text}
                                highlightColor={highlightColor}
                                highlightSubtleColor={highlightSubtleColor}
                                duration={duration}
                                baseColor={baseColor}
                                textColor={textColor}
                            />
						</div>
					}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
                    header={
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase tracking-[0.1em]">Engine Parameters</h3>
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
                    {/* Content Column */}
                    <div className="space-y-6">
                        <div className="text-[10px] uppercase tracking-widest text-rb-accent-1 opacity-50 font-bold border-b border-white/5 pb-2">Labeling</div>
                        <TextInput 
                            label="Button Text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <DiscreteSlider
                            label="Rotation Duration"
                            min={0.5}
                            max={10.0}
                            step={0.5}
                            value={duration}
                            onChange={setDuration}
                            maxDecimals={1}
                            showTicks={false}
                        />
                    </div>

                    {/* Energy Column */}
                    <div className="space-y-6">
                        <div className="text-[10px] uppercase tracking-widest text-rb-accent-1 opacity-50 font-bold border-b border-white/5 pb-2">Energy & Shine</div>
                        <ColorPicker
                            label="Highlight Energy"
                            value={highlightColor}
                            onChange={setHighlightColor}
                            compact={true}
                            presets={["rgb(0, 0, 255)", "rgb(0, 255, 100)", "rgb(255, 165, 0)", "#ffffff"]}
                        />
                        <ColorPicker
                            label="Hover Shine"
                            value={highlightSubtleColor}
                            onChange={setHighlightSubtleColor}
                            compact={true}
                        />
                    </div>

                    {/* Foundation Column */}
                    <div className="space-y-6">
                        <div className="text-[10px] uppercase tracking-widest text-rb-accent-1 opacity-50 font-bold border-b border-white/5 pb-2">Foundation</div>
                        <ColorPicker
                            label="Base Background"
                            value={baseColor}
                            onChange={setBaseColor}
                            compact={true}
                            presets={["#000000", "#09090b", "#1c0a00", "#022c22"]}
                        />
                        <ColorPicker
                            label="Typography Color"
                            value={textColor}
                            onChange={setTextColor}
                            compact={true}
                            presets={["#ffffff", "#d4d4d8", "#818cf8"]}
                        />
                    </div>
                </PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={shinyButtonProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default ShinyButtonPage;
