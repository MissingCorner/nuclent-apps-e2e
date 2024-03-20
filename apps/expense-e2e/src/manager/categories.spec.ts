import { test, expect, Page } from "@playwright/test";
require("dotenv").config({ path: ".env.local" });
import { baseURL, managerFile } from "../../playwright.config";

test.use({ storageState: managerFile });

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

// cat names
const cat = "playwright cat";
const catEdited = "playwright cat edited";

test("new category without parent", createCategory);

test.describe("need existed category", () => {
  test.beforeEach(async ({ page }) => await createCategory({ page }));

  test("new category with parent", async ({ page }) => {
    await page.getByRole("button", { name: "Create new category" }).click();
    await page.getByLabel("Category name *").fill(cat);
    await page.getByLabel("Expense limit *").click();
    await page.getByLabel("Expense limit *").fill("2000000");
    await page.getByLabel("Status *").click();
    await page.getByText("Active", { exact: true }).last().click();

    await page.getByLabel("Parent Category").click();
    await page.getByText(cat, { exact: true }).last().click();

    await page.getByPlaceholder("In what stituation we will").click();
    await page
      .getByPlaceholder("In what stituation we will")
      .fill("test description");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("output: New category created")).toBeVisible();
  });

  test("edit category", async ({ page }) => {
    await expect(
      page.locator(
        "div:nth-child(3) > div > div:nth-child(3) > div > .mantine-LoadingOverlay-root > .mantine-Overlay-root"
      )
    ).toBeHidden();
    await page
      .locator("tr", { hasText: cat })
      .last()
      .locator("td")
      .last()
      .locator("button")
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByLabel("Category Name *").fill(catEdited);
    await page.getByLabel("Description").click();
    await page.getByLabel("Description").fill("test description edited");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("output: Category edited")).toBeVisible();
  });

  test("delete category", async ({ page }) => {
    await expect(
      page.locator(
        "div:nth-child(3) > div > div:nth-child(3) > div > .mantine-LoadingOverlay-root > .mantine-Overlay-root"
      )
    ).toBeHidden();
    await page
      .locator("tr", { hasText: cat })
      .last()
      .locator("td")
      .last()
      .locator("button")
      .click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
  });
});

/////////////////////////////
async function createCategory({ page }: { page: Page }) {
  await page.getByRole("button", { name: "Create new category" }).click();
  await page.getByLabel("Category name *").fill(cat);
  await page.getByLabel("Expense limit *").click();
  await page.getByLabel("Expense limit *").fill("2000000");
  await page.getByLabel("Status *").click();
  await page.getByText("Active", { exact: true }).last().click();

  await page.getByPlaceholder("In what stituation we will").click();
  await page
    .getByPlaceholder("In what stituation we will")
    .fill("test description");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("output: New category created")).toBeVisible();
}
