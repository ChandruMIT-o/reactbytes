"use client";

import React, { useState, useRef } from "react";
import HeaderText from "../../components/textfields/HeaderText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import { AtmosphericDrift, AtmosphericDriftRef } from "../../meta/background/AtmosphericDrift/AtmosphericDrift";
import { loaderProps, componentCode, creditsData } from "./AtmosphericDriftData";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import { RotateCcw } from "lucide-react";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { Credits } from "../../components/buttongroup/Credits";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";

const presetOptions = [
  { id: "mistral", label: "Mistral Surge" },
  { id: "sirocco", label: "Sirocco Dust" },
  { id: "aurora", label: "Boreal Flow" },
  { id: "storm", label: "Winter Gale" },
  { id: "zen", label: "Zenith Drift" }
];

const paletteOptions = [
  { id: "midnight", label: "Midnight Blue" },
  { id: "aurora", label: "Aurora Green" },
  { id: "sirocco", label: "Sirocco Gold" },
  { id: "volcanic", label: "Volcanic Red" },
  { id: "monochrome", label: "Monochrome" }
];

const pagePresets = [
  {
    id: "default",
    label: "Mistral Surge (Default)",
    config: {
      preset: "mistral",
      palette: "midnight",
      showGrid: true,
      audioEnabled: false
    }
  },
  {
    id: "sirocco",
    label: "Sirocco Dust",
    config: {
      preset: "sirocco",
      palette: "sirocco",
      showGrid: true,
      audioEnabled: false
    }
  },
  {
    id: "aurora",
    label: "Boreal Flow",
    config: {
      preset: "aurora",
      palette: "aurora",
      showGrid: true,
      audioEnabled: false
    }
  },
  {
    id: "storm",
    label: "Winter Gale",
    config: {
      preset: "storm",
      palette: "volcanic",
      showGrid: true,
      audioEnabled: true
    }
  },
  {
    id: "zen",
    label: "Zenith Drift",
    config: {
      preset: "zen",
      palette: "monochrome",
      showGrid: false,
      audioEnabled: false
    }
  }
];

const PRESETS_DATA: Record<string, any> = {
  mistral: {
    palette: "midnight",
    flowSpeed: 3.1,
    windWobble: 0.024,
    trailPersistence: 0.94,
    particleCount: 15000
  },
  sirocco: {
    palette: "sirocco",
    flowSpeed: 2.4,
    windWobble: 0.022,
    trailPersistence: 0.92,
    particleCount: 12000
  },
  aurora: {
    palette: "aurora",
    flowSpeed: 1.8,
    windWobble: 0.012,
    trailPersistence: 0.96,
    particleCount: 18000
  },
  storm: {
    palette: "volcanic",
    flowSpeed: 3.8,
    windWobble: 0.035,
    trailPersistence: 0.88,
    particleCount: 22000
  },
  zen: {
    palette: "monochrome",
    flowSpeed: 1.2,
    windWobble: 0.005,
    trailPersistence: 0.97,
    particleCount: 8000
  }
};

export const AtmosphericDriftPage = () => {
  const [preset, setPreset] = useState<any>("mistral");
  const [palette, setPalette] = useState<any>("midnight");
  const [showGrid, setShowGrid] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [particleCount, setParticleCount] = useState(15000);
  const [flowSpeed, setFlowSpeed] = useState(3.1);
  const [trailPersistence, setTrailPersistence] = useState(0.94);
  const [windWobble, setWindWobble] = useState(0.024);

  const [currentPreset, setCurrentPreset] = useState("default");

  // Custom pressure systems spawned in the component
  const [systems, setSystems] = useState<{ id: string; name: string; spin: number }[]>([]);
  const [nextPlacementType, setNextPlacementType] = useState<"high" | "low">("high");

  const driftRef = useRef<AtmosphericDriftRef>(null);
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const p = pagePresets.find((x) => x.id === presetId);
    if (p) {
      setCurrentPreset(presetId);
      setPreset(p.config.preset);
      setPalette(p.config.palette);
      setShowGrid(p.config.showGrid);
      setAudioEnabled(p.config.audioEnabled);

      const config = PRESETS_DATA[p.config.preset];
      if (config) {
        setParticleCount(config.particleCount);
        setFlowSpeed(config.flowSpeed);
        setTrailPersistence(config.trailPersistence);
        setWindWobble(config.windWobble);
      }
      setKey((prev) => prev + 1);
    }
  };

  const handlePresetChange = (presetId: string) => {
    setPreset(presetId);
    const config = PRESETS_DATA[presetId];
    if (config) {
      setPalette(config.palette);
      setParticleCount(config.particleCount);
      setFlowSpeed(config.flowSpeed);
      setTrailPersistence(config.trailPersistence);
      setWindWobble(config.windWobble);
    }
  };

  const handleReplay = () => {
    setKey((prev) => prev + 1);
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<AtmosphericDrift
  preset="${preset}"
  palette="${palette}"
  showGrid={${showGrid}}
  audioEnabled={${audioEnabled}}
  particleCount={${particleCount}}
  flowSpeed={${flowSpeed}}
  trailPersistence={${trailPersistence}}
  windWobble={${windWobble}}
>
  <div className="flex items-center justify-center p-12">
    <div className="bg-slate-950/40 backdrop-blur-md p-6 rounded-2xl">
      <h2>Atmospheric Vector Drift</h2>
      <p>Click anywhere to place pressure systems.</p>
    </div>
  </div>
</AtmosphericDrift>`;

  return (
    <div className="flex flex-col gap-5 text-neutral-200">
      <div id="atmospheric-drift-title">
        <HeaderText text="Atmospheric Drift" option={3} />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[600px] relative overflow-hidden flex items-center justify-center p-2 rounded-xl">
              <AtmosphericDrift
                key={key}
                ref={driftRef}
                preset={preset}
                palette={palette}
                showGrid={showGrid}
                audioEnabled={audioEnabled}
                particleCount={particleCount}
                flowSpeed={flowSpeed}
                trailPersistence={trailPersistence}
                windWobble={windWobble}
                nextPlacementType={nextPlacementType}
                onPlacementTypeChange={setNextPlacementType}
                onSystemsChange={setSystems}
                className="relative w-full h-full bg-[#07090e] overflow-hidden font-sans-custom select-none text-white rounded-xl border border-neutral-800"
              >
              </AtmosphericDrift>
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
                  Configuration
                </h3>
              </div>
              <DefaultComboBox
                label="Presets"
                options={pagePresets}
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
          <DefaultComboBox
            label="Wind Preset"
            options={presetOptions}
            value={preset}
            onChange={handlePresetChange}
            dynamicWidth={true}
          />

          <DefaultComboBox
            label="Color Spectrum"
            options={paletteOptions}
            value={palette}
            onChange={setPalette}
            dynamicWidth={true}
          />

          <ToggleComponent
            label="Show Coordinate Grid"
            checked={showGrid}
            onChange={setShowGrid}
          />

          <ToggleComponent
            label="Audio Generation"
            checked={audioEnabled}
            onChange={setAudioEnabled}
          />

          <DiscreteSlider2
            label="Vector Fluidity (Count)"
            min={4000}
            max={25000}
            step={1000}
            value={particleCount}
            onChange={setParticleCount}
            maxDecimals={0}
          />

          <DiscreteSlider2
            label="Flow Drift Speed"
            min={0.5}
            max={5.0}
            step={0.1}
            value={flowSpeed}
            onChange={setFlowSpeed}
            maxDecimals={1}
          />

          <DiscreteSlider2
            label="Trail Retention (Persistence)"
            min={0.80}
            max={0.99}
            step={0.01}
            value={trailPersistence}
            onChange={setTrailPersistence}
            maxDecimals={2}
          />

          <DiscreteSlider2
            label="Cell Dissipation (Wobble)"
            min={0.0}
            max={0.08}
            step={0.002}
            value={windWobble}
            onChange={setWindWobble}
            maxDecimals={3}
          />

          {/* Node Spawn Action Selector */}
          <div className="bg-rb-neutral-3 border border-rb-neutral-4/40 rounded-2xl p-4 mt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none">
                Next Click Action
              </span>
              <button
                onClick={() => setNextPlacementType(prev => (prev === "high" ? "low" : "high"))}
                className="text-[10px] font-mono text-rb-accent-1 hover:underline transition-colors"
              >
                [Force Swap]
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border ${nextPlacementType === "high"
                  ? "bg-blue-950/40 border-blue-500/40 text-blue-300"
                  : "bg-amber-950/40 border-amber-500/40 text-amber-300"
                  }`}
              >
                {nextPlacementType === "high" ? "H" : "L"}
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  {nextPlacementType === "high" ? "Anti-Cyclone [H]" : "Cyclone [L]"}
                </div>
                <div className="text-[9px] text-white/40 font-mono">
                  Click on canvas to place pressure source
                </div>
              </div>
            </div>
          </div>

          {/* Active Nodes List */}
          <div className="bg-rb-neutral-3 border border-rb-neutral-4/40 rounded-2xl p-4 mt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rb-accent-2/40 leading-none">
                Active Invisible Cells ({systems.length})
              </span>
              {systems.length > 0 && (
                <button
                  onClick={() => driftRef.current?.clearAllSystems()}
                  className="text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors uppercase"
                >
                  [Clear All]
                </button>
              )}
            </div>
            {systems.length === 0 ? (
              <div className="text-[10px] font-mono text-white/30 italic text-center py-4 bg-black/20 rounded-xl border border-dashed border-white/5">
                No active gravity wells.<br />Click anywhere on backdrop to spawn.
              </div>
            ) : (
              <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                {systems.map((sys) => (
                  <div
                    key={sys.id}
                    className="flex items-center justify-between bg-black/20 px-3 py-2 rounded-xl text-xs hover:bg-black/35 transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`w-2 h-2 rounded-full ${sys.spin < 0 ? "bg-blue-400 animate-pulse" : "bg-amber-400 animate-pulse"
                          }`}
                      />
                      <span className="font-mono truncate text-white/80">{sys.name}</span>
                    </div>
                    <button
                      onClick={() => driftRef.current?.deleteSystem(sys.id)}
                      className="text-red-400/70 hover:text-red-400 text-[10px] font-mono ml-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
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

export default AtmosphericDriftPage;
