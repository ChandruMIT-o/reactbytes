import { NextResponse } from "next/server";
import { resolveComponent } from "@/app/registry/Resolver";
import { generateReadmeContent } from "@/app/registry/ReadmeGenerator";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Resolve component config
  const component = resolveComponent(slug);
  if (!component) {
    return NextResponse.json(
      { error: `Component "${slug}" not found in registry database.` },
      { status: 404 }
    );
  }

  // Load component source code and file stats
  let code = "";
  let lastModified = "";
  try {
    const fullPath = path.join(process.cwd(), component.componentPath);
    code = await fs.readFile(fullPath, "utf-8");
    
    const stat = await fs.stat(fullPath);
    lastModified = stat.mtime.toISOString();
  } catch (err) {
    console.error(`Failed to read component code file at path: ${component.componentPath}`, err);
    return NextResponse.json(
      { error: `Component source file not found or unreadable on disk.` },
      { status: 500 }
    );
  }

  // Generate dynamic documentation (which incorporates context_from_dev)
  const readme = generateReadmeContent(component);

  // Return the unified LLM-optimized payload
  return NextResponse.json({
    name: component.name,
    slug: component.slug,
    category: component.category,
    componentPath: component.componentPath,
    version: component.version || null,
    npmPackageName: component.npmPackageName || null,
    lastModified,
    context: {
      context_from_dev: component.context_from_dev || null,
      readme,
    },
    code,
  });
}
