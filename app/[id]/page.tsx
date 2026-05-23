"use client";
import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import HeaderText from "../components/textfields/HeaderText";
import ParagraphText from "../components/textfields/ParagraphText";
import { ComponentRegistry } from "../components/layout/ComponentRegistry";

export default function DynamicComponentPage() {
	const params = useParams();
	const id = params.id as string;

	const entry = ComponentRegistry[id];

	const renderContent = () => {
		if (entry) {
			const Component = entry.component;
			return <Component />;
		}

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
