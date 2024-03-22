import { test, expect, Page } from "@playwright/test";
import { baseURL, managerFile } from "../../playwright.config";

interface ActionProps {
  page: Page;
  // amount
  amount: number;
  amountDes: string;
  // email
  email: string;
  emailDes: string;
  // subject
  subject: string;
  subjectDes: string;
  output: string;
  heading: string;
}

const email = process.env.EMAIL!;
const subEmail = process.env.SUB_EMAIL!;

const initValue = {
  amount: 2000000,
  amountDes:
    "Expense will be auto approved if total value is lower than this threshold",
  email: subEmail,
  emailDes:
    "Sending email to this email whenever a new expense needs to be processed",
  subject: "Attention required! A new expense needs your decision",
  subjectDes: "The subject of the email that send to the manager",
  output: "output: Your application settings have been saved successfully",
  heading: "Create App Settings",
};

const editValue = {
  amount: 2300000,
  amountDes: "Expense will be auto approved if lower than threshold, edited",
  email,
  emailDes: "Sending email to manager email blabla, edited",
  subject: "New Expense Created - Requesting Your Kind Approval",
  subjectDes: "The subject of the email, edited",
  output: "output: Your application settings have been updated successfully",
  heading: "Editing App Settings",
};

test.use({ storageState: managerFile });

test.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
  await page.getByRole("link", { name: "Expense Settings" }).click();
  await expect(
    page.getByRole("heading", { name: "Application Settings" })
  ).toBeVisible();
});

test("create app settings", async ({ page }) => action({ page, ...initValue }));

test("edit settings", async ({ page }) => action({ page, ...editValue }));

async function action({
  page,
  amount,
  email,
  subject,
  amountDes,
  emailDes,
  subjectDes,
  output,
  heading,
}: ActionProps) {
  await page.getByRole("button", { name: "Add / Edit settings" }).click();
  await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  // amount - tab 1
  await page.getByLabel("Amount *").click();
  await page.getByLabel("Amount *").fill(amount.toString());
  await page
    .getByLabel("Auto approval threshold")
    .getByLabel("Description")
    .click();
  await page
    .getByLabel("Auto approval threshold")
    .getByLabel("Description")
    .fill(amountDes);
  // tab 2
  await page.getByRole("tab", { name: "Manager email" }).click();
  await page.getByLabel("Email *").click();
  await page.getByText(email).click();
  await page.getByLabel("Manager email").getByLabel("Description").click();
  await page
    .getByLabel("Manager email")
    .getByLabel("Description")
    .fill(emailDes);
  // tab 3
  await page.getByRole("tab", { name: "Email subject" }).click();
  await page.getByLabel("Value *").click();
  await page.getByLabel("Value *").fill(subject);
  await page.getByLabel("Email subject").getByLabel("Description").click();
  await page
    .getByLabel("Email subject")
    .getByLabel("Description")
    .fill(subjectDes);

  // next and expect
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText(output)).toBeVisible();
}
