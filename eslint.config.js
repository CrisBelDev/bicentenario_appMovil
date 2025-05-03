const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = defineConfig([
	expoConfig,
	{
		ignores: ["dist/*"],
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			"prettier/prettier": "warn", // o "error" si prefieres
		},
	},
]);
