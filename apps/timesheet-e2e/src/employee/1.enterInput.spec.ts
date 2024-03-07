import { test, expect } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

test.beforeEach(async({page})=>{
    await page.goto(process.env.BASE_URL ?? "");
    await expect(page.getByRole('heading', { name: 'Employee View' })).toBeVisible();
})

test('invalidInput1', async ({ page }) => {  //Monday hours: 0, leave type: None, leave reason: empty => invalid
    await page
    .locator('tr')
    .filter({ hasText: 'Require input' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Enter input' }).click();
    await page.getByLabel('Mon *').click();
    await page.getByLabel('Mon *').fill('0');
    await page.getByLabel('Tue *').click();
    await page.getByLabel('Tue *').fill('0');
    // Change the hours field on Wednesday
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .click();
    // Fill the hours field on Wednesday with 3
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .fill('3');
    // Change the hours field on Thursday
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .click();
    // Fill the hours field on Thursday with 4
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .fill('4');
    // Change the hours field on Friday
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .click();
    // Fill the hours field on Friday with 5
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .fill('5');
    
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Invalid type.').first()).toBeVisible();
    await expect(page.getByText('Please fill in reason').first()).toBeVisible();
});

test('invalidInput2', async ({ page }) => { // Tuesday hours: 2, leave type: Holiday, leave reason: Tet => invalid type and invalid input
    await page
    .locator('tr')
    .filter({ hasText: 'Require input' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Enter input' }).click();
    await page.getByLabel('Mon *').click();
    await page.getByLabel('Mon *').fill('1');
    await page.getByLabel('Tue *').click();
    await page.getByLabel('Tue *').fill('2');
    // start to select the absent type on tuesday
    await page
    .locator('input.mantine-Select-input')
    .nth(1)
    .click();
    // select option
    const tuesdayHolidayItem = await page.evaluateHandle(() => {
        return document.querySelector('div.mantine-Select-item:nth-of-type(2)')
    })
    await tuesdayHolidayItem.asElement()?.click();
    // start to select the absent type on monday
    await page
    .locator('input.mantine-Select-input')
    .nth(0)
    .click();
    // select option
    const mondayHolidayItem = await page.evaluateHandle(() => {
        return document.querySelector('div.mantine-Select-item:nth-of-type(2)')
    })
    await mondayHolidayItem.asElement()?.click();
    // Change reason in Tuesday
    await page
    .locator(`[name='weeklyTimeSheet.tueReason']`)
    .click();
    await page
    .locator(`[name='weeklyTimeSheet.tueReason']`)
    .fill('Tet');
    // Change the hours field on Wednesday
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .click();
    // Fill the hours field on Wednesday with 3
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .fill('3');
    // Change the hours field on Thursday
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .click();
    // Fill the hours field on Thursday with 4
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .fill('4');
    // Change the hours field on Friday
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .click();
    // Fill the hours field on Friday with 5
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .fill('5');
    
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Invalid type.').first()).toBeVisible();
    await expect(page.getByText('Invalid input').first()).toBeVisible();
});

test('invalidInput3', async ({ page }) => { // Monday hours: 0, leave type: Half-paid, leave reason: Sick => invalid type
    await page
    .locator('tr')
    .filter({ hasText: 'Require input' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Enter input' }).click();
    await page.getByLabel('Mon *').click();
    await page.getByLabel('Mon *').fill('0');
    await page.getByLabel('Tue *').click();
    await page.getByLabel('Tue *').fill('2');
    // start to select the absent type on monday
    await page
    .locator('input.mantine-Select-input')
    .nth(0)
    .click();
    // select option
    const mondayHalfPaidItem = await page.evaluateHandle(() => {
        return document.querySelector('div.mantine-Select-item:nth-of-type(1)')
    })
    await mondayHalfPaidItem.asElement()?.click();
    // Change reason on Monday
    await page
    .locator(`[name='weeklyTimeSheet.monReason']`)
    .click();
    await page
    .locator(`[name='weeklyTimeSheet.monReason']`)
    .fill('Sick');
    // Change the hours field on Wednesday
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .click();
    // Fill the hours field on Wednesday with 3
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .fill('3');
    // Change the hours field on Thursday
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .click();
    // Fill the hours field on Thursday with 4
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .fill('4');
    // Change the hours field on Friday
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .click();
    // Fill the hours field on Friday with 5
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .fill('5');
    
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Invalid type.').first()).toBeVisible();
});

test('enterInputWithValidStatus', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Require input' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Enter input' }).click();
    await page.getByLabel('Tue *').click();
    await page.getByLabel('Tue *').fill('0');
    // start to select the absent type on tuesday
    await page
    .locator('input.mantine-Select-input')
    .nth(1)
    .click();
    // select option
    const tuesdayHolidayItem = await page.evaluateHandle(() => {
        return document.querySelector('div.mantine-Select-item:nth-of-type(2)')
    })
    await tuesdayHolidayItem.asElement()?.click();
    // await page.getByRole('option', { name: 'Holiday' }).click(); //Holiday
    // start to select the absent type on monday
    await page
    .locator('input.mantine-Select-input')
    .nth(0)
    .click();
    // select option
    const mondayHolidayItem = await page.evaluateHandle(() => {
        return document.querySelector('div.mantine-Select-item:nth-of-type(2)')
    })
    await mondayHolidayItem.asElement()?.click();
    //Change reason in Monday
    await page
    .locator(`[name='weeklyTimeSheet.monReason']`)
    .nth(0)
    .click();
    await page
    .locator(`[name='weeklyTimeSheet.monReason']`)
    .fill('Tet');
    // Change reason in Tuesday
    await page
    .locator(`[name='weeklyTimeSheet.tueReason']`)
    .click();
    await page
    .locator(`[name='weeklyTimeSheet.tueReason']`)
    .fill('Tet');
    // Change the hours field on Wednesday
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .click();
    // Fill the hours field on Wednesday with 4
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .fill('4');
    await page
    .locator(`[name='weeklyTimeSheet.wedOT']`)
    .click()
    await page
    .locator(`[name='weeklyTimeSheet.wedOT']`)
    .fill('2');
    // Change the hours field on Thursday
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .click();
    // Fill the hours field on Thursday with 5
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .fill('5');
    await page
    .locator(`[name='weeklyTimeSheet.thurOT']`)
    .click()
    await page
    .locator(`[name='weeklyTimeSheet.thurOT']`)
    .fill('3');
    // Change the hours field on Friday
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .click();
    // Fill the hours field on Friday with 5
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .fill('6');
    await page
    .locator(`[name='weeklyTimeSheet.friOT']`)
    .click()
    await page
    .locator(`[name='weeklyTimeSheet.friOT']`)
    .fill('3');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Output result: success')).toBeVisible();
});

test('enterInputWithRequireChangeStatus', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Require change' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Enter input' }).click();
    await page.getByLabel('Mon *').click();
    await page.getByLabel('Mon *').fill('0');
    await page.getByLabel('Tue *').click();
    await page.getByLabel('Tue *').fill('0');
    // start to select the absent type on tuesday
    await page
    .locator('input.mantine-Select-input')
    .nth(1)
    .click();
    // select option
    const tuesdayHolidayItem = await page.evaluateHandle(() => {
        return document.querySelector('div.mantine-Select-item:nth-of-type(4)')
    })
    await tuesdayHolidayItem.asElement()?.click();
    // start to select the absent type on monday
    await page
    .locator('input.mantine-Select-input')
    .nth(0)
    .click();
    // select option
    const mondayHolidayItem = await page.evaluateHandle(() => {
        return document.querySelector('div.mantine-Select-item:nth-of-type(5)')
    })
    await mondayHolidayItem.asElement()?.click();
    //Change reason in Monday
    await page
    .locator(`[name='weeklyTimeSheet.monReason']`)
    .nth(0)
    .click();
    await page
    .locator(`[name='weeklyTimeSheet.monReason']`)
    .fill('Tet');
    // Change reason in Tuesday
    await page
    .locator(`[name='weeklyTimeSheet.tueReason']`)
    .click();
    await page
    .locator(`[name='weeklyTimeSheet.tueReason']`)
    .fill('Tet');
    // Change the hours field on Wednesday
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .click();
    // Fill the hours field on Wednesday with 4
    await page
    .locator(`[name='weeklyTimeSheet.wed']`)
    .fill('8');
    await page
    .locator(`[name='weeklyTimeSheet.wedOT']`)
    .click()
    await page
    .locator(`[name='weeklyTimeSheet.wedOT']`)
    .fill('2');
    // Change the hours field on Thursday
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .click();
    // Fill the hours field on Thursday with 5
    await page
    .locator(`[name='weeklyTimeSheet.thur']`)
    .fill('8');
    await page
    .locator(`[name='weeklyTimeSheet.thurOT']`)
    .click()
    await page
    .locator(`[name='weeklyTimeSheet.thurOT']`)
    .fill('3');
    // Change the hours field on Friday
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .click();
    // Fill the hours field on Friday with 5
    await page
    .locator(`[name='weeklyTimeSheet.fri']`)
    .fill('6');
    await page
    .locator(`[name='weeklyTimeSheet.friOT']`)
    .click()
    await page
    .locator(`[name='weeklyTimeSheet.friOT']`)
    .fill('3');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByText('Output result: success')).toBeVisible();
});

test('enterInputWithReviewingStatus', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Reviewing' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Enter input' }).click();
    await expect(page.getByText('Output result: Can not enter input now')).toBeVisible();
});

test('enterInputWithApprovedStatus', async ({ page }) => {
    await page
    .locator('tr')
    .filter({ hasText: 'Approved' })
    .nth(0)
    .getByRole('button')
    .click();
    await page.getByRole('menuitem', { name: 'Enter input' }).click();
    await expect(page.getByText('Output result: Can not enter input now')).toBeVisible();
});


