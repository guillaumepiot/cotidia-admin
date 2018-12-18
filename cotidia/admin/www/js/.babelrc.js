module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          browsers: ["last 2 versions", "ie >= 10"],
        },
        useBuiltIns: "usage",
      },
    ],
    [
      "@babel/react",
      {
        development: process.env.BABEL_ENV === "development",
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-export-default-from",
    ["@babel/plugin-proposal-optional-chaining", { loose: true }],
    ["@babel/plugin-proposal-pipeline-operator", { proposal: "minimal" }],
    ["@babel/plugin-proposal-nullish-coalescing-operator", { loose: true }],
    "@babel/plugin-proposal-do-expressions",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    ["@babel/plugin-proposal-class-properties", { loose: false }],
  ],
}
