import { NextRequest, NextResponse } from "next/server";
import { ComponentDatabase } from "@/app/registry/ComponentDatabase";
import { resolveComponent } from "@/app/registry/Resolver";
import { generateReadmeContent } from "@/app/registry/ReadmeGenerator";
import { ComponentCodeDatabase } from "@/app/registry/ComponentCodeDatabase";

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

export async function POST(request: NextRequest) {
  try {
    const jsonRpcPayload = await request.json();
    const { jsonrpc, method, id, params } = jsonRpcPayload;

    if (jsonrpc !== "2.0") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id || null,
          error: { code: -32600, message: "Invalid Request: expected jsonrpc: '2.0'" },
        },
        { status: 400 }
      );
    }

    // 1. Handle Protocol Tool Discovery (tools/list)
    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          tools: [
            {
              name: "get_component",
              description: "Fetches the raw TSX/JSX source code, dynamic README documentation, presets, and developer notes for any React Bytes UI component.",
              inputSchema: {
                type: "object",
                properties: {
                  slug: {
                    type: "string",
                    description: "The kebab-case identifier of the component (e.g. 'magnetic-text' or 'shiny-button').",
                  },
                },
                required: ["slug"],
              },
            },
          ],
        },
      });
    }

    // 2. Handle Protocol Tool Execution (tools/call)
    if (method === "tools/call") {
      if (!params || params.name !== "get_component") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: "Method not found or invalid tool name." },
        });
      }

      const slug = params.arguments?.slug;
      if (!slug) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32602, message: "Invalid params: 'slug' is required." },
        });
      }

      const component = resolveComponent(slug);
      if (!component) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32000, message: `Component "${slug}" not found in database.` },
        });
      }

      const lazyLoad = ComponentCodeDatabase[component.slug];
      if (!lazyLoad) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          error: { code: -32000, message: `Source code for "${slug}" not found in bundled database.` },
        });
      }

      const { code, lastModified } = await lazyLoad();
      const readme = generateReadmeContent(component);

      // Construct a single unified context response optimized for LLM consumption
      let responseText = `---
Component: ${component.name}
Slug: ${component.slug}
Category: ${component.category}
Version: ${component.version || "N/A"}
NPM Package: ${component.npmPackageName || "N/A"}
Last Modified: ${lastModified}
---\n\n`;

      responseText += `# Documentation & Usage Guidelines\n\n`;
      responseText += `${readme}\n\n`;
      responseText += `# Raw Source Code (TSX)\n\n`;
      responseText += `\`\`\`tsx\n${code}\n\`\`\`\n`;

      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: responseText,
            },
          ],
        },
      });
    }

    // Default error for unsupported methods
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: `Method "${method}" not found.` },
    });
  } catch (err) {
    console.error("MCP POST handler error:", err);
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: { code: -32603, message: "Internal JSON-RPC server error." },
      },
      { status: 500 }
    );
  }
}
