"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { VolumetricText } from "../../meta/text/VolumetricText/VolumetricText";
import { loaderProps, componentCode, creditsData } from "./VolumetricTextData";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";

const presets = [
	{
		id: "default",
		label: "Default Style",
		config: {
			text: "All hail Rameez",
			textSize: 300,
			shapeScale: 0.3,
			invertShape: true,
			addNoise: true,
			decay: 0.96,
			exposure: 0.35,
			lightStrength: 3.5,
			lightColor: "#ffff66",
			falloffColor: "#00ccff",
			bgColor: "#004040",
			falloff: 0.5,
			density: 0.98,
			weight: 0.25,
			samples: 12,
			octaves: 1,
		},
	},
	{
		id: "cyberpunk",
		label: "Cyberpunk Fog",
		config: {
			text: "CYBER",
			textSize: 240,
			shapeScale: 0.3,
			invertShape: true,
			addNoise: true,
			decay: 0.98,
			exposure: 0.6,
			lightStrength: 4.0,
			lightColor: "#ff007f",
			falloffColor: "#00ffff",
			bgColor: "#0a0a16",
			falloff: 0.7,
			density: 1.0,
			weight: 0.3,
			samples: 16,
			octaves: 2,
		},
	},
	{
		id: "solar",
		label: "Solar Flare",
		config: {
			text: "SOLAR",
			textSize: 220,
			shapeScale: 0.3,
			invertShape: true,
			addNoise: true,
			decay: 0.95,
			exposure: 0.5,
			lightStrength: 4.5,
			lightColor: "#ff7f00",
			falloffColor: "#ff0000",
			bgColor: "#160500",
			falloff: 0.4,
			density: 0.95,
			weight: 0.35,
			samples: 12,
			octaves: 3,
		},
	},
	{
		id: "forest",
		label: "Forest Glow",
		config: {
			text: "ECO",
			textSize: 300,
			shapeScale: 0.3,
			invertShape: true,
			addNoise: true,
			decay: 0.97,
			exposure: 0.4,
			lightStrength: 3.2,
			lightColor: "#aaff55",
			falloffColor: "#004411",
			bgColor: "#021c08",
			falloff: 0.6,
			density: 0.98,
			weight: 0.2,
			samples: 12,
			octaves: 1,
		},
	},
];

export const VolumetricTextPage = () => {
	const [text, setText] = useState(presets[0].config.text);
	const [textSize, setTextSize] = useState(presets[0].config.textSize);
	const [shapeScale, setShapeScale] = useState(presets[0].config.shapeScale);
	const [invertShape, setInvertShape] = useState(presets[0].config.invertShape);
	const [addNoise, setAddNoise] = useState(presets[0].config.addNoise);
	const [decay, setDecay] = useState(presets[0].config.decay);
	const [exposure, setExposure] = useState(presets[0].config.exposure);
	const [lightStrength, setLightStrength] = useState(presets[0].config.lightStrength);
	const [lightColor, setLightColor] = useState(presets[0].config.lightColor);
	const [falloffColor, setFalloffColor] = useState(presets[0].config.falloffColor);
	const [bgColor, setBgColor] = useState(presets[0].config.bgColor);
	const [falloff, setFalloff] = useState(presets[0].config.falloff);
	const [density, setDensity] = useState(presets[0].config.density);
	const [weight, setWeight] = useState(presets[0].config.weight);
	const [samples, setSamples] = useState(presets[0].config.samples);
	const [octaves, setOctaves] = useState(presets[0].config.octaves);

	const [currentPreset, setCurrentPreset] = useState("default");
	const [key, setKey] = useState(0);

	const applyPreset = (presetId: string) => {
		const preset = presets.find((p) => p.id === presetId);
		if (preset) {
			setCurrentPreset(presetId);
			setText(preset.config.text);
			setTextSize(preset.config.textSize);
			setShapeScale(preset.config.shapeScale);
			setInvertShape(preset.config.invertShape);
			setAddNoise(preset.config.addNoise);
			setDecay(preset.config.decay);
			setExposure(preset.config.exposure);
			setLightStrength(preset.config.lightStrength);
			setLightColor(preset.config.lightColor);
			setFalloffColor(preset.config.falloffColor);
			setBgColor(preset.config.bgColor);
			setFalloff(preset.config.falloff);
			setDensity(preset.config.density);
			setWeight(preset.config.weight);
			setSamples(preset.config.samples);
			setOctaves(preset.config.octaves);
			setKey((prev) => prev + 1);
		}
	};

	const handleReplay = () => {
		setKey((prev) => prev + 1);
	};

	const handleReset = () => {
		applyPreset("default");
	};

	const usageCode = `<VolumetricText
  text="${text}"
  textSize={${textSize}}
  shapeScale={${shapeScale}}
  invertShape={${invertShape}}
  addNoise={${addNoise}}
  decay={${decay}}
  exposure={${exposure}}
  lightStrength={${lightStrength}}
  lightColor="${lightColor}"
  falloffColor="${falloffColor}"
  bgColor="${bgColor}"
  falloff={${falloff}}
  density={${density}}
  weight={${weight}}
  samples={${samples}}
  octaves={${octaves}}
  className="w-full h-[400px]"
/>`;

	return (
		<div className="flex flex-col gap-5">
			<div id="volumetric-text-title">
				<HeaderText text="Volumetric Text" option={3} />
			</div>
			<div id="preview">
				<PreviewTab
					previewContent={
						<div className="w-full h-[400px] relative overflow-hidden rounded-xl border border-rb-neutral-4">
							<VolumetricText
								key={key}
								text={text}
								textSize={textSize}
								shapeScale={shapeScale}
								invertShape={invertShape}
								addNoise={addNoise}
								decay={decay}
								exposure={exposure}
								lightStrength={lightStrength}
								lightColor={lightColor}
								falloffColor={falloffColor}
								bgColor={bgColor}
								falloff={falloff}
								density={density}
								weight={weight}
								samples={samples}
								octaves={octaves}
								className="w-full h-full"
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
					<DefaultTextInput
						label="Text Content"
						value={text}
						onChange={(val) => {
							setText(val);
							setKey((prev) => prev + 1);
						}}
						placeholder="Enter text or paste <svg>...</svg>"
					/>

					<DiscreteSlider2
						label="Text Size"
						min={10}
						max={800}
						step={10}
						value={textSize}
						onChange={setTextSize}
						maxDecimals={0}
					/>

					<DiscreteSlider2
						label="Screen Scale"
						min={0.05}
						max={1.5}
						step={0.01}
						value={shapeScale}
						onChange={setShapeScale}
						maxDecimals={2}
					/>

					<ToggleComponent
						label="Invert Shape Mask"
						checked={invertShape}
						onChange={setInvertShape}
					/>

					<ToggleComponent
						label="Add FBM Noise"
						checked={addNoise}
						onChange={setAddNoise}
					/>

					<DiscreteSlider2
						label="Samples (compiles shader)"
						min={1}
						max={32}
						step={1}
						value={samples}
						onChange={setSamples}
						maxDecimals={0}
					/>

					<DiscreteSlider2
						label="FBM Octaves (compiles shader)"
						min={1}
						max={5}
						step={1}
						value={octaves}
						onChange={setOctaves}
						maxDecimals={0}
					/>

					<DiscreteSlider2
						label="Light Strength"
						min={0}
						max={10}
						step={0.1}
						value={lightStrength}
						onChange={setLightStrength}
						maxDecimals={1}
					/>

					<DiscreteSlider2
						label="Exposure"
						min={0}
						max={2}
						step={0.05}
						value={exposure}
						onChange={setExposure}
						maxDecimals={2}
					/>

					<DiscreteSlider2
						label="Decay"
						min={0.5}
						max={1.0}
						step={0.01}
						value={decay}
						onChange={setDecay}
						maxDecimals={2}
					/>

					<DiscreteSlider2
						label="Falloff"
						min={0}
						max={2}
						step={0.05}
						value={falloff}
						onChange={setFalloff}
						maxDecimals={2}
					/>

					<DiscreteSlider2
						label="Density"
						min={0}
						max={3}
						step={0.05}
						value={density}
						onChange={setDensity}
						maxDecimals={2}
					/>

					<DiscreteSlider2
						label="Weight"
						min={0}
						max={1}
						step={0.01}
						value={weight}
						onChange={setWeight}
						maxDecimals={2}
					/>

					<ColorPicker
						label="Light Color"
						value={lightColor}
						onChange={setLightColor}
					/>

					<ColorPicker
						label="Falloff Color"
						value={falloffColor}
						onChange={setFalloffColor}
					/>

					<ColorPicker
						label="Background Color"
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

export default VolumetricTextPage;
