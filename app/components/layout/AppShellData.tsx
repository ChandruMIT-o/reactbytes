import { ComponentRegistry } from "./ComponentRegistry";

const registryEntries = Object.values(ComponentRegistry);

export const generalItems = registryEntries
  .filter((entry) => entry.category === "general")
  .map((entry) => ({ id: entry.id, label: entry.label }));

export const textItems = registryEntries
  .filter((entry) => entry.category === "text")
  .map((entry) => ({ id: entry.id, label: entry.label }));

export const backgroundItems = registryEntries
  .filter((entry) => entry.category === "background")
  .map((entry) => ({ id: entry.id, label: entry.label }));

export const carouselItems = registryEntries
  .filter((entry) => entry.category === "carousel")
  .map((entry) => ({ id: entry.id, label: entry.label }));

export const miscellaneousItems = registryEntries
  .filter((entry) => entry.category === "miscellaneous")
  .map((entry) => ({ id: entry.id, label: entry.label }));

export const cursorItems = registryEntries
  .filter((entry) => entry.category === "cursor")
  .map((entry) => ({ id: entry.id, label: entry.label }));

export const pageSections: Record<string, { id: string; label: string }[]> = registryEntries.reduce(
  (acc, entry) => {
    acc[entry.id] = entry.sections;
    return acc;
  },
  {} as Record<string, { id: string; label: string }[]>
);

export const mainNavItems = [
  { id: "components", label: "Components" },
  { id: "docs", label: "Docs" },
  { id: "cursors", label: "Cursors" },
];
