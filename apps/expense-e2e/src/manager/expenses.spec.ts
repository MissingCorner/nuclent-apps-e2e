import { test, expect } from "@playwright/test";
import { baseURL, managerFile } from "../../playwright.config";

test.use({ storageState: managerFile });

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await page.getByRole("link", { name: "Processing Expenses" }).click();
});

test("edit submitted", async ({ page }) => {
  await page
    .locator("tr", { hasText: "playwright" })
    .first()
    .locator("td")
    .last()
    .locator("button")
    .click();
  await page.getByRole("menuitem", { name: "Edit" }).click();

  await expect(page.getByText("edit Expense")).toBeVisible();
  await page.getByLabel("Edit Reason").click();
  await page
    .getByLabel("Edit Reason")
    .fill("playwright edit submitted expense");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("output: An email has been").click();
});

// Processing Expenses
test("approve expense", async ({ page }) => {
  await page
    .locator("tr", { hasText: "playwright" })
    .first()
    .locator("td")
    .last()
    .locator("button")
    .click();
  await page.getByRole("menuitem", { name: "Process" }).click();
  await page.getByLabel("Approved").check();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("output: Expense processed").click();
});

test("reject expense", async ({ page }) => {
  await page
    .locator("tr", { hasText: "playwright" })
    .first()
    .locator("td")
    .last()
    .locator("button")
    .click();
  await page.getByRole("menuitem", { name: "Process" }).click();
  await page.getByLabel("Rejected").check();
  await page.getByLabel("Reject reason").click();
  await page
    .getByLabel("Reject reason")
    .fill("example-reject long enough for validation");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("output: Expense processed").click();
});

// operation from record details
