import type { UserConfig } from "@commitlint/types";
import { RuleConfigSeverity } from "@commitlint/types";

const config: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"type-enum": [
			RuleConfigSeverity.Error,
			"always",
			["feat", "fix", "docs", "refactor", "perf", "test", "build", "ci", "chore", "revert"],
		],
		"subject-case": [
			RuleConfigSeverity.Error,
			"never",
			["start-case", "pascal-case", "upper-case"],
		],
		"body-max-line-length": [RuleConfigSeverity.Warning, "always", 100],
	},
};

export default config;
