import { revealUnderConfig } from "../meta/text/TextEnter/RevealUnder.config";
import { fallDownConfig } from "../meta/text/TextEnter/FallDown.config";
import { variableWeightTextConfig } from "../meta/text/TextEnter/VariableWeightText.config";

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
  componentPath: string; // File path relative to project root, e.g., "app/meta/text/TextEnter/RevealUnder.tsx"
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
];
