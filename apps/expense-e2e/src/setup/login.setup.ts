require("dotenv").config({ path: ".env.local" });
import { test as setup, expect } from "@playwright/test";
import { baseURL, managerFile, reporterFile } from "../../playwright.config";

// manager
const mName = process.env.MNAME!;
const mPass = process.env.MPASS!;

// reporter
const rName = process.env.RNAME!;
const rPass = process.env.RPASS!;

setup("authenticate as manager", async ({ page }) => {
  await page.goto(baseURL);
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(mName);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(mPass);
  await page.getByRole("button", { name: "Sign In" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(baseURL);
  // Alternatively, you can wait until the page reaches a state where all cookies are set.

  await expect(
    page.getByRole("heading", { name: "Expense Management" })
  ).toBeVisible();

  // End of authentication steps.
  await page.context().storageState({ path: managerFile });
});

setup("authenticate as reporter", async ({ page }) => {
  await page.goto(baseURL);
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(rName);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(rPass);
  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(
    page.getByRole("heading", { name: "Reporter View" })
  ).toBeVisible();

  await page.context().storageState({ path: reporterFile });
});
