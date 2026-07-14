import { ComponentDatabase } from "../app/registry/ComponentDatabase";

async function fetchJsonWithRetry(url: string, retries = 5, delayMs = 1000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        const wait = delayMs * Math.pow(2, i);
        console.warn(`[Rate Limit] 429 for ${url}. Retrying in ${wait}ms...`);
        await new Promise(resolve => setTimeout(resolve, wait));
        continue;
      }
      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return await res.json();
    } catch (err: any) {
      if (i === retries - 1) {
        throw err;
      }
      const wait = delayMs * Math.pow(2, i);
      console.warn(`[Error] ${err.message || err}. Retrying in ${wait}ms...`);
      await new Promise(resolve => setTimeout(resolve, wait));
    }
  }
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function padRight(str: string, length: number): string {
  return str.padEnd(length, " ").substring(0, length);
}

function printRow(
  name: string,
  version: string,
  created: string,
  allTime: string,
  lastYear: string,
  lastMonth: string,
  lastWeek: string,
  lastDay: string
) {
  console.log(
    `${padRight(name, 35)} | ${padRight(version, 8)} | ${padRight(created, 10)} | ${padRight(allTime, 10)} | ${padRight(lastYear, 10)} | ${padRight(lastMonth, 10)} | ${padRight(lastWeek, 9)} | ${padRight(lastDay, 8)}`
  );
}

function sumLastDays(downloads: { downloads: number }[], days: number): number {
  const startIdx = Math.max(0, downloads.length - days);
  let sum = 0;
  for (let i = startIdx; i < downloads.length; i++) {
    sum += downloads[i].downloads;
  }
  return sum;
}

async function getPackageStats(packageName: string) {
  // 1. Fetch package info from npm registry to get creation date and latest version
  const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
  const registryData = await fetchJsonWithRetry(registryUrl);
  
  if (!registryData) {
    return {
      name: packageName,
      found: false,
      created: "N/A",
      version: "N/A",
      totalDownloads: 0,
      lastYear: 0,
      lastMonth: 0,
      lastWeek: 0,
      lastDay: 0,
    };
  }

  const created = registryData.time?.created ? registryData.time.created.split("T")[0] : "2024-01-01";
  const version = registryData["dist-tags"]?.latest || "N/A";

  // 2. Fetch daily downloads from creation date to today using range endpoint (one request!)
  const todayStr = formatDate(new Date());
  let start = created;
  if (new Date(start) < new Date("2015-01-10")) {
    start = "2015-01-10"; // NPM download stats only go back to 2015-01-10
  }
  
  const downloadsUrl = `https://api.npmjs.org/downloads/range/${start}:${todayStr}/${encodeURIComponent(packageName)}`;
  const dlData = await fetchJsonWithRetry(downloadsUrl);

  if (!dlData || !dlData.downloads || !Array.isArray(dlData.downloads)) {
    return {
      name: packageName,
      found: true,
      created,
      version,
      totalDownloads: 0,
      lastYear: 0,
      lastMonth: 0,
      lastWeek: 0,
      lastDay: 0,
    };
  }

  const downloadsArray = dlData.downloads;

  return {
    name: packageName,
    found: true,
    created,
    version,
    totalDownloads: sumLastDays(downloadsArray, downloadsArray.length),
    lastYear: sumLastDays(downloadsArray, 365),
    lastMonth: sumLastDays(downloadsArray, 30),
    lastWeek: sumLastDays(downloadsArray, 7),
    lastDay: sumLastDays(downloadsArray, 1),
  };
}

async function run() {
  console.log("==========================================================================================");
  console.log("                        REACTBYTES NPM DOWNLOAD STATS CALCULATOR                          ");
  console.log("==========================================================================================");
  
  // 1. Get packages from ComponentDatabase
  const localPackages = new Set<string>();
  for (const comp of ComponentDatabase) {
    if (comp.npmPackageName && comp.npmPackageName.startsWith("@reactbytes/")) {
      localPackages.add(comp.npmPackageName);
    }
  }
  console.log(`[+] Found ${localPackages.size} packages in local ComponentDatabase.`);

  // 2. Query NPM registry search API for @reactbytes scope
  console.log("[*] Querying npm registry for @reactbytes scope packages...");
  const searchUrl = "https://registry.npmjs.org/-/v1/search?text=scope:reactbytes&size=250";
  const searchData = await fetchJsonWithRetry(searchUrl);
  
  const registryPackages = new Set<string>();
  if (searchData && searchData.objects) {
    for (const obj of searchData.objects) {
      if (obj.package && obj.package.name && obj.package.name.startsWith("@reactbytes/")) {
        registryPackages.add(obj.package.name);
      }
    }
  }
  console.log(`[+] Found ${registryPackages.size} packages on npm registry search.`);

  // Merge packages (union)
  const allPackages = Array.from(new Set([...localPackages, ...registryPackages])).sort();
  console.log(`[+] Total packages to process: ${allPackages.length}`);
  
  if (allPackages.length === 0) {
    console.log("[-] No packages found to query.");
    return;
  }

  console.log("\n[*] Fetching stats for each package (sequentially with rate-limit retries)...");
  
  const statsList = [];
  for (const pkg of allPackages) {
    try {
      const stats = await getPackageStats(pkg);
      statsList.push(stats);
      if (stats.found) {
        console.log(`  ✓ ${pkg} (${stats.version}) - Total: ${stats.totalDownloads}`);
      } else {
        console.log(`  ✗ ${pkg} (Not found on NPM registry)`);
      }
      // Be polite to the registry API and introduce a small delay
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (err: any) {
      console.error(`  ✗ Failed fetching stats for ${pkg}:`, err.message || err);
    }
  }

  // Summary calculation
  const foundStats = statsList.filter(s => s.found);
  const totalDownloadsSum = foundStats.reduce((sum, s) => sum + s.totalDownloads, 0);
  const totalLastYearSum = foundStats.reduce((sum, s) => sum + s.lastYear, 0);
  const totalLastMonthSum = foundStats.reduce((sum, s) => sum + s.lastMonth, 0);
  const totalLastWeekSum = foundStats.reduce((sum, s) => sum + s.lastWeek, 0);
  const totalLastDaySum = foundStats.reduce((sum, s) => sum + s.lastDay, 0);

  // Output stats table
  console.log("\n=============================================================================================================");
  console.log("                                          DETAILED PACKAGE STATS                                             ");
  console.log("=============================================================================================================");
  printRow("Package Name", "Version", "Created", "All-Time", "Last Year", "Last Month", "Last Week", "Last Day");
  console.log("-".repeat(116));
  
  for (const s of statsList) {
    if (!s.found) {
      printRow(s.name, "N/A", "N/A", "0", "0", "0", "0", "0");
    } else {
      printRow(
        s.name,
        s.version,
        s.created,
        s.totalDownloads.toLocaleString(),
        s.lastYear.toLocaleString(),
        s.lastMonth.toLocaleString(),
        s.lastWeek.toLocaleString(),
        s.lastDay.toLocaleString()
      );
    }
  }
  console.log("-".repeat(116));
  printRow(
    "TOTAL",
    "",
    "",
    totalDownloadsSum.toLocaleString(),
    totalLastYearSum.toLocaleString(),
    totalLastMonthSum.toLocaleString(),
    totalLastWeekSum.toLocaleString(),
    totalLastDaySum.toLocaleString()
  );
  console.log("=============================================================================================================");
}

run().catch(err => {
  console.error("Script failed:", err);
});
