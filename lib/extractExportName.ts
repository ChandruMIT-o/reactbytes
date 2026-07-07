export function extractExportName(code: string, fallback: string): string {
  // Prefer `export default function X` or `export default X`
  const defaultFn = code.match(/export\s+default\s+function\s+([A-Z]\w*)/);
  if (defaultFn) return defaultFn[1];

  const defaultConst = code.match(/export\s+default\s+([A-Z]\w*)\s*;/);
  if (defaultConst) return defaultConst[1];

  // Fallback: named export, e.g. `export const CellularAutomataBackground`
  const namedConst = code.match(/export\s+const\s+([A-Z]\w*)/);
  if (namedConst) return namedConst[1];

  const namedFn = code.match(/export\s+function\s+([A-Z]\w*)/);
  if (namedFn) return namedFn[1];

  // Last resort: whatever we were going to use before
  return fallback;
}
