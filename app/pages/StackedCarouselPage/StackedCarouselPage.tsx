"use client";

import React, { useState } from "react";
import { RotateCcw } from "lucide-react";
import HeaderText from "../../components/textfields/HeaderText";
import ParagraphText from "../../components/textfields/ParagraphText";
import PreviewTab from "../../components/tabsection/PreviewTab";
import InstallationTabs from "../../components/tabsection/InstallationTabs";
import { PropsTable } from "../../components/table/PropsTable";
import StackedCarousel from "@/app/meta/carousel/StackedCarousel/StackedCarousel";
import { StackedCarouselProps, componentCode, creditsData } from "./StackedCarouselData";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import { Credits } from "../../components/buttongroup/Credits";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";

interface Preset {
  id: string;
  label: string;
  config: {
    autoRotateInterval: number;
    showPagination: boolean;
  };
}

const presets: Preset[] = [
  {
    id: "default",
    label: "Standard",
    config: {
      autoRotateInterval: 5000,
      showPagination: true,
    },
  },
  {
    id: "fast",
    label: "Fast Pace",
    config: {
      autoRotateInterval: 2500,
      showPagination: true,
    },
  },
  {
    id: "dramatic",
    label: "Dramatic",
    config: {
      autoRotateInterval: 10000,
      showPagination: true,
    },
  },
  {
    id: "minimal",
    label: "Minimalist",
    config: {
      autoRotateInterval: 5000,
      showPagination: false,
    },
  },
  {
    id: "manual",
    label: "Manual Only",
    config: {
      autoRotateInterval: 999999,
      showPagination: true,
    },
  },
];

const StackedCarouselPage = () => {
  const [autoRotateInterval, setAutoRotateInterval] = useState(5000);
  const [showPagination, setShowPagination] = useState(true);
  const [currentPreset, setCurrentPreset] = useState("default");

  const applyPreset = (presetId: string) => {
    const preset = presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setAutoRotateInterval(preset.config.autoRotateInterval);
      setShowPagination(preset.config.showPagination);
    }
  };

  const handleReset = () => {
    applyPreset("default");
  };

  const usageCode = `<StackedCarousel 
  autoRotateInterval={${autoRotateInterval}} 
  showPagination={${showPagination}} 
/>`;

  return (
    <div className="flex flex-col gap-5">
      <div id="stacked-carousel-title">
        <HeaderText text="Stacked Carousel" option={3} />
      </div>
      <ParagraphText
        text="An elegant, depth-aware carousel with smooth transitions and gooey liquid progress indicators. Designed for high-fidelity product showcases and storytelling."
        option={4}
      />

      <div id="preview">
        <PreviewTab
          previewContent={
            <div className="w-full h-[600px] flex items-center justify-center p-4">
              <StackedCarousel 
                autoRotateInterval={autoRotateInterval}
                showPagination={showPagination}
              />
            </div>
          }
          usageCode={usageCode}
          codeContent={componentCode}
          collapsible={true}
          header={
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">Props</h3>
              </div>
              <DefaultComboBox
                options={presets}
                value={currentPreset}
                onChange={applyPreset}
                dynamicWidth={true}
                label="Presets"
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
          <DiscreteSlider2
            label="Rotate Interval (ms)"
            min={1000}
            max={15000}
            step={500}
            value={autoRotateInterval}
            onChange={setAutoRotateInterval}
            showTicks={true}
          />
          <ToggleComponent
            label="Show Pagination"
            checked={showPagination}
            onChange={setShowPagination}
          />
        </PreviewTab>
      </div>

      <div id="installation-tabs">
        <InstallationTabs />
      </div>

      <div id="api-reference" className="flex flex-col gap-5">
        <HeaderText text="API Reference" option={6} />
        <PropsTable categories={[{ title: "Props", props: StackedCarouselProps }]} />
      </div>

      <div id="credits" className="w-full max-w-5xl mx-auto py-10">
        <Credits data={creditsData} />
      </div>
    </div>
  );
};

export default StackedCarouselPage;
