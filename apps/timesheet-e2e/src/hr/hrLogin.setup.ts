import { test as setup, expect } from '@playwright/test';
import dotenv from "dotenv";
import { STORAGE_STATE} from '../../playwright.config';
dotenv.config();
import { promises as fs } from 'fs';


    // Call the function with the path to your JSON file
setup('login', async ({ page }) => {
    await page.goto(process.env.BASE_URL ?? "");
    await page.getByLabel('Username or email').click();
    await page.getByLabel('Username or email').fill('u0');
    await page.getByLabel('Password').click();
    await page.getByLabel('Password').fill('password');
    await page.getByLabel('Password').press('Enter');
    await expect(page.getByRole('heading', { name: 'HR Timesheet' })).toBeVisible();
    await page.context().storageState({ path: STORAGE_STATE });
});