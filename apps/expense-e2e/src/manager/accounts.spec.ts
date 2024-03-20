import { test, expect, Page } from "@playwright/test";
import { baseURL, managerFile } from "../../playwright.config";

test.use({ storageState: managerFile });

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await page.locator("a").filter({ hasText: "Deposit" }).click();
  await expect(
    page.getByRole("heading", { name: "Account Balance" })
  ).toBeVisible();
});

test("create new account", createAccount);

test.describe("need existed account", () => {
  test.beforeEach(async ({ page }) => await createAccount({ page }));

  test("edit account", async ({ page }) => {
    await page
      .locator("tr", { hasText: "playwright" })
      .first()
      .locator("td")
      .last()
      .locator("button")
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await expect(page.getByText("Edit Account Information")).toBeVisible();
    await page.getByLabel("Name *").fill("playwright edited");
    await page.getByLabel("Description").click();
    await page.getByLabel("Description").fill("example-description");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("output: Updated Account")).toBeVisible();
  });

  test("deposit into account", async ({ page }) => {
    await page
      .locator("tr", { hasText: "playwright" })
      .first()
      .locator("td")
      .nth(-1) // === last()
      .locator("button")
      .click();
    await expect(page.getByRole("menuitem", { name: "Deposit" })).toBeVisible();
    await page.getByRole("menuitem", { name: "Deposit" }).click();
    // wait for modal
    await expect(page.getByText("New Deposit Information")).toBeVisible();

    await page.getByLabel("Deposit Name *").fill("name-example");
    await page.getByLabel("Cash Amount *").click();
    await page.getByLabel("Cash Amount *").fill("1000");
    await page.getByLabel("Description").click();
    await page.getByLabel("Description").fill("example-description");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("output: Deposited")).toBeVisible();
  });

  test("delete account", async ({ page }) => {
    await page
      .locator("tr", { hasText: "playwright" })
      .first()
      .locator("td")
      .last()
      .locator("button")
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
  });
});

///////////////////////////////////
async function createAccount({ page }: { page: Page }) {
  await page.getByRole("button", { name: "New account" }).click();
  await expect(page.getByText("New Account", { exact: true })).toBeVisible();
  await page.getByLabel("Name *").click();
  await page.getByLabel("Name *").fill("playwright");
  await page.getByLabel("Name *").press("Tab");
  await page.getByLabel("Cash Balance *").fill("5000000");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByText("output: Created new account").click();
}
