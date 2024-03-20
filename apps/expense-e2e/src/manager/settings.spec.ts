import { test, expect } from "@playwright/test";
import { baseURL, managerFile } from "../../playwright.config";

const email = process.env.EMAIL!;

const settings = [
  {
    name: "MANAGER_EMAIL",
    value: email,
    des: "Manager email to receive expense email",
  },
  {
    name: "AUTO_APPROVAL_THRESHOLD",
    value: "2000000",
    des: "Expense will be auto approved if total value is lower than this threshold",
  },
  {
    name: "EMAIL_SUBJECT",
    value: "Attention required! A new expense needs your decision",
    des: "The subject of the email that send to the manager",
  },
];

const editValue = {
  email,
  threshold: "2300000",
  subject: "The subject of the email that send to the manager",
};

test.use({ storageState: managerFile });
test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await page.getByRole("link", { name: "Expense Settings" }).click();
  await expect(
    page.getByRole("heading", { name: "Application Settings" })
  ).toBeVisible();
});

test("create settings", async ({ page }) => {
  for (let i = 0; i < settings.length; i++) {
    const setting = settings[i];

    await page.getByRole("button", { name: "New setting" }).click();
    await page.getByPlaceholder("Enter Settings Name").click();
    await page.getByPlaceholder("Enter Settings Name").fill(setting.name);
    await page.getByPlaceholder("Enter Value").click();
    await page.getByPlaceholder("Enter Value").fill(setting.value);
    await page.getByPlaceholder("Enter Description").click();
    await page.getByPlaceholder("Enter Description").fill(setting.des);
    await page.getByRole("button", { name: "Submit" }).click();
    await expect(page.getByText("Record Created")).toBeVisible();
    await expect(page.getByText("Record Created")).toBeHidden();
    await page.getByRole("link", { name: "Expense Settings" }).click();
    await expect(
      page.getByRole("heading", { name: "Application Settings" })
    ).toBeVisible();
  }
});

test("edit settings", async ({ page }) => {
  await page.getByRole("button", { name: "Edit settings" }).click();
  await expect(page.getByText("Edit application settings")).toBeVisible();
  await page.getByLabel("Auto Approval Threshold *").click();
  await page.getByLabel("Auto Approval Threshold *").fill(editValue.threshold);
  await page.getByLabel("Email Subject *").click();
  await page.getByLabel("Email Subject *").fill(editValue.subject);
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
});
