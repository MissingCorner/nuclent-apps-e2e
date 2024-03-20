import fs from "fs";
import path from "path";
require("dotenv").config({ path: ".env.local" });
import { test as setup, expect } from "@playwright/test";
import { baseURL, rootFile } from "../../playwright.config";
import { getAccessToken } from "../utils/utils";

setup.beforeEach(async ({ page }) => {
  await page.goto(baseURL);
});

// import config
setup("import site configs", async ({ request }) => {
  const accessToken = await getAccessToken(rootFile);

  const req = await request.post(
    baseURL + "/v1/builder/meta/import?onConflict=override",
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      multipart: {
        file: {
          name: "config",
          mimeType: "application/json",
          buffer: fs.readFileSync(
            path.join(__dirname, "../../public/expenses.txt")
          ),
        },
      },
    }
  );

  expect(req.status()).toBe(201);
});
