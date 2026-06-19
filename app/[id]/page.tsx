import React from "react";
import fs from "fs/promises";
import path from "path";
import { registryKeys } from "../components/layout/RegistryKeys";
import { ComponentDatabase } from "../registry/ComponentDatabase";
import ShowcasePlayground from "../components/layout/ShowcasePlayground";
import PageTransition from "../components/layout/PageTransition";
import LegacyPageRenderer from "../components/layout/LegacyPageRenderer";

export async function generateStaticParams() {
  return registryKeys.map((id) => ({ id }));
}

export default async function DynamicComponentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Check if the component is in the new database
  const dbEntry = ComponentDatabase.find((entry) => entry.slug === id);

  if (dbEntry) {
    let codeContent = "";
    try {
      const fullPath = path.join(process.cwd(), dbEntry.componentPath);
      codeContent = await fs.readFile(fullPath, "utf-8");
    } catch (err) {
      console.error(`Failed to read component source code at ${dbEntry.componentPath}`, err);
    }

    return (
      <PageTransition routeKey={id}>
        <ShowcasePlayground
          dbEntry={dbEntry}
          codeContent={codeContent}
        />
      </PageTransition>
    );
  }

  // 2. Fallback to legacy ComponentRegistry entries via client-side LegacyPageRenderer
  return (
    <PageTransition routeKey={id}>
      <LegacyPageRenderer id={id} />
    </PageTransition>
  );
}
export const dynamicParams = true;
