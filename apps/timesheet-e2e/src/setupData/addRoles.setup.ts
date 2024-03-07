import { STORAGE_STATE } from '../../playwright.config';
import { test as setup, expect, APIRequestContext } from '@playwright/test';
import { getAccessToken, getRoleId } from '../utilities/setupData';

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

// setup('get roles', async({ request }) => {
//     const response = await apiContext.get(`/v1/roles`)
//     rootId = await getRoleId(await response.text(), `root`)
//     expect(response.ok()).toBeTruthy();
// })
setup('add roles', async() => {
    const getRole1 = await apiContext.get(`/v1/roles`)
    const rootId = await getRoleId(await getRole1.text(), `root`)
    expect(getRole1.ok()).toBeTruthy();
    const addManager = await apiContext.post(`/v1/roles`, {
        data: {
          displayName: "Manager",
          name: "manager",
          reportsTo: `${rootId}`
        }
      });
    expect(addManager.ok()).toBeTruthy();

    const getRole2 = await apiContext.get(`/v1/roles`)
    const managerId = await getRoleId(await getRole2.text(), `manager`)
    expect(getRole2.ok()).toBeTruthy();
    const addEmployee = await apiContext.post(`/v1/roles`, {
        data: {
          displayName: "Employee",
          name: "employee",
          reportsTo: `${managerId}`
        }
      });
    expect(addEmployee.ok()).toBeTruthy();
})
