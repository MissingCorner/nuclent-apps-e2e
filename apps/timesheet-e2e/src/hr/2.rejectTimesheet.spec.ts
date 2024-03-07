import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

test.beforeEach(async({page})=>{
    await page.goto(process.env.BASE_URL ?? "");
    await expect(page.getByRole('heading', { name: 'HR Timesheet' })).toBeVisible();
})

test('rejectTimesheetWithoutReason', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Reviewing' })
    .nth(0)
    .click();
    await page.getByRole('button', { name: 'Reject' }).click();
    await page.getByLabel('Require change reason *').click();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Required!')).toBeVisible();
});

test('rejectThroughListEmployee', async ({ page }) => {
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
    await page.getByRole('button', { name: 'Reject' }).click();
    await page.getByLabel('Require change reason *').click();
    await page.getByLabel('Require change reason *').fill('Not true');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Require change')).toBeVisible();
    await expect(page.getByText('Not true')).toBeVisible();
});

test('rejectTimesheet', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Reviewing' })
    .nth(0)
    .click();
    await page.getByRole('button', { name: 'Reject' }).click();
    await page.getByLabel('Require change reason *').click();
    await page.getByLabel('Require change reason *').fill('Not true');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Require change')).toBeVisible();
    await expect(page.getByText('Not true')).toBeVisible();
});
