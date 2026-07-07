/**
 * scripts/audit-dependencies.ts
 *
 * Compares each component's actual import statements against its declared
 * `dependencies` field in its *.config.ts file. Flags mismatches so you can
 * fill in missing entries (e.g. framer-motion, ogl) without opening all 70
 * config files by hand.
 *
 * Run with: npx tsx scripts/audit-dependencies.ts
 */
import * as fs from "fs";
import * as path from "path";
import { ComponentDatabase } from "../app/registry/ComponentDatabase";

// Packages we don't care about flagging — these are assumed core/always-present.
const IGNORE_PACKAGES = new Set([
  "react",
  "react-dom",
  "next",
  "next/link",
  "next/image",
]);

function extractImportedPackages(code: string): string[] {
  const importRegex = /from\s+["']([^"'./][^"']*)["']/g;
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(code)) !== null) {
    // normalize scoped/subpath imports to their package root, e.g. "framer-motion/dist/x" -> "framer-motion"
    const raw = match[1];
    const parts = raw.split("/");
    const pkg = raw.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
    if (!IGNORE_PACKAGES.has(pkg)) {
      found.add(pkg);
    }
  }
  return Array.from(found);
}

function run() {
  console.log("[*] Auditing declared dependencies vs actual imports...\n");

  let mismatchCount = 0;

  for (const component of ComponentDatabase) {
    const fullPath = path.resolve(__dirname, "..", component.componentPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(
        `[!] ${component.slug}: source file not found at ${component.componentPath}`,
      );
      continue;
    }

    const code = fs.readFileSync(fullPath, "utf-8");
    const actualImports = extractImportedPackages(code);
    const declared = new Set(Object.keys(component.dependencies || {}));

    const missing = actualImports.filter((pkg) => !declared.has(pkg));

    if (missing.length > 0) {
      mismatchCount++;
      console.log(`[✗] ${component.slug} (${component.componentPath})`);
      console.log(
        `    declared: ${declared.size > 0 ? Array.from(declared).join(", ") : "(none)"}`,
      );
      console.log(`    missing:  ${missing.join(", ")}\n`);
    }
  }

  if (mismatchCount === 0) {
    console.log("[✓] All components have accurate dependency declarations.");
  } else {
    console.log(
      `[*] Found ${mismatchCount} component(s) with undeclared dependencies.`,
    );
  }
}

run();
