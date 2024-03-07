import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

test.beforeEach(async({page})=>{
    await page.goto(process.env.BASE_URL ?? "");
    await expect(page.getByRole('heading', { name: 'HR Timesheet' })).toBeVisible();
})

test('sendEmailFail', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Approved' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Send Email' }).click();
    await expect(page.getByText('Output result: Cannot send')).toBeVisible();
});

test('sendEmailSuccess', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Require change' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Send Email' }).click();
    await expect(page.getByText('Output result: success')).toBeVisible();
});