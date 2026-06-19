import { revealUnderConfig } from "../meta/text/TextEnter/RevealUnder.config";
import { fallDownConfig } from "../meta/text/TextEnter/FallDown.config";
import { variableWeightTextConfig } from "../meta/text/TextEnter/VariableWeightText.config";
import { apertureTextConfig } from "../meta/text/ApertureText/ApertureText.config";
import { axialShearTextConfig } from "../meta/text/AxialShearText/AxialShearText.config";
import { blurTextConfig } from "../meta/text/BlurText/BlurText.config";
import { elasticRevealConfig } from "../meta/text/Hover/ElasticReveal.config";
import { focalBlurConfig } from "../meta/text/Interactive/FocalBlurText.config";
import { granularTextConfig } from "../meta/text/Interactive/GranularText.config";
import { magneticTextConfig } from "../meta/text/Interactive/MagneticText.config";
import { shatterTextConfig } from "../meta/text/Interactive/ShatterText.config";
import { waveTextConfig } from "../meta/text/Interactive/WaveText.config";
import { gooeyMorphConfig } from "../meta/text/Morph/GooeyMorph.config";
import { swarmTextConfig } from "../meta/text/SwarmText/SwarmText.config";
import { blurInConfig } from "../meta/text/TextEnter/BlurIn.config";
import { scrambleRevealConfig } from "../meta/text/TextEnter/ScrambleReveal.config";
import { volumetricTextConfig } from "../meta/text/VolumetricText/VolumetricText.config";
import { keyboardTextConfig } from "../meta/text/keyboard/KeyboardText.config";
import { kineticTextConfig } from "../meta/text/Interactive/KineticText.config";
import { tectonicLatticeTextConfig } from "../meta/text/TectonicLatticeText/TectonicLatticeText.config";
import { stratumTextConfig } from "../meta/text/StratumText/StratumText.config";
import { helixTextConfig } from "../meta/text/HelixText/HelixText.config";
import { phaseShellTextConfig } from "../meta/text/PhaseShellText/PhaseShellText.config";
import { scaffoldTextConfig } from "../meta/text/ScaffoldText/ScaffoldText.config";
import { tectonicTrackTextConfig } from "../meta/text/TectonicTrackText/TectonicTrackText.config";

export interface PropConfig {
  name: string;
  type: "string" | "number" | "boolean" | "color" | "select";
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { id: string; label: string }[];
  description: string;
}

export interface PresetConfig {
  id: string;
  label: string;
  config: Record<string, any>;
}

export interface CreditsItem {
  name: string;
  role: string;
  url: string;
}

export interface CreditsSection {
  title: string;
  items: CreditsItem[];
}

export interface ComponentConfig {
  slug: string;
  name: string;
  category: "text" | "background" | "carousel" | "miscellaneous" | "cursor";
  componentPath: string;
  props: PropConfig[];
  presets: PresetConfig[];
  credits: CreditsSection[];
  staticProps?: Record<string, any>;
  customClassName?: string;
  containerClassName?: string;
}

export const ComponentDatabase: ComponentConfig[] = [
  revealUnderConfig,
  fallDownConfig,
  variableWeightTextConfig,
  apertureTextConfig,
  axialShearTextConfig,
  blurTextConfig,
  elasticRevealConfig,
  focalBlurConfig,
  granularTextConfig,
  magneticTextConfig,
  shatterTextConfig,
  waveTextConfig,
  gooeyMorphConfig,
  swarmTextConfig,
  blurInConfig,
  scrambleRevealConfig,
  volumetricTextConfig,
  keyboardTextConfig,
  kineticTextConfig,
  tectonicLatticeTextConfig,
  stratumTextConfig,
  helixTextConfig,
  phaseShellTextConfig,
  scaffoldTextConfig,
  tectonicTrackTextConfig,
];
