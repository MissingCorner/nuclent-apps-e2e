import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

test.beforeEach(async({page})=>{
  await page.goto(process.env.BASE_URL ?? "");
  await expect(page.getByRole('heading', { name: 'HR Timesheet' })).toBeVisible();
})

test('approveThroughListEmployee', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'HR Timesheet' })).toBeVisible();
    await page.getByRole('link', { name: 'List Employee' }).click();
    //select the first user has role employee in list employee
    await page
    .locator('tr')
    .nth(2)
    .click();
    // await page
    // .locator('tr')
    // .filter({ hasText: 'Reviewing' })
    // .nth(1)
    // .click();
    await page.getByRole('cell', { name: 'Reviewing' }).locator('div').first().click();
    await page.getByRole('button', { name: 'Approve' }).click();
    await expect(page.getByText('Result: success')).toBeVisible();
});

test('approveDirectly', async ({ page }) => {
  await page
    .locator('tr')
    .filter({ hasText: 'Reviewing' })
    .nth(0)
    .click();
  await expect(page.getByRole('heading', { name: 'Weekly timesheet' })).toBeVisible();
  await page.getByRole('button', { name: 'Approve' }).click();
  await expect(page.getByText('Result: success')).toBeVisible();
});