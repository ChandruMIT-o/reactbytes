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
import { atmosphericDriftConfig } from "../meta/background/AtmosphericDrift/AtmosphericDrift.config";
import { asciiWaveConfig } from "../meta/background/wave/AsciiWave/AsciiWave.config";
import { magneticDotMeshConfig } from "../meta/background/dotted/MagneticDotMesh.config";
import { bubbleGradientConfig } from "../meta/background/gradient/BubbleGradient.config";
import { fractalBackgroundConfig } from "../meta/background/fractal/FractalBackground.config";
import { cellularAutomataConfig } from "../meta/background/cellular/CellularAutomataBackground.config";
import { hiveMindConfig } from "../meta/background/flowfield/HiveMind.config";
import { helonBraidConfig } from "../meta/background/wave/HelonBraid/HelonBraid.config";
import { perlinSmokeConfig } from "../meta/background/gradient/PerlinSmoke.config";
import { metallicTwirlConfig } from "../meta/background/metallic/MetallicTwirl.config";
import { liquidNoiseConfig } from "../meta/background/liquid/LiquidNoise.config";
import { velvetNoiseConfig } from "../meta/background/liquid/VelvetNoise.config";
import { fbmNoiseConfig } from "../meta/background/liquid/FbmNoise.config";
import { eyeMatrixConfig } from "../meta/background/dotted/EyeMatrix.config";
import { poissonNoiseConfig } from "../meta/background/dotted/PoissonNoise.config";
import { liquidGridConfig } from "../meta/background/liquid/LiquidGrid.config";
import { iridescentGradientConfig } from "../meta/background/gradient/IridescentGradient.config";
import { kaleidoscopicConfig } from "../meta/background/fractal/Kaleidoscopic.config";
import { dottedVortexConfig } from "../meta/background/dotted/DottedVortex.config";
import { concentricWavesConfig } from "../meta/background/wave/ConcentricWaves/ConcentricWaves.config";
import { rippleConfig } from "../meta/background/wave/Ripples/Ripple.config";
import { blackHoleConfig } from "../meta/background/space/BlackHole.config";
import { singularityConfig } from "../meta/background/space/Singularity.config";
import { spaceTimeConfig } from "../meta/background/topographic/SpaceTime.config";
import { ditherConfig } from "../meta/background/dotted/Dither.config";
import { superstructureConfig } from "../meta/background/space/Superstructure.config";
import { scrollWarpConfig } from "../meta/background/space/ScrollWarp/ScrollWarp.config";
import { warpSpeedConfig } from "../meta/background/space/WarpSpeed/WarpSpeed.config";
import { voidOrbConfig } from "../meta/background/space/VoidOrb.config";
import { petalWaveConfig } from "../meta/background/wave/PetalWave/PetalWave.config";
import { stripeFlowConfig } from "../meta/background/StripeFlow/StripeFlow.config";
import { dockedCarouselConfig } from "../meta/carousel/DockedCarousel/DockedCarousel.config";

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
  atmosphericDriftConfig,
  asciiWaveConfig,
  magneticDotMeshConfig,
  bubbleGradientConfig,
  fractalBackgroundConfig,
  cellularAutomataConfig,
  hiveMindConfig,
  helonBraidConfig,
  perlinSmokeConfig,
  metallicTwirlConfig,
  liquidNoiseConfig,
  velvetNoiseConfig,
  fbmNoiseConfig,
  eyeMatrixConfig,
  poissonNoiseConfig,
  liquidGridConfig,
  iridescentGradientConfig,
  kaleidoscopicConfig,
  dottedVortexConfig,
  concentricWavesConfig,
  rippleConfig,
  blackHoleConfig,
  singularityConfig,
  spaceTimeConfig,
  ditherConfig,
  superstructureConfig,
  scrollWarpConfig,
  warpSpeedConfig,
  voidOrbConfig,
  petalWaveConfig,
  stripeFlowConfig,
  dockedCarouselConfig,
];
