import { NextResponse } from "next/server";
import { ComponentDatabase } from "@/app/registry/ComponentDatabase";

export async function GET() {
  const componentsList = ComponentDatabase.map((comp) => ({
    name: comp.name,
    slug: comp.slug,
    category: comp.category,
    npmPackageName: comp.npmPackageName,
    version: comp.version,
  }));

  return NextResponse.json(componentsList);
}
