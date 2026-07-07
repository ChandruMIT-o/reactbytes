"use client";

import React, { useState } from "react";
import HeaderText from "@/app/components/textfields/HeaderText";
import PreviewTab from "@/app/components/tabsection/PreviewTab";
import InstallationTabs from "@/app/components/tabsection/InstallationTabs";
import { PropsTable } from "@/app/components/table/PropsTable";
import { Credits } from "@/app/components/buttongroup/Credits";
import DefaultTextInput from "@/app/components/textinput/DefaultTextInput";
import ColorPicker from "@/app/components/colorpicker/ColorPicker";
import DiscreteSlider2 from "@/app/components/slider/DiscreteSlider2";
import ToggleComponent from "@/app/components/buttongroup/ToggleComponent";
import DefaultComboBox from "@/app/components/combobox/DefaultComboBox";
import { RotateCcw } from "lucide-react";
import { BookmarkButton } from "@/app/components/buttons/BookmarkButton";
import { CopyPromptButton } from "../buttons/CopyPromptButton";
import { ComponentConfig, PropConfig } from "@/app/registry/ComponentDatabase";
import { ComponentMap } from "@/app/registry/ComponentMap";
import { extractExportName } from "@/lib/extractExportName";

interface ShowcasePlaygroundProps {
  dbEntry: Omit<ComponentConfig, "component">;
  codeContent: string;
}

export const ShowcasePlayground: React.FC<ShowcasePlaygroundProps> = ({
  dbEntry,
  codeContent,
}) => {
  const Component = ComponentMap[dbEntry.slug];

  const [propStates, setPropStates] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    dbEntry.props.forEach((prop) => {
      initial[prop.name] = prop.default;
    });
    return initial;
  });

  const [currentPreset, setCurrentPreset] = useState("default");
  const [key, setKey] = useState(0);

  const applyPreset = (presetId: string) => {
    const preset = dbEntry.presets.find((p) => p.id === presetId);
    if (preset) {
      setCurrentPreset(presetId);
      setPropStates((prev) => ({ ...prev, ...preset.config }));
      setKey((prev) => prev + 1);
    }
  };

  const handleReplay = () => setKey((prev) => prev + 1);
  const handleReset = () => applyPreset("default");
  const handlePropChange = (name: string, value: any) => {
    setPropStates((prev) => ({ ...prev, [name]: value }));
    setKey((prev) => prev + 1);
  };

  const generateUsageCode = () => {
    const exportName = extractExportName(
      codeContent,
      dbEntry.name.replace(/\s+/g, ""),
    );
    const propStrings = dbEntry.props
      .map((prop) => {
        const val = propStates[prop.name];
        if (val === undefined || val === null) return "";
        if (Array.isArray(val))
          return `  ${prop.name}={['${val.join("', '")}']}`;
        if (prop.type === "string" || prop.type === "color")
          return `  ${prop.name}="${val}"`;
        if (prop.type === "number" || prop.type === "boolean")
          return `  ${prop.name}={${val}}`;
        if (prop.type === "select") return `  ${prop.name}="${val}"`;
        return "";
      })
      .filter(Boolean)
      .join("\n");
    return `<${exportName}\n${propStrings}\n/>`;
  };

  const loaderProps = [
    {
      title: "API Reference",
      props: dbEntry.props.map((prop) => ({
        name: prop.name,
        type:
          prop.type === "select"
            ? prop.options
              ? prop.options.map((o) => `'${o.id}'`).join(" | ")
              : "string"
            : prop.type,
        defaultValue:
          prop.type === "string" ||
          prop.type === "color" ||
          prop.type === "select"
            ? `'${prop.default}'`
            : String(prop.default),
        description: prop.description,
      })),
    },
  ];

  const usageCode = generateUsageCode();

  const renderControl = (prop: PropConfig) => {
    const val = propStates[prop.name];
    const label =
      prop.name.charAt(0).toUpperCase() +
      prop.name.slice(1).replace(/([A-Z])/g, " $1");

    switch (prop.type) {
      case "string":
        return (
          <DefaultTextInput
            key={prop.name}
            label={label}
            value={val}
            onChange={(v) => handlePropChange(prop.name, v)}
            placeholder={`Enter ${prop.name}...`}
          />
        );
      case "boolean":
        return (
          <ToggleComponent
            key={prop.name}
            label={label}
            checked={val}
            onChange={(v) => handlePropChange(prop.name, v)}
          />
        );
      case "number":
        return (
          <DiscreteSlider2
            key={prop.name}
            label={label}
            min={prop.min ?? 0}
            max={prop.max ?? 100}
            step={prop.step ?? 1}
            value={val}
            onChange={(v) => handlePropChange(prop.name, v)}
            maxDecimals={
              prop.step && prop.step < 1
                ? String(prop.step).split(".")[1]?.length || 1
                : 0
            }
            showTicks={true}
          />
        );
      case "color":
        return (
          <ColorPicker
            key={prop.name}
            label={label}
            value={val}
            onChange={(v) => handlePropChange(prop.name, v)}
          />
        );
      case "select":
        return (
          <DefaultComboBox
            key={prop.name}
            label={label}
            options={prop.options || []}
            value={val}
            onChange={(v) => handlePropChange(prop.name, v)}
            dynamicWidth={false}
          />
        );
      default:
        return null;
    }
  };

  const renderPreviewContent = () => {
    if (dbEntry.category === "background") {
      return (
        <div
          className={`w-full h-[600px] relative overflow-hidden flex items-center justify-center p-0 rounded-xl border border-rb-neutral-4 ${dbEntry.containerClassName || ""}`}
        >
          <Component
            key={key}
            {...propStates}
            className={`relative w-full h-full overflow-hidden select-none ${dbEntry.customClassName || ""}`}
          />
        </div>
      );
    }
    return (
      <div
        className={`w-full h-[400px] relative overflow-hidden flex items-center justify-center p-10 ${dbEntry.containerClassName || ""}`}
      >
        <Component key={key} {...propStates} {...(dbEntry.staticProps || {})} />
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div id={`${dbEntry.slug}-title`}>
        <HeaderText text={dbEntry.name} option={3} />
      </div>

      <div id="preview">
        <PreviewTab
          previewContent={renderPreviewContent()}
          onReplay={handleReplay}
          usageCode={usageCode}
          codeContent={codeContent}
          collapsible={true}
          tabsAction={
            <div className="flex items-center gap-2">
              <BookmarkButton slug={dbEntry.slug} />
              <CopyPromptButton slug={dbEntry.slug} liveUsageCode={usageCode} />
            </div>
          }
          header={
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-xs ml-4 font-bold text-rb-accent-1 uppercase">
                  Props
                </h3>
              </div>
              <DefaultComboBox
                label="Presets"
                options={dbEntry.presets}
                value={currentPreset}
                onChange={applyPreset}
                dynamicWidth={true}
              />
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
          }
        >
          {dbEntry.props.map((prop) => renderControl(prop))}
        </PreviewTab>
      </div>

      <div id="installation-tabs">
        <InstallationTabs
          componentSlug={dbEntry.slug}
          componentName={dbEntry.npmPackageName || "react-bytes"}
          extraLibraries={(() => {
            const libs = [...Object.keys(dbEntry.dependencies || {})];
            return libs.length > 0 ? libs : undefined;
          })()}
        />
      </div>

      <div id="api-reference" className="flex flex-col gap-5">
        <HeaderText text="API Reference" option={6} />
        <PropsTable categories={loaderProps} />
      </div>

      <div id="credits" className="w-full max-w-5xl mx-auto py-10">
        <Credits data={dbEntry.credits} />
      </div>
    </div>
  );
};

export default ShowcasePlayground;
