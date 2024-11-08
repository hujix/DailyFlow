// @ts-check
import antfu from "@antfu/eslint-config";

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
      "vue/operator-linebreak": ["error", "after"],
      "style/comma-dangle": ["error", "only-multiline"],
      "style/brace-style": ["error", "1tbs", { allowSingleLine: false }],
      "style/arrow-parens": ["error", "always"],
      "style/operator-linebreak": ["error", "after"],
      "vue/singleline-html-element-content-newline": [
        "error",
        {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: ["pre", "textarea", "template"],
          externalIgnores: [],
        },
      ],
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
  }
);
