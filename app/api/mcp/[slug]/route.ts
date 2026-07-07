import { NextResponse } from "next/server";
import { resolveComponent } from "@/app/registry/Resolver";
import { generateReadmeContent } from "@/app/registry/ReadmeGenerator";
import { ComponentCodeDatabase } from "@/app/registry/ComponentCodeDatabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  // Resolve component config
  const component = resolveComponent(slug);
  if (!component) {
    return NextResponse.json(
      { error: `Component "${slug}" not found in registry database.` },
      { status: 404 },
    );
  }

  // Fetch component source code and file stats from in-memory database
  const lazyLoad = ComponentCodeDatabase[component.slug];
  if (!lazyLoad) {
    return NextResponse.json(
      { error: `Component source code not found in bundled code database.` },
      { status: 500 },
    );
  }

  const { code, lastModified } = await lazyLoad();

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
    dependencies: component.dependencies || {}, // ← add this line
    lastModified,
    context: {
      context_from_dev: component.context_from_dev || null,
      readme,
    },
    code,
  });
}
