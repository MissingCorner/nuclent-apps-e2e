import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

test.beforeEach(async({page})=>{
    await page.goto(process.env.BASE_URL ?? "");
    await expect(page.getByRole('heading', { name: 'HR Timesheet' })).toBeVisible();
})

test('createReport', async ({ page }) => {
  await page.getByRole('link', { name: 'Monthly Report' }).click();
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await page.getByPlaceholder('mm/yyyy').click();
  await page.getByPlaceholder('mm/yyyy').fill('01/2024');
  await page.getByLabel('Number of work days: *').click();
  await page.getByLabel('Number of work days: *').fill('15');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText('Output result: success')).toBeVisible();
});