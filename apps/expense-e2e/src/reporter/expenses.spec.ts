import { test, expect, Page } from "@playwright/test";
import { baseURL, reporterFile } from "../../playwright.config";
import path from "path";

test.use({ storageState: reporterFile });

const below = 1500000;
const above = 3000000;

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await expect(
    page.getByRole("heading", { name: "Reporter View" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Draft Expenses" })
  ).toBeVisible();
});

// right away approved
test("new submitted expense below threshold", async ({ page }) =>
  createSubmitExpense({
    page,
    amount: below,
    output: "output: Account balance has been updated",
  }));

// queued for processing
test("new submitted expense over threshold", async ({ page }) =>
  createSubmitExpense({
    page,
    amount: above,
    output:
      "output: An email has been sent to the manager and your expense has been queued for processing",
  }));

test("new draft expense", createDraftExpense);

test.describe("tests need existed expense", () => {
  // follow advice that we'd make tests isolated
  test.beforeEach(async ({ page }) => createDraftExpense({ page }));

  test("edit draft expense with new image", async ({ page }) => {
    // easy tr first td last button :))
    await page
      .locator("tr", { hasText: "playwright" })
      .first()
      .locator("td")
      .last()
      .locator("button")
      .click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByText("edit Expense", { exact: true }).click();
    // further
    await page.getByLabel("Name *").click();
    await page.getByLabel("Name *").fill("playwright draft edited");
    await page.getByLabel("Description").click();
    await page.getByLabel("Description").fill("edited with new bill included");

    let [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.getByRole("button", { name: "Add file or drop here" }).click(),
    ]);

    await fileChooser.setFiles([
      path.join(__dirname, "../../public/test-img-edit.png"),
    ]);

    await expect(page.getByTestId("NButton")).toBeVisible();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page.getByText("output: Operation on draft expense successfully")
    ).toBeVisible();
  });

  test("submit draft expense", async ({ page }) => {
    await page
      .locator("tr", { hasText: "playwright" })
      .first()
      .locator("td")
      .last()
      .locator("button")
      .click();

    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByText("edit Expense", { exact: true }).click();
    await page.getByLabel("Status *").click();
    await page.getByText("Submitted", { exact: true }).click();

    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page.getByText(
        "output: An email has been sent to the manager and your expense has been queued for processing"
      )
    ).toBeVisible();
  });

  test("delete draft expense", async ({ page }) => {
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

//////////////////////////////////
async function createDraftExpense({ page }: { page: Page }) {
  await page.getByRole("button", { name: "Create new expense" }).click();
  await page.getByText("New expense", { exact: true }).click();
  await page.getByLabel("Account *").click();
  await expect(page.getByText("playwright").last()).toBeVisible();
  await page.getByText("playwright").last().click();
  await page.getByLabel("Category *").click();
  await expect(page.getByText("playwright cat").last()).toBeVisible();
  await page.getByText("playwright cat").last().click();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByLabel("Expense Details")).toBeVisible();
  await page.getByLabel("Name *").click();
  await page.getByLabel("Name *").fill("playwright draft");
  await page.getByLabel("Amount *").click();
  await page.getByLabel("Amount *").fill("2500000");
  await page.getByLabel("Status *").click();
  await page.getByRole("option", { name: "Draft" }).click();
  await page.getByLabel("Description").click();
  await page.getByLabel("Description").fill("none");

  let [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByRole("button", { name: "Add file or drop here" }).click(),
  ]);

  await fileChooser.setFiles([
    path.join(__dirname, "../../public/test-image.png"),
  ]);

  await expect(page.getByTestId("NButton")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(
    page.getByText("output: Operation on draft expense successfully")
  ).toBeVisible();
}

async function createSubmitExpense({
  page,
  amount,
  output,
}: {
  page: Page;
  amount: number;
  output: string;
}) {
  await page.getByRole("button", { name: "Create new expense" }).click();
  // first screen
  await page.getByText("New expense", { exact: true }).click();
  await page.getByLabel("Account *").click();
  await expect(page.getByText("playwright").last()).toBeVisible();
  await page.getByText("playwright").last().click();
  await page.getByLabel("Category *").click();
  await expect(page.getByText("playwright cat").last()).toBeVisible();
  await page.getByText("playwright cat").last().click();
  await page.getByRole("button", { name: "Next" }).click();

  // second screen
  await expect(page.getByLabel("Expense Details")).toBeVisible();
  await page.getByLabel("Name *").click();
  await page.getByLabel("Name *").fill("playwright auto approved");
  await page.getByLabel("Amount *").click();
  await page.getByLabel("Amount *").fill(amount.toString());
  await page.getByLabel("Status *").click();
  await page.getByRole("option", { name: "Submitted" }).click();
  await page.getByLabel("Description").click();
  await page.getByLabel("Description").fill("none");

  let [fileChooser] = await Promise.all([
    page.waitForEvent("filechooser"),
    page.getByRole("button", { name: "Add file or drop here" }).click(),
  ]);

  await fileChooser.setFiles([
    path.join(__dirname, "../../public/test-image.png"),
  ]);

  await expect(page.getByTestId("NButton")).toBeVisible();
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText(output)).toBeVisible();
}
