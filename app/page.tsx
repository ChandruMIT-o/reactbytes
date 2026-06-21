"use client";

import React from "react";
import { motion } from "framer-motion";
import { IntroductionPage } from "./pages/IntroductionPage/IntroductionPage";

export default function Home() {
	return (
		<motion.div
			initial={{ opacity: 0, filter: "blur(12px)", y: 4 }}
			animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
		>
			<IntroductionPage />
		</motion.div>
	);
}
