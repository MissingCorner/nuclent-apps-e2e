import {test as setup, APIRequestContext, expect } from "@playwright/test";
import { STORAGE_STATE, weeklyTimesheetRecords  } from "../../playwright.config";
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

setup('import weekly timesheet', async({ request }) => {
    const importFlow = apiContext.post('/v1/d/weeklyTimesheetV2/import', {
      headers: {
        'Accept': 'application/json',
        // Assuming personal access token available in the environment.
        'Authorization': `Bearer ${token}`,
      },
      multipart:{
        file: {
            name:weeklyTimesheetRecords,
            mimeType:"application/json",
            buffer: fs.readFileSync(weeklyTimesheetRecords),
        },
        headerMap: JSON.stringify({"guid": "Record ID", "managedBy": "Managed By", "employee": "Employee", "name": "Weekly Timesheet V2", "rejectedReason": "Rejected reason", "status": "Status", "totalOt": "Total OT", "totalWorkHours": "Total work hours"})
    }
    });
    expect((await importFlow).ok()).toBeTruthy();
    
})