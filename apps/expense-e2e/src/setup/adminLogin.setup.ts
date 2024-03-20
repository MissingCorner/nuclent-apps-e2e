require("dotenv").config({ path: ".env.local" });
import { test as setup, expect } from "@playwright/test";
import { baseURL, rootFile } from "../../playwright.config";

const name = process.env.NAME!;
const pass = process.env.PASS!;

// sign in as root
setup("authenticate as root", async ({ page }) => {
  await page.goto(baseURL);
  await page.getByLabel("Username").click();
  await page.getByLabel("Username").fill(name);
  await page.getByLabel("Password").click();
  await page.getByLabel("Password").fill(pass);
  await page.getByRole("button", { name: "Sign In" }).click();
  await page.waitForURL(baseURL);
  await expect(page.getByRole("link", { name: "Setup" })).toBeVisible();
  await page.context().storageState({ path: rootFile });
});
