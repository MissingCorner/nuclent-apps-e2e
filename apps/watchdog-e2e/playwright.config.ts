import { nxE2EPreset } from '@nx/playwright/preset'
import { defineConfig } from '@playwright/test'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { workspaceRoot } from '@nx/devkit'

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || `http://localhost:${process.env['PORT'] ?? 3001}`
const nxDefaultConf = nxE2EPreset(__filename, { testDir: './src' })

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  ...nxDefaultConf,
  // TODO: test with more browser later
  projects: nxDefaultConf.projects?.filter(i => i.name === 'chromium'),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
})
