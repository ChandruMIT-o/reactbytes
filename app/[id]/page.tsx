"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import HeaderText from "../components/textfields/HeaderText";
import ParagraphText from "../components/textfields/ParagraphText";

// Modularized Page Components
import { IntroductionPage } from "../pages/IntroductionPage/IntroductionPage";
import { InstallationPage } from "../pages/InstallationPage/InstallationPage";
import { ChangelogPage } from "../pages/ChangelogPage/ChangelogPage";
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
import { GooeyMorphTextPage } from "../pages/MorphTextPage/GooeyMorphTextPage";
import { ElasticRevealPage } from "../pages/ElasticRevealPage/ElasticRevealPage";
import { ScrambleRevealPage } from "../pages/ScrambleRevealPage/ScrambleRevealPage";
import { KeyboardTextPage } from "../pages/KeyboardTextPage/KeyboardTextPage";
import { HiveMindPage } from "../pages/HiveMindPage/HiveMindPage";
import { PerlinSmokePage } from "../pages/PerlinSmokePage/PerlinSmokePage";
import { MetallicTwirlPage } from "../pages/MetallicTwirlPage/MetallicTwirlPage";
import { LiquidNoisePage } from "../pages/LiquidNoisePage/LiquidNoisePage";
import { StandardAccordionPage } from "../pages/StandardAccordionPage/StandardAccordionPage";
import { GlowCardPage } from "../pages/GlowCardPage/GlowCardPage";
import { ShinyButtonPage } from "../pages/ShinyButtonPage/ShinyButtonPage";
import { DockedCarouselPage } from "../pages/DockedCarouselPage/DockedCarouselPage";
import VerticalMenuPage from "../pages/VerticalMenuPage/VerticalMenuPage";
import HoloCardPage from "../pages/HoloCardPage/HoloCardPage";
import { FollowCursorPage } from "../pages/FollowCursorPage/FollowCursorPage";
import StackedCarouselPage from "../pages/StackedCarouselPage/StackedCarouselPage";
import { VoidCarouselPage } from "../pages/VoidCarouselPage/VoidCarouselPage";
import { MorphCarouselPage } from "../pages/MorphCarouselPage/MorphCarouselPage";
import StackedCardCarouselPage from "../pages/StackedCardCarouselPage/StackedCardCarouselPage";
import NovelMenuPage from "../pages/NovelMenuPage/NovelMenuPage";
import { SplitCarouselPage } from "../pages/SplitCarouselPage/SplitCarouselPage";
import StackedCardsPage from "../pages/StackedCardsPage/StackedCardsPage";

export default function DynamicComponentPage() {
	const params = useParams();
	const id = params.id as string;

	const renderContent = () => {
		if (id === "intro") return <IntroductionPage />;
		if (id === "install") return <InstallationPage />;
		if (id === "changelog") return <ChangelogPage />;
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
		if (id === "gooey-morph") return <GooeyMorphTextPage />;
		if (id === "elastic-reveal") return <ElasticRevealPage />;
		if (id === "scramble-reveal") return <ScrambleRevealPage />;
		if (id === "keyboard-text") return <KeyboardTextPage />;
		if (id === "hive-mind") return <HiveMindPage />;
		if (id === "perlin-smoke") return <PerlinSmokePage />;
		if (id === "metallic-twirl") return <MetallicTwirlPage />;
		if (id === "liquid-noise") return <LiquidNoisePage />;
		if (id === "standard-accordion") return <StandardAccordionPage />;
		if (id === "glow-card") return <GlowCardPage />;
		if (id === "shiny-button") return <ShinyButtonPage />;
		if (id === "docked-carousel") return <DockedCarouselPage />;
		if (id === "vertical-menu") return <VerticalMenuPage />;
		if (id === "holo-card") return <HoloCardPage />;
		if (id === "follow-cursor") return <FollowCursorPage />;
		if (id === "stacked-carousel") return <StackedCarouselPage />;
		if (id === "void-carousel") return <VoidCarouselPage />;
		if (id === "morph-carousel") return <MorphCarouselPage />;
		if (id === "stacked-card-carousel") return <StackedCardCarouselPage />;
		if (id === "novel-menu") return <NovelMenuPage />;
		if (id === "split-carousel") return <SplitCarouselPage />;
		if (id === "stacked-cards") return <StackedCardsPage />;

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
