// @ts-check
import antfu from "@antfu/eslint-config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  antfu({
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    formatters: true,
    typescript: true,
    vue: true,
  }),
  {
    rules: {
      "vue/comma-dangle": ["error", "only-multiline"],
      "style/comma-dangle": ["error", "only-multiline"],
      "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ],
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          "alphabetize": {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  eslintPluginPrettierRecommended
);
