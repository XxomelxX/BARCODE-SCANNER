module.exports = [
  {
    ignores: ["node_modules/**"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        module: "readonly",
        require: "readonly",
        process: "readonly",
        console: "readonly",
        globalThis: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { "args": "none", "ignoreRestSiblings": true }],
      "no-console": "off"
    }
  }
];
