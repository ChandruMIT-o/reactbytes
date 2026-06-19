"use client";

import dynamic from "next/dynamic";
import React from "react";

export const ComponentMap: Record<string, React.ComponentType<any>> = {
  "reveal-under": dynamic(() => import("../meta/text/TextEnter/RevealUnder")),
  "fall-down": dynamic(() => import("../meta/text/TextEnter/FallDown")),
  "variable-weight": dynamic(() => import("../meta/text/TextEnter/VariableWeightText")),
  "aperture-text": dynamic(() => import("../meta/text/ApertureText/ApertureText")),
  "axial-shear-text": dynamic(() => import("../meta/text/AxialShearText/AxialShearText")),
  "blur-text": dynamic(() => import("../meta/text/BlurText/BlurText")),
  "elastic-reveal": dynamic(() => import("../meta/text/Hover/ElasticReveal")),
  "focal-blur": dynamic(() => import("../meta/text/Interactive/FocalBlurText")),
  "granular-text": dynamic(() => import("../meta/text/Interactive/GranularText")),
  "magnetic-text": dynamic(() => import("../meta/text/Interactive/MagneticText")),
  "shatter-text": dynamic(() => import("../meta/text/Interactive/ShatterText")),
  "wave-text": dynamic(() => import("../meta/text/Interactive/WaveText")),
  "gooey-morph": dynamic(() => import("../meta/text/Morph/GooeyMorph")),
  "swarm-text": dynamic(() => import("../meta/text/SwarmText/SwarmText")),
  "blur-in": dynamic(() => import("../meta/text/TextEnter/BlurIn")),
  "scramble-reveal": dynamic(() => import("../meta/text/TextEnter/ScrambleReveal")),
  "volumetric-text": dynamic(() => import("../meta/text/VolumetricText/VolumetricText")),
  "keyboard-text": dynamic(() => import("../meta/text/keyboard/KeyboardText")),
  "kinetic-text": dynamic(() => import("../meta/text/Interactive/KineticText")),
  "tectonic-lattice-text": dynamic(() => import("../meta/text/TectonicLatticeText/TectonicLatticeText")),
  "stratum-text": dynamic(() => import("../meta/text/StratumText/StratumText")),
  "helix-text": dynamic(() => import("../meta/text/HelixText/HelixText")),
  "phase-shell-text": dynamic(() => import("../meta/text/PhaseShellText/PhaseShellText")),
  "scaffold-text": dynamic(() => import("../meta/text/ScaffoldText/ScaffoldText")),
  "tectonic-track-text": dynamic(() => import("../meta/text/TectonicTrackText/TectonicTrackText")),
};
