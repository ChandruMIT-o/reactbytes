"use client";

import React, { useState } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { KeyboardText } from "../../meta/text/keyboard/KeyboardText";
import { loaderProps, creditsData } from "./KeyboardTextData";
import { DiscreteSlider } from "../../components/slider/DiscreteSlider";
import { TextInput } from "../../components/textinput/TextInput";
import { Credits } from "../../components/buttongroup/Credits";

export const KeyboardTextPage = () => {
	const [text, setText] = useState("KEYBOARD");
	const [yBounce, setYBounce] = useState(10);
	const [key, setKey] = useState(0);

	const usageCode = `<KeyboardText
  text="${text}"
  yBounce={${yBounce}}
  className="text-white text-5xl md:text-8xl tracking-tight"
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
								className="text-white text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[10rem] tracking-tighter mix-blend-difference z-10 font-[Poppins]"
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
						<div className="flex items-center justify-between border-b border-rb-neutral-4/50">
							<div className="flex flex-col gap-1">
								<h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
									Props
								</h3>
							</div>
						</div>
					}
				>
					<TextInput
						label="Rendered Text"
						value={text}
						onChange={(e) => setText(e.target.value)}
						placeholder="Type anything..."
					/>

					<DiscreteSlider
						label="Bounce Depth (px)"
						min={0}
						max={35}
						step={1}
						value={yBounce}
						onChange={setYBounce}
						maxDecimals={0}
						showTicks={false}
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
