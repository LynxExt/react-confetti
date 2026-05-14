import type { KnipConfig } from "knip";

const config: KnipConfig = {
	entry: ["src/**/*.{ts,tsx,mdx}", "example/server.ts", "example/frontend.tsx"],
	project: ["src/**/*.{ts,tsx}!", "example/**/*.{ts,tsx}"],
	commitlint: {
		config: [".config/commitlint.config.ts"],
	},
	ignoreDependencies: ["@commitlint/cli"],
	tags: ["-knipignore"],
	rules: {
		files: "error",
		exports: "error",
		types: "error",
		duplicates: "error",
		unlisted: "warn",
		enumMembers: "warn",
		dependencies: "warn",
		binaries: "off",
	},
};

export default config;
