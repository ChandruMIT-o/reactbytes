import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "framer-motion"],
  minify: true,
  sourcemap: true,
  treeshake: true,
  splitting: false,
});
