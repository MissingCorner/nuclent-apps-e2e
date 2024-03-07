import {test as setup, APIRequestContext, expect } from "@playwright/test";
import { STORAGE_STATE, timesheetPath  } from "../../playwright.config";
import { getAccessToken } from "../utilities/setupData";
import fs from 'fs';

let apiContext: APIRequestContext;
let token: string | undefined ;
setup.beforeAll(async ({ playwright }) => {
    token = await getAccessToken(STORAGE_STATE) ?? undefined;
    apiContext = await playwright.request.newContext({
      // All requests we send go to this API endpoint.
      extraHTTPHeaders: {
        // We set this header per GitHub guidelines.
        'Accept': 'application/json',
        // Assuming personal access token available in the environment.
        'Authorization': `Bearer ${token}`,
      },
    });
  });
setup.afterAll(async ({ }) => {
    // Dispose all responses.
    await apiContext.dispose();
});

setup('import flow', async({ request }) => {
    const importFlow = apiContext.post('/v1/builder/meta/import?onConflict=override', {
      headers: {
        'Accept': 'application/json',
        // Assuming personal access token available in the environment.
        'Authorization': `Bearer ${token}`,
      },
      multipart:{
        file: {
            name:timesheetPath,
            mimeType:"application/json",
            buffer: fs.readFileSync(timesheetPath),
        }
    }
    });
    expect((await importFlow).ok()).toBeTruthy();
    
})