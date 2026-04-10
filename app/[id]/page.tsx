"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import HeaderText from "../components/textfields/HeaderText";
import ParagraphText from "../components/textfields/ParagraphText";

// Modularized Page Components
import { InstallationPage } from "../pages/InstallationPage/InstallationPage";
import { BlurTextPage } from "../pages/BlurTextPage/BlurTextPage";
import { MagneticDotMeshPage } from "../pages/MagneticDotMeshPage/MagneticDotMeshPage";
import BubbleGradientPage from "../pages/BubbleGradientPage/BubbleGradientPage";
import { FallDownPage } from "../pages/FallDownPage/FallDownPage";
import { BlurInPage } from "../pages/BlurInPage/BlurInPage";
import { RevealUnderPage } from "../pages/RevealUnderPage/RevealUnderPage";
import VariableWeightTextPage from "../pages/VariableWeightTextPage/VariableWeightTextPage";
import { WaveTextPage } from "../pages/WaveTextPage/WaveTextPage";
import { FocalBlurTextPage } from "../pages/FocalBlurTextPage/FocalBlurTextPage";
import { MagneticTextPage } from "../pages/MagneticTextPage/MagneticTextPage";
import { ShatterTextPage } from "../pages/ShatterTextPage/ShatterTextPage";
import { FractalBackgroundPage } from "../pages/FractalBackgroundPage/FractalBackgroundPage";
import { CellularAutomataPage } from "../pages/CellularAutomataPage/CellularAutomataPage";


export default function DynamicComponentPage() {
	const params = useParams();
	const id = params.id as string;

	const renderContent = () => {
		if (id === "install") return <InstallationPage />;
		if (id === "blur-text") return <BlurTextPage />;
		if (id === "magnetic-dots") return <MagneticDotMeshPage />;
		if (id === "bubble-gradient") return <BubbleGradientPage />;
		if (id === "fall-down") return <FallDownPage />;
		if (id === "blur-in") return <BlurInPage />;
		if (id === "reveal-under") return <RevealUnderPage />;
		if (id === "variable-weight") return <VariableWeightTextPage />;
		if (id === "wave-text") return <WaveTextPage />;
		if (id === "focal-blur") return <FocalBlurTextPage />;
		if (id === "magnetic-text") return <MagneticTextPage />;
		if (id === "shatter-text") return <ShatterTextPage />;
		if (id === "fractal-background") return <FractalBackgroundPage />;
		if (id === "cellular-automata") return <CellularAutomataPage />;


		return (
			<div className="flex flex-col gap-5">
				<HeaderText
					text={id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")}
					option={3}
				/>
				<ParagraphText
					text="Content for this section is coming soon."
					option={4}
				/>
			</div>
		);
	};

	return (
		<motion.div
			key={id}
			initial={{ opacity: 0, filter: "blur(12px)", y: 4 }}
			animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
		>
			{renderContent()}
		</motion.div>
	);
}
