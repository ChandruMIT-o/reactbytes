import { extractExportName } from "./extractExportName";

interface McpComponentResponse {
  name: string;
  slug: string;
  category: string;
  componentPath: string;
  version?: string | null;
  npmPackageName?: string | null;
  dependencies?: Record<string, string>;
  lastModified: string;
  context: {
    context_from_dev?: string | null;
    readme: string;
  };
  code: string;
}

function toPascalCase(name: string): string {
  return name.replace(/\s+/g, "");
}

export function buildPrompt(
  data: McpComponentResponse,
  liveUsageCode?: string,
): string {
  const componentName = extractExportName(data.code, toPascalCase(data.name));
  const deps = data.dependencies ? Object.keys(data.dependencies) : [];
  const suggestedPath = `components/${data.category}/${componentName}.tsx`;
  const isClientComponent = data.code.trimStart().startsWith('"use client"');

  const metadataBlock = `\`\`\`yaml
name: ${data.name}
category: ${data.category}
framework: react
language: typescript
styling: tailwind
client: ${isClientComponent}
dependencies:
${deps.length > 0 ? deps.map((d) => `  - ${d}`).join("\n") : "  - none"}
\`\`\``;

  const dependenciesSection =
    deps.length > 0
      ? `\n### Dependencies\n\nThis component requires the following peer dependencies, in addition to the package itself:\n\n${deps.map((d) => `- \`${d}\``).join("\n")}\n`
      : "";

  const currentConfigSection = liveUsageCode
    ? `\n### Current Configuration\n\nThe user has customized this component in the React Bytes playground. Use these exact prop values, not the defaults shown above:\n\n\`\`\`tsx\n${liveUsageCode}\n\`\`\`\n`
    : "";

  return `## Integrate the <${data.name} /> component from React Bytes

You are helping integrate an open-source React component into an existing application.

${metadataBlock}
${currentConfigSection}

---

${data.context.readme}
${dependenciesSection}
### Compatibility

- React 18+
- TypeScript 5+
- Tailwind CSS 3+

### Full Component Source
\`\`\`tsx
${data.code}
\`\`\`

### Integration Requirements

- This component assumes Tailwind CSS is configured in the target project.
- Place the component at: \`${suggestedPath}\` (adjust to match your project's conventions).
- Do not modify the public props or component behavior unless required for compatibility.
- Integrate the component while preserving: animation behavior, responsiveness, and accessibility.
`;
}
