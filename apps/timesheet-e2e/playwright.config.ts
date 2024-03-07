import { nxE2EPreset } from '@nx/playwright/preset'
import { defineConfig, devices } from '@playwright/test'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { workspaceRoot } from '@nx/devkit'
import * as path from 'path';

import dotenv from "dotenv";
dotenv.config();
// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env['BASE_URL'] || `http://localhost:${process.env['PORT'] ?? 3001}`
const nxDefaultConf = nxE2EPreset(__filename, { testDir: './src' })

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
//require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');
export const timesheetPath = path.join(__dirname, 'src/utilities/TimesheetV6.txt');
export const weeklyTimesheetRecords = path.join(__dirname, 'src/utilities/weeklyTimesheetV1.csv');
export const dailyTimesheetRecords = path.join(__dirname, 'src/utilities/dailyTimesheet.csv');
export default defineConfig({
  ...nxDefaultConf,
  // TODO: test with more browser later
  //projects: nxDefaultConf.projects?.filter(i => i.name === 'chromium'),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
  },
  // Opt out of parallel tests on CI.
  workers: 3,
  
  timeout: 60000,
  expect: {
    timeout: 15000
  },
  projects: [
    {
      name: 'rootLogin',
      testMatch: 'setupData/rootLogin.setup.ts',
    },
    {
      name: 'importFlow',
      testMatch: 'setupData/importFlow.setup.ts',
      dependencies: ['rootLogin'],
    },
    {
      name: 'addRoles',
      testMatch: 'setupData/addRoles.setup.ts',
      dependencies: ['rootLogin'],
    },
    {
      name: 'editUserRoles',
      testMatch: 'setupData/editUserRoles.setup.ts',
      dependencies: ['addRoles'], 
    },
    {
      name: 'importWeeklyTimesheetRecords',
      testMatch: 'setupData/importWeeklyTimesheet.setup.ts',
      dependencies: ['editUserRoles'],
    },
    {
      name: 'importDailyTimesheetRecords',
      testMatch: 'setupData/importDailyTimesheet.setup.ts',
      dependencies: ['importWeeklyTimesheetRecords'],
    },
    {
      name: 'empLogin',
      testMatch: 'employee/*.setup.ts',
      dependencies: [`importDailyTimesheetRecords`],
    },
    {
      name: 'enterInput',
      testMatch: 'employee/*.spec.ts',
      dependencies: ['empLogin'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      
    },
    {
      name: 'hrLogin',
      testMatch: 'hr/*.setup.ts',
      dependencies: ['enterInput']
    },
    {
      name: 'hrAction',
      testMatch: 'hr/*.spec.ts',
      dependencies: ['hrLogin'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
    },
  ],
})
