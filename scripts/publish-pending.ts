import { ComponentDatabase } from "../app/registry/ComponentDatabase";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Read root package.json for baseline externals
const rootPackageJsonPath = path.join(__dirname, "../package.json");
const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, "utf8"));
const rootDeps = [
  ...Object.keys(rootPackageJson.dependencies || {}),
  ...Object.keys(rootPackageJson.devDependencies || {}),
  "react",
  "react-dom",
];

async function run() {
  const tempDir = path.join(__dirname, "../temp-publish");
  
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  for (const component of ComponentDatabase) {
    const { npmPackageName, version, componentPath, dependencies = {}, peerDependencies = {} } = component;
    if (!npmPackageName || !version) {
      console.log(`[-] Skipping component "${component.name}" (missing npmPackageName or version)`);
      continue;
    }

    console.log(`\n[*] Checking component "${component.name}" (${npmPackageName}@${version})...`);

    // Check npm registry to see if version is already published
    let alreadyPublished = false;
    try {
      const output = execSync(`npm view ${npmPackageName}@${version} version`, {
        stdio: ["pipe", "pipe", "ignore"],
        env: { ...process.env, NPM_CONFIG_REGISTRY: "https://registry.npmjs.org/" }
      }).toString().trim();
      if (output === version) {
        alreadyPublished = true;
      }
    } catch (e) {
      // Package 404 or command error means it's not published
    }

    if (alreadyPublished) {
      console.log(`[✓] Component "${component.name}" version ${version} is already published. Skipping.`);
      continue;
    }

    console.log(`[!] Component "${component.name}" needs to be published!`);

    const compTempDir = path.join(tempDir, component.slug);
    fs.mkdirSync(compTempDir, { recursive: true });

    // Determine entry file relative to root
    const entryFile = path.resolve(__dirname, "..", componentPath);
    if (!fs.existsSync(entryFile)) {
      throw new Error(`Component entry file does not exist: ${entryFile}`);
    }

    // Build list of externals
    const externals = Array.from(new Set([
      ...rootDeps,
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
    ]));

    // Run tsup to compile
    console.log(`[*] Compiling with tsup...`);
    const externalFlags = externals.map(dep => `--external "${dep}"`).join(" ");
    const tsupCmd = `npx tsup "${entryFile}" --entry.index="${entryFile}" --format cjs,esm --dts --clean --inject-style --tsconfig tsconfig.publish.json --out-dir "${compTempDir}" ${externalFlags}`;
    
    console.log(`[Executing]: ${tsupCmd}`);
    execSync(tsupCmd, { stdio: "inherit" });

    // Generate package.json
    const packageJsonContent = {
      name: npmPackageName,
      version: version,
      main: "./index.js",
      module: "./index.mjs",
      types: "./index.d.ts",
      files: [
        "index.js",
        "index.mjs",
        "index.d.ts",
        "index.d.mts"
      ],
      peerDependencies: {
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0",
        ...peerDependencies,
      },
      dependencies: {
        ...dependencies,
      },
      publishConfig: {
        "access": "public"
      }
    };

    fs.writeFileSync(
      path.join(compTempDir, "package.json"),
      JSON.stringify(packageJsonContent, null, 2)
    );

    // Generate README.md dynamically from config metadata
    const componentName = path.basename(componentPath, path.extname(componentPath));
    let readmeContent = `# ${component.name}\n\n`;
    readmeContent += `A premium, modular React component from the **React Bytes** collection. Built with React and TypeScript.\n\n`;
    readmeContent += `## Installation\n\n`;
    readmeContent += `\`\`\`bash\nnpm install ${npmPackageName}\n\`\`\`\n\n`;
    
    readmeContent += `## Usage\n\n`;
    readmeContent += `\`\`\`tsx\nimport { ${componentName} } from "${npmPackageName}";\n\n`;
    readmeContent += `export default function Example() {\n`;
    readmeContent += `  return (\n`;
    readmeContent += `    <${componentName} />\n`;
    readmeContent += `  );\n`;
    readmeContent += `}\n`;
    readmeContent += `\`\`\`\n\n`;

    if (component.props && component.props.length > 0) {
      readmeContent += `## Properties\n\n`;
      readmeContent += `| Prop | Type | Default | Description |\n`;
      readmeContent += `| :--- | :--- | :--- | :--- |\n`;
      for (const prop of component.props) {
        const defaultVal = prop.default !== undefined
          ? (typeof prop.default === "object" ? JSON.stringify(prop.default) : String(prop.default))
          : "-";
        readmeContent += `| \`${prop.name}\` | \`${prop.type}\` | \`${defaultVal}\` | ${prop.description} |\n`;
      }
      readmeContent += `\n`;
    }

    if (component.presets && component.presets.length > 0) {
      readmeContent += `## Presets\n\n`;
      readmeContent += `This component includes the following design presets:\n\n`;
      for (const preset of component.presets) {
        readmeContent += `- **${preset.label}** (\`${preset.id}\`)\n`;
      }
      readmeContent += `\n`;
    }

    if (component.credits && component.credits.length > 0) {
      readmeContent += `## Credits & Inspiration\n\n`;
      for (const section of component.credits) {
        readmeContent += `### ${section.title}\n`;
        for (const item of section.items) {
          readmeContent += `- [${item.name}](${item.url}) - ${item.role}\n`;
        }
        readmeContent += `\n`;
      }
    }

    readmeContent += `---\n\n`;
    readmeContent += `For interactive playgrounds, customizable controls, and code copy-pasting, visit the full showcase page at [React Bytes - ${component.name}](https://reactbytes.dev/${component.slug}).\n`;

    fs.writeFileSync(
      path.join(compTempDir, "README.md"),
      readmeContent
    );
    console.log(`[+] Generated README.md dynamically.`);

    // Setup .npmrc with NPM_TOKEN if present
    const npmToken = process.env.NPM_TOKEN;
    if (npmToken) {
      fs.writeFileSync(
        path.join(compTempDir, ".npmrc"),
        `//registry.npmjs.org/:_authToken=${npmToken}\n`
      );
      console.log(`[+] Created .npmrc using NPM_TOKEN.`);
    } else {
      console.log(`[!] Warning: NPM_TOKEN not found in environment. Relying on local/global npm login config.`);
    }

    // Publish to NPM registry
    const isDryRun = process.argv.includes("--dry-run");
    const publishCmd = isDryRun ? "npm publish --dry-run" : "npm publish";
    console.log(`[*] ${isDryRun ? "Dry-running" : "Publishing"} package to npm...`);
    try {
      execSync(publishCmd, {
        cwd: compTempDir,
        stdio: "inherit",
      });
      console.log(`[✓] Successfully ${isDryRun ? "dry-ran" : "published"} ${npmPackageName}@${version}!`);
    } catch (publishError) {
      console.error(`[✗] Failed to ${isDryRun ? "dry-run" : "publish"} ${npmPackageName}@${version}:`, publishError);
      throw publishError;
    }
  }

  // Cleanup temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`\n[*] Cleaned up temp-publish directory.`);
  }
}

run().catch(err => {
  console.error("[✗] Publication script failed:", err);
  process.exit(1);
});
