import {test as setup, APIRequestContext, expect } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";
import { getAccessToken } from "../utilities/setupData";

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

setup('edit user role', async() => {
    const inviteU0 = apiContext.put('/v1/users/001xzc2sa6O05HgIaj25KMQmZJ', {
        data: {
            profileName: "Manager",
            roleName: "manager",
        }
    });
    expect((await inviteU0).ok()).toBeTruthy();
    
    const inviteU1 = apiContext.put('/v1/users/0019nppBWQM5Lmq8ZZoDtMG8XY', {
      data: {
          profileName: "Employee",
          roleName: "employee",
      }
    });
    expect((await inviteU1).ok()).toBeTruthy();

  const inviteU2 = apiContext.put('/v1/users/001u5YVNONCB-p5oDiYomx6o_1', {
    data: {
        profileName: "Employee",
        roleName: "employee",
    }
  });
  expect((await inviteU2).ok()).toBeTruthy();
})