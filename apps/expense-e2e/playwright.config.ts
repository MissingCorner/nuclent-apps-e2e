import { nxE2EPreset } from "@nx/playwright/preset";
import { defineConfig, devices } from "@playwright/test";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { workspaceRoot } from "@nx/devkit";
import path from "path";
require("dotenv").config({ path: ".env.local" });

// storage files
export const managerFile = path.join(__dirname, "./.auth/manager.json");
export const reporterFile = path.join(__dirname, "./.auth/user.json");
export const rootFile = path.join(__dirname, "./.auth/root.json");

// For CI, you may want to set BASE_URL to the deployed application.
export const baseURL = process.env.BASE_URL!;
// process.env.BASE_URL || `http://localhost:${process.env["PORT"] ?? 3001}`;
export const nxDefaultConf = nxE2EPreset(__filename, { testDir: "./src" });

/**
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxDefaultConf,
  // TODO: test with more browser later
  workers: 1,
  projects: [
    { name: "adminLogin", testMatch: "adminLogin.setup.ts" },
    {
      name: "import",
      testMatch: "import.setup.ts",
      dependencies: ["adminLogin"],
    },
    { name: "roles", testMatch: "setRoles.setup.ts", dependencies: ["import"] },
    { name: "login", testMatch: "login.setup.ts", dependencies: ["roles"] },
    // { name: "login", testMatch: "login.setup.ts" },
    {
      name: "settings",
      dependencies: ["login"],
      testMatch: "settings.spec.ts",
    },
    {
      name: "accounts",
      dependencies: ["settings"],
      testMatch: "accounts.spec.ts",
    },
    {
      name: "categories",
      dependencies: ["accounts"],
      testMatch: "categories.spec.ts",
    },
    {
      name: "reporter",
      dependencies: ["categories"],
      // dependencies: ["login"],
      testDir: "./src/reporter",
      testMatch: "**/*.spec.ts",
    },
    {
      name: "manager",
      testDir: "./src/manager",
      testMatch: "expenses.spec.ts",
      dependencies: ["reporter"],
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  timeout: 120000,
  expect: {
    timeout: 15000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
});
