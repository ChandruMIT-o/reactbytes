import { ComponentConfig } from "./ComponentDatabase";

/**
 * Generates the README.md content dynamically based on the component config metadata.
 */
export function generateReadmeContent(component: ComponentConfig): string {
  const { name, npmPackageName, slug, componentPath, props = [], presets = [], credits = [], context_from_dev } = component;
  
  // Extract component name from path (e.g. BlurText from app/meta/.../BlurText.tsx)
  const baseName = componentPath.split("/").pop() || "";
  const componentName = baseName.split(".")[0] || name.replace(/\s+/g, "");

  let readmeContent = `# ${name}\n\n`;
  readmeContent += `A premium, modular React component from the **React Bytes** collection. Built with React and TypeScript.\n\n`;
  
  if (context_from_dev) {
    readmeContent += `> **Developer Context / Usage Note:**\n`;
    readmeContent += `> ${context_from_dev}\n\n`;
  }
  
  readmeContent += `## Installation\n\n`;
  readmeContent += `\`\`\`bash\nnpm install ${npmPackageName || `@reactbytes/${slug}`}\n\`\`\`\n\n`;
  
  readmeContent += `## Usage\n\n`;
  readmeContent += `\`\`\`tsx\nimport { ${componentName} } from "${npmPackageName || `@reactbytes/${slug}`}";\n\n`;
  readmeContent += `export default function Example() {\n`;
  readmeContent += `  return (\n`;
  readmeContent += `    <${componentName} />\n`;
  readmeContent += `  );\n`;
  readmeContent += `}\n`;
  readmeContent += `\`\`\`\n\n`;

  if (props && props.length > 0) {
    readmeContent += `## Properties\n\n`;
    readmeContent += `| Prop | Type | Default | Description |\n`;
    readmeContent += `| :--- | :--- | :--- | :--- |\n`;
    for (const prop of props) {
      const defaultVal = prop.default !== undefined
        ? (typeof prop.default === "object" ? JSON.stringify(prop.default) : String(prop.default))
        : "-";
      readmeContent += `| \`${prop.name}\` | \`${prop.type}\` | \`${defaultVal}\` | ${prop.description} |\n`;
    }
    readmeContent += `\n`;
  }

  if (presets && presets.length > 0) {
    readmeContent += `## Presets\n\n`;
    readmeContent += `This component includes the following design presets:\n\n`;
    for (const preset of presets) {
      readmeContent += `- **${preset.label}** (\`${preset.id}\`)\n`;
    }
    readmeContent += `\n`;
  }

  if (credits && credits.length > 0) {
    readmeContent += `## Credits & Inspiration\n\n`;
    for (const section of credits) {
      readmeContent += `### ${section.title}\n`;
      for (const item of section.items) {
        readmeContent += `- [${item.name}](${item.url}) - ${item.role}\n`;
      }
      readmeContent += `\n`;
    }
  }

  readmeContent += `---\n\n`;
  readmeContent += `For interactive playgrounds, customizable controls, and code copy-pasting, visit the full showcase page at [React Bytes - ${name}](https://react-bytes.web.app/${slug}).\n`;

  return readmeContent;
}
