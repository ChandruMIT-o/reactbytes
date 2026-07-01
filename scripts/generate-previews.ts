import { ComponentDatabase } from "../app/registry/ComponentDatabase";
import { chromium } from "playwright";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { execSync, spawn, ChildProcess } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as http from "http";

const ffmpegPath = ffmpegInstaller.path;

const videosDir = path.resolve(__dirname, "../public/previews/videos");
const thumbnailsDir = path.resolve(__dirname, "../public/previews/thumbnails");
const tempDir = path.resolve(__dirname, "../public/previews/temp");

// Ensure directories exist
fs.mkdirSync(videosDir, { recursive: true });
fs.mkdirSync(thumbnailsDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });

function checkServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.request(
      {
        host: "localhost",
        port: 3000,
        method: "HEAD",
        path: "/",
        timeout: 1000,
      },
      () => {
        resolve(true);
      }
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => resolve(false));
    req.end();
  });
}

async function moveMouseInCircle(page: any, durationMs: number) {
  const start = Date.now();
  const centerX = 300;
  const centerY = 160;
  const radius = 120;
  let angle = 0;

  // Initial move to center
  await page.mouse.move(centerX, centerY);
  await page.waitForTimeout(100);

  while (Date.now() - start < durationMs) {
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    await page.mouse.move(x, y);
    angle += 0.15;
    await page.waitForTimeout(30);
  }
}

function printHelp() {
  console.log(`
Usage: npx tsx scripts/generate-previews.ts [options] [component-slugs...]

Options:
  -c, --only, --components <slugs>  Comma-separated list of component slugs to capture
  -f, --force                       Force regeneration of previews even if they already exist
  -h, --help                        Show this help message

Examples:
  npx tsx scripts/generate-previews.ts
  npx tsx scripts/generate-previews.ts shatter-text magnetic-text
  npx tsx scripts/generate-previews.ts --only shatter-text,magnetic-text --force
`);
}

async function run() {
  const args = process.argv.slice(2);
  let force = false;
  const targetComponents: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--help" || arg === "-h") {
      printHelp();
      return;
    }
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--only" || arg === "--components" || arg === "-c") {
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith("-")) {
        targetComponents.push(...nextArg.split(",").map(s => s.trim()));
        i++;
      }
    } else if (arg === "--force" || arg === "-f") {
      force = true;
    } else if (!arg.startsWith("-")) {
      targetComponents.push(arg.trim());
    }
  }

  let componentsToCapture = ComponentDatabase;
  const isTargeted = targetComponents.length > 0;
  if (isTargeted) {
    componentsToCapture = ComponentDatabase.filter((comp) => {
      return targetComponents.some((target) => {
        const lowerTarget = target.toLowerCase();
        return (
          comp.slug.toLowerCase() === lowerTarget ||
          comp.name.toLowerCase() === lowerTarget ||
          comp.slug.replace(/-/g, "").toLowerCase() === lowerTarget.replace(/-/g, "")
        );
      });
    });

    if (componentsToCapture.length === 0) {
      console.error(`[✗] Error: No components matched the filter: ${targetComponents.join(", ")}`);
      console.log(`Available component slugs are: ${ComponentDatabase.map(c => c.slug).join(", ")}`);
      process.exit(1);
    }
  }

  console.log("[*] Initializing preview generator...");

  const isUp = await checkServer();
  let serverProcess: ChildProcess | null = null;

  if (!isUp) {
    console.log("[-] Next.js dev server is not running on port 3000. Spawning Next dev server...");
    serverProcess = spawn("npx", ["next", "dev"], {
      shell: true,
      stdio: "inherit",
    });
    console.log("[-] Waiting 8 seconds for Next.js to start...");
    await new Promise((resolve) => setTimeout(resolve, 8000));
  } else {
    console.log("[✓] Found running dev server on http://localhost:3000");
  }

  console.log("[*] Launching headless browser...");
  const browser = await chromium.launch({ headless: true });

  const total = componentsToCapture.length;
  console.log(`[*] Target components to capture: ${total}. Starting captures...`);

  for (let i = 0; i < total; i++) {
    const comp = componentsToCapture[i];
    const label = `[${i + 1}/${total}] ${comp.name} (${comp.slug})`;
    console.log(`\n--- ${label} ---`);

    const targetUrl = `http://localhost:3000/capture/${comp.slug}`;
    const mp4Path = path.join(videosDir, `${comp.slug}.mp4`);
    const jpgPath = path.join(thumbnailsDir, `${comp.slug}.jpg`);

    // Skip if both already exist (incremental updates), unless forced or explicitly targeted
    if (!force && !isTargeted && fs.existsSync(mp4Path) && fs.existsSync(jpgPath)) {
      console.log(`[✓] Already generated. Skipping.`);
      continue;
    }

    try {
      // Create context with video recording enabled
      const context = await browser.newContext({
        viewport: { width: 600, height: 320 },
        recordVideo: {
          dir: tempDir,
          size: { width: 600, height: 320 },
        },
      });

      const page = await context.newPage();
      
      console.log(`[-] Navigating to ${targetUrl}`);
      await page.goto(targetUrl, { waitUntil: "load" });
      
      // Let it settle for a bit
      await page.waitForTimeout(1000);

      // Take static thumbnail screenshot
      console.log(`[-] Taking screenshot for thumbnail...`);
      await page.screenshot({ path: jpgPath, type: "jpeg", quality: 80 });

      // Run mouse interaction loop (e.g. for 4 seconds) to record animations/hovers
      console.log(`[-] Simulating mouse interactions...`);
      await moveMouseInCircle(page, 4000);

      // Close page and context to finish writing the WebM recording
      const video = page.video();
      const webmPath = video ? await video.path() : null;

      await page.close();
      await context.close();

      if (webmPath && fs.existsSync(webmPath)) {
        console.log(`[-] Converting WebM preview to optimized MP4 format...`);
        // -y overwrite, -an remove audio, libx264, crf 28 (very compressed but crisp enough), yuv420p for wide web browser support
        const cmd = `"${ffmpegPath}" -y -i "${webmPath}" -an -vcodec libx264 -crf 28 -preset fast -pix_fmt yuv420p "${mp4Path}"`;
        execSync(cmd, { stdio: "ignore" });
        console.log(`[✓] Successfully exported optimized preview video: ${mp4Path}`);
        
        // Clean up raw WebM file
        fs.unlinkSync(webmPath);
      } else {
        console.warn(`[!] Warning: No WebM recording file found for ${comp.slug}`);
      }
    } catch (err) {
      console.error(`[✗] Failed to capture component ${comp.slug}:`, err);
    }
  }

  console.log("\n[*] Captures completed. Cleaning up...");
  await browser.close();

  // Remove temporary recordings directory if empty or clean up leftovers
  try {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
      fs.rmdirSync(tempDir);
    }
  } catch (err) {
    console.error("[!] Warning: Failed to clean up temp directory", err);
  }

  if (serverProcess) {
    console.log("[-] Stopping dev server process...");
    serverProcess.kill("SIGTERM");
  }

  console.log("[✓] All done!");
}

run().catch((err) => {
  console.error("[✗] Fatal error running preview generator:", err);
  process.exit(1);
});
