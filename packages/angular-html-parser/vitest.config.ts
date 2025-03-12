import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      // "../compiler/test/ml_parser/*_spec.ts",
      "./test/*_spec.ts",
    ],
    coverage: {
      enabled: Boolean(process.env.CI),
      provider: "v8",
      reporter: ["lcov", "text"],
      include: ["src/**/*.ts"],
    },
  },
});
