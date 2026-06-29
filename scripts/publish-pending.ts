import { ComponentDatabase } from "../app/registry/ComponentDatabase";
import { generateReadmeContent } from "../app/registry/ReadmeGenerator";
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

interface ComponentResult {
  name: string;
  npmPackageName?: string;
  version?: string;
  status: "published" | "already-published" | "skipped-config" | "failed-compile" | "failed-publish" | "failed-other";
  details?: string;
}

async function run() {
  const tempDir = path.join(__dirname, "../temp-publish");
  
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  const results: ComponentResult[] = [];

  for (const component of ComponentDatabase) {
    const { npmPackageName, version, componentPath, dependencies = {}, peerDependencies = {} } = component;
    if (!npmPackageName || !version) {
      console.log(`[-] Skipping component "${component.name}" (missing npmPackageName or version)`);
      results.push({
        name: component.name,
        status: "skipped-config",
        details: "missing npmPackageName or version"
      });
      continue;
    }

    try {
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
        results.push({
          name: component.name,
          npmPackageName,
          version,
          status: "already-published"
        });
        continue;
      }

      console.log(`[!] Component "${component.name}" needs to be published!`);

      const compTempDir = path.join(tempDir, component.slug);
      if (fs.existsSync(compTempDir)) {
        fs.rmSync(compTempDir, { recursive: true, force: true });
      }
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
      try {
        execSync(tsupCmd, { stdio: "inherit" });
      } catch (tsupErr: any) {
        const err = new Error(`Compilation failed: ${tsupErr.message || tsupErr}`);
        (err as any).phase = "compile";
        throw err;
      }

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

      // Generate README.md dynamically from config metadata using shared utility
      const readmeContent = generateReadmeContent(component);
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
      } catch (publishError: any) {
        const err = new Error(`Publish failed: ${publishError.message || publishError}`);
        (err as any).phase = "publish";
        throw err;
      }

      results.push({
        name: component.name,
        npmPackageName,
        version,
        status: "published"
      });

    } catch (componentError: any) {
      const phase = componentError.phase || "other";
      console.error(`[✗] Failed to process component "${component.name}":`, componentError.message || componentError);
      
      results.push({
        name: component.name,
        npmPackageName,
        version,
        status: phase === "compile" ? "failed-compile" : (phase === "publish" ? "failed-publish" : "failed-other"),
        details: componentError.message || String(componentError)
      });
    }
  }

  // Cleanup temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log(`\n[*] Cleaned up temp-publish directory.`);
  }

  // Generate Report
  console.log("\n==================================================");
  console.log("              PUBLICATION REPORT");
  console.log("==================================================");
  
  const published = results.filter(r => r.status === "published");
  const alreadyPublished = results.filter(r => r.status === "already-published");
  const skippedConfig = results.filter(r => r.status === "skipped-config");
  const failedCompile = results.filter(r => r.status === "failed-compile");
  const failedPublish = results.filter(r => r.status === "failed-publish");
  const failedOther = results.filter(r => r.status === "failed-other");
  const failed = [...failedCompile, ...failedPublish, ...failedOther];

  console.log(`Total Components Checked: ${results.length}`);
  console.log(`- Compiled & Published:   ${published.length}`);
  console.log(`- Already Published:      ${alreadyPublished.length}`);
  console.log(`- Skipped (No Config):    ${skippedConfig.length}`);
  console.log(`- Failed:                 ${failed.length}`);

  if (published.length > 0) {
    console.log(`\n[✓] SUCCESSFULLY PROCESSED (${published.length}):`);
    for (const r of published) {
      console.log(`  - ${r.name} (${r.npmPackageName}@${r.version})`);
    }
  }

  if (alreadyPublished.length > 0 || skippedConfig.length > 0) {
    console.log(`\n[-] SKIPPED / UP TO DATE (${alreadyPublished.length + skippedConfig.length}):`);
    for (const r of alreadyPublished) {
      console.log(`  - ${r.name} (${r.npmPackageName}@${r.version}) [Already published]`);
    }
    for (const r of skippedConfig) {
      console.log(`  - ${r.name} [Skipped: ${r.details}]`);
    }
  }

  if (failed.length > 0) {
    console.log(`\n[✗] FAILED (${failed.length}):`);
    for (const r of failedCompile) {
      console.log(`  - ${r.name} (${r.npmPackageName}@${r.version}) - Compile Error: ${r.details}`);
    }
    for (const r of failedPublish) {
      console.log(`  - ${r.name} (${r.npmPackageName}@${r.version}) - Publish Error: ${r.details}`);
    }
    for (const r of failedOther) {
      console.log(`  - ${r.name} - Error: ${r.details}`);
    }
  }

  console.log("==================================================");

  if (failed.length > 0) {
    throw new Error(`${failed.length} component(s) failed during the run.`);
  }
}

run().catch(err => {
  console.error("[✗] Publication script failed:", err.message || err);
  process.exit(1);
});
