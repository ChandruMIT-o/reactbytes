"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { KeyboardText } from "../../meta/text/keyboard/KeyboardText";
import { componentCode, loaderProps, creditsData } from "./KeyboardTextData";
import { DiscreteSlider2 } from "../../components/slider/DiscreteSlider2";
import { DefaultTextInput } from "../../components/textinput/DefaultTextInput";
import { Credits } from "../../components/buttongroup/Credits";
import ColorPicker from "../../components/colorpicker/ColorPicker";
import { ToggleComponent } from "../../components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { RotateCcw } from "lucide-react";

const presets = [
	{
		id: "default",
		label: "Classic Keyboard",
		config: {
			text: "KEYBOARD",
			yBounce: 10,
			color: "#FFFFFF",
			uppercase: true,
			className: "text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] tracking-tighter mix-blend-difference z-10 font-[Poppins]",
		},
	},
	{
		id: "deep-press",
		label: "Deep Press",
		config: {
			text: "TYPEWRITER",
			yBounce: 25,
			color: "#fca5a5",
			uppercase: true,
			className: "text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] tracking-tighter mix-blend-difference z-10 font-[Poppins]",
		},
	},
	{
		id: "subtle",
		label: "Subtle Taps",
		config: {
			text: "GHOSTLY",
			yBounce: 4,
			color: "#94a3b8",
			uppercase: true,
			className: "text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] tracking-tighter mix-blend-difference z-10 font-[Poppins]",
		},
	},
];

export const KeyboardTextPage = () => {
	const [text, setText] = useState("KEYBOARD");
	const [yBounce, setYBounce] = useState(10);
	const [color, setColor] = useState("#FFFFFF");
	const [uppercase, setUppercase] = useState(true);
	const [className, setClassName] = useState("text-[2.5rem] sm:text-[3rem] md:text-[5rem] lg:text-[7rem] tracking-tighter mix-blend-difference z-10 font-[Poppins]");
	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setYBounce(preset.config.yBounce);
			setColor(preset.config.color || "#FFFFFF");
			setUppercase(preset.config.uppercase ?? true);
			setClassName(preset.config.className);
			setKey((prev) => prev + 1);
		}
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<KeyboardText
  text="${text}"
  yBounce={${yBounce}}
  color="${color}"
  uppercase={${uppercase}}
  className="${className}"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="keyboard-text-title">
				<HeaderText text="Keyboard Text" option={3} />
			</div>
			<ParagraphText
				text="A smooth auto-animating typing effect. The characters randomly press downwards simulating an invisible ghost operating a vintage mechanical keyboard or typewriter. Extremely lightweight using isolated Framer Motion springs."
				option={4}
			/>

			<div id="preview">
				<PreviewTab
					previewContent={
						<div
							onClick={() => setKey((prev) => prev + 1)}
							className="w-full h-[400px] relative overflow-hidden flex items-center justify-center bg-rb-neutral-1 border border-white/5 rounded-xl cursor-pointer group active:scale-[0.99] transition-transform"
						>
							<KeyboardText
								key={key}
								text={text}
								yBounce={yBounce}
								color={color}
								uppercase={uppercase}
								className={className}
							/>
							{/* Soft subtle radial background behind the text */}
							<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_60%)] pointer-events-none" />
							<div className="absolute top-4 left-4 text-[10px] text-white/20 uppercase tracking-widest font-bold pointer-events-none group-hover:text-white/40 transition-colors">
								Interactive Ghost Keys
							</div>
						</div>
					}
					onReplay={() => setKey((prev) => prev + 1)}
					usageCode={usageCode}
					codeContent=""
					collapsible={true}
					header={
						<div className="flex items-center justify-between ">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
							<DefaultComboBox
								options={presets}
								value={currentPreset}
								onChange={applyPreset}
								label="Presets"
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
						label="Rendered Text"
						value={text}
						onChange={(val) => {
							setText(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="Type anything..."
					/>

					<ColorPicker
						label="Text Color"
						value={color}
						onChange={(val) => {
							setColor(val);
							setKey((prev) => prev + 1);
						}}
					/>

					<DiscreteSlider2
						label="Bounce Depth"
						min={0}
						max={35}
						step={1}
						value={yBounce}
						onChange={(val) => {
							setYBounce(val);
							setKey((prev) => prev + 1);
						}}
						maxDecimals={0}
						showTicks={true}
					/>

					<ToggleComponent
						label="Uppercase"
						checked={uppercase}
						onChange={(val) => {
							setUppercase(val);
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

export default KeyboardTextPage;
