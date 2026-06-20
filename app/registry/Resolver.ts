import { ComponentDatabase, ComponentConfig } from "./ComponentDatabase";

/**
 * Shared utility to search the registry database for a component by slug or name.
 */
export function resolveComponent(query: string): ComponentConfig | undefined {
  if (!query) return undefined;
  const normalizedQuery = query.toLowerCase().trim();
  return ComponentDatabase.find(
    (c) =>
      c.slug.toLowerCase() === normalizedQuery ||
      c.name.toLowerCase() === normalizedQuery
  );
}
