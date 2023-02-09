/** @type {import("prettier").Config} */
const prettierConfig = {
  importOrder: ["^react", "^@", "^[^.]", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  pluginSearchDirs: false,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
};

module.exports = prettierConfig;
