import { defineConfig } from "bunup";

export default defineConfig({
	entry: "src/index.tsx",
	format: ["esm", "cjs"],
	target: "browser",
	outDir: "dist",
	clean: true,
	minify: true,
	dts: { inferTypes: true },
	external: ["react"],
});
