"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import StandardAccordion from "../../meta/misc/StandardAccordion/StandardAccordion";
import { accordionProps, componentCode, creditsData } from "./StandardAccordionData";
import { Credits } from "../../components/buttongroup/Credits";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";

const presets = [
	{
		id: "refined",
		label: "Refined (Balanced)",
		config: {
			stiffness: 250,
			damping: 30,
			mass: 1,
			floatOffset: 24,
			hoverScale: 1.01,
			backgroundColorOpen: "#181A1E",
			backgroundColorClosed: "#060010",
			titleColor: "#FFFFFF",
			contentColor: "#A1A1AA",
		},
	},
	{
		id: "snappy",
		label: "Snappy (High Energy)",
		config: {
			stiffness: 500,
			damping: 25,
			mass: 0.5,
			floatOffset: 16,
			hoverScale: 1.02,
			backgroundColorOpen: "#1e1b4b",
			backgroundColorClosed: "#0a0a1a",
			titleColor: "#818cf8",
			contentColor: "#c7d2fe",
		},
	},
	{
		id: "liquid",
		label: "Liquid (Smooth)",
		config: {
			stiffness: 100,
			damping: 40,
			mass: 2,
			floatOffset: 32,
			hoverScale: 1.00,
			backgroundColorOpen: "#064e3b",
			backgroundColorClosed: "#022c22",
			titleColor: "#34d399",
			contentColor: "#a7f3d0",
		},
	},
	{
		id: "dramatic",
		label: "Dramatic (Impact)",
		config: {
			stiffness: 300,
			damping: 15,
			mass: 1.5,
			floatOffset: 48,
			hoverScale: 1.03,
			backgroundColorOpen: "#451a03",
			backgroundColorClosed: "#1c0a00",
			titleColor: "#fbbf24",
			contentColor: "#fde68a",
		},
	},
	{
		id: "minimal",
		label: "Minimal (Subtle)",
		config: {
			stiffness: 150,
			damping: 30,
			mass: 1,
			floatOffset: 8,
			hoverScale: 1.005,
			backgroundColorOpen: "#18181b",
			backgroundColorClosed: "#09090b",
			titleColor: "#fafafa",
			contentColor: "#71717a",
		},
	},
];

export const StandardAccordionPage = () => {
    const defaultPreset = presets[0];

	const [currentPreset, setCurrentPreset] = useState(defaultPreset.id);
	const [backgroundColorOpen, setBackgroundColorOpen] = useState(defaultPreset.config.backgroundColorOpen);
	const [backgroundColorClosed, setBackgroundColorClosed] = useState(defaultPreset.config.backgroundColorClosed);
	const [floatOffset, setFloatOffset] = useState(defaultPreset.config.floatOffset);
	const [stiffness, setStiffness] = useState(defaultPreset.config.stiffness);
	const [damping, setDamping] = useState(defaultPreset.config.damping);
	const [mass, setMass] = useState(defaultPreset.config.mass);
	const [hoverScale, setHoverScale] = useState(defaultPreset.config.hoverScale);
	const [titleColor, setTitleColor] = useState(defaultPreset.config.titleColor);
	const [contentColor, setContentColor] = useState(defaultPreset.config.contentColor);
    const [allowMultiple, setAllowMultiple] = useState(false);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (!preset) return;
		setCurrentPreset(presetId);
		setBackgroundColorOpen(preset.config.backgroundColorOpen);
		setBackgroundColorClosed(preset.config.backgroundColorClosed);
		setFloatOffset(preset.config.floatOffset);
		setStiffness(preset.config.stiffness);
		setDamping(preset.config.damping);
		setMass(preset.config.mass);
		setHoverScale(preset.config.hoverScale);
		setTitleColor(preset.config.titleColor);
		setContentColor(preset.config.contentColor);
	};

	const handleReset = () => applyPreset(defaultPreset.id);

	const usageCode = `<StandardAccordion 
  stiffness={${stiffness}}
  damping={${damping}}
  mass={${mass}}
  floatOffset={${floatOffset}}
  hoverScale={${hoverScale}}
  allowMultiple={${allowMultiple}}
  backgroundColorOpen="${backgroundColorOpen}"
  backgroundColorClosed="${backgroundColorClosed}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="accordion-title">
				<HeaderText text="Standard Accordion" option={3} />
			</div>
			<ParagraphText
				text="A high-fidelity accordion engine powered by spring physics. Not just a toggle, but a tactile interaction where items float, respond to hover, and transition with weighted motion."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div 
                            className="w-full min-h-[550px] flex items-center justify-center p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden transition-colors duration-700 ease-in-out"
                            style={{ backgroundColor: backgroundColorClosed }}
                        >
							<div 
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[140px] pointer-events-none transition-colors duration-700" 
                                style={{ backgroundColor: `${backgroundColorOpen}30` }}
                            />
							
							<div className="w-full max-w-[600px] relative z-10 transition-transform duration-500">
								<StandardAccordion 
                                    backgroundColorOpen={backgroundColorOpen}
                                    backgroundColorClosed={backgroundColorClosed}
                                    floatOffset={floatOffset}
                                    stiffness={stiffness}
                                    damping={damping}
                                    mass={mass}
                                    titleColor={titleColor}
                                    contentColor={contentColor}
                                    hoverScale={hoverScale}
                                    allowMultiple={allowMultiple}
                                />
							</div>
						</div>
					}
					usageCode={usageCode}
					codeContent={componentCode}
					collapsible={true}
                    header={
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase tracking-[0.1em]">Engine Behavior</h3>
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
									title="Reset Behavior"
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
                        {/* Column 1: Dynamics */}
                        <div className="space-y-6">
                            <div className="text-[10px] uppercase tracking-widest text-rb-accent-1 opacity-50 font-bold border-b border-white/5 pb-2">Physics Engine</div>
                            <DiscreteSlider
                                label="Spring Stiffness"
                                min={50}
                                max={800}
                                step={10}
                                value={stiffness}
                                onChange={setStiffness}
                                maxDecimals={0}
                                showTicks={false}
                            />
                            <DiscreteSlider
                                label="Spring Damping"
                                min={5}
                                max={100}
                                step={1}
                                value={damping}
                                onChange={setDamping}
                                maxDecimals={0}
                                showTicks={false}
                            />
                            <DiscreteSlider
                                label="Inertial Mass"
                                min={0.1}
                                max={3.0}
                                step={0.1}
                                value={mass}
                                onChange={setMass}
                                maxDecimals={1}
                                showTicks={false}
                            />
                        </div>

                        {/* Column 2: Interaction */}
                        <div className="space-y-6">
                            <div className="text-[10px] uppercase tracking-widest text-rb-accent-1 opacity-50 font-bold border-b border-white/5 pb-2">Tactile Feel</div>
                            <DiscreteSlider
                                label="Motion Offset (Float)"
                                min={0}
                                max={80}
                                step={1}
                                value={floatOffset}
                                onChange={setFloatOffset}
                                maxDecimals={0}
                                showTicks={false}
                            />
                            <DiscreteSlider
                                label="Hover Intensity"
                                min={1.0}
                                max={1.1}
                                step={0.005}
                                value={hoverScale}
                                onChange={setHoverScale}
                                maxDecimals={3}
                                showTicks={false}
                            />
                            <div className="flex flex-col gap-2">
                                <label className="text-[13px] text-rb-accent-1/80 font-medium tracking-tight">Allow Multi-Open</label>
                                <button 
                                    onClick={() => setAllowMultiple(!allowMultiple)}
                                    className={`w-full py-2 px-4 rounded-lg border text-xs font-bold transition-all duration-300 ${allowMultiple ? 'bg-rb-accent-1 text-rb-neutral-1 border-rb-accent-1' : 'bg-transparent text-rb-accent-1/40 border-white/10 hover:border-rb-accent-1/20'}`}
                                >
                                    {allowMultiple ? "ENABLED" : "DISABLED"}
                                </button>
                            </div>
                        </div>

                        {/* Column 3: Aesthetics */}
                        <div className="space-y-6">
                            <div className="text-[10px] uppercase tracking-widest text-rb-accent-1 opacity-50 font-bold border-b border-white/5 pb-2">Appearance</div>
                            <ColorPicker
                                label="Open State"
                                value={backgroundColorOpen}
                                onChange={setBackgroundColorOpen}
                                compact={true}
                            />
                            <ColorPicker
                                label="Idle State"
                                value={backgroundColorClosed}
                                onChange={setBackgroundColorClosed}
                                compact={true}
                            />
                            <ColorPicker
                                label="Title Accent"
                                value={titleColor}
                                onChange={setTitleColor}
                                compact={true}
                            />
                            <ColorPicker
                                label="Content Tone"
                                value={contentColor}
                                onChange={setContentColor}
                                compact={true}
                            />
                        </div>
                </PreviewTab>
			</div>

			<div id="installation-tabs">
				<InstallationTabs />
			</div>

			<div id="api-reference" className="flex flex-col gap-5">
				<HeaderText text="API Reference" option={6} />
				<PropsTable categories={accordionProps} />
			</div>

			<div id="credits" className="w-full max-w-5xl mx-auto py-10">
				<Credits data={creditsData} />
			</div>
		</div>
	);
};

export default StandardAccordionPage;
