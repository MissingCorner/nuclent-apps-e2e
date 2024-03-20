import fs from "fs/promises";
import path from "path";
import { expect, request, test as setup } from "@playwright/test";
import { getAccessToken } from "../utils/utils";
import { baseURL, rootFile } from "../../playwright.config";

const roleFile = path.join(__dirname, "./roles.json");
const usersFile = path.join(__dirname, "./users.json");

const email = process.env.EMAIL;

interface Role {
  reportsToRole: {} | null;
  id: string;
  name: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  username: string;
}

let token: string;

setup.beforeAll(async () => {
  const accessToken = await getAccessToken(rootFile);
  token = accessToken;
});
// get all roles
setup.beforeAll(async ({ request }) => {
  const req = await request.get(baseURL + "v1/roles", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await req.json();

  expect(req.status()).toBe(200);

  await fs.writeFile(roleFile, JSON.stringify(data));
});

setup("create roles", async ({ request }) => {
  const data = await fs.readFile(roleFile, "utf8");

  const path = baseURL + "v1/roles";
  const roles: Role[] = JSON.parse(data);
  const id = roles.find((role) => role.name === "root")?.id;

  const headers = {
    Authorization: "Bearer " + token,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const createManager = await request.post(path, {
    headers,
    data: JSON.stringify({
      displayName: "Manager",
      name: "manager",
      reportsTo: id,
    }),
  });

  const res = await createManager.json();
  expect(createManager.status()).toBe(201);

  const createReporter = await request.post(path, {
    headers,
    data: JSON.stringify({
      displayName: "Reporter",
      name: "reporter",
      reportsTo: res.id,
    }),
  });

  expect(createReporter.status()).toBe(201);
});

setup.describe("users", () => {
  // get all users
  setup.beforeAll(async ({ request }) => {
    const req = await request.get(baseURL + "v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await req.json();

    expect(req.status()).toBe(200);

    await fs
      .writeFile(usersFile, JSON.stringify(data.data))
      .then(() => console.log("write to users file success"));
  });

  setup("update users", async ({ request }) => {
    const data = await fs.readFile(usersFile, "utf8");
    const path = baseURL + "v1/users/";

    const users: User[] = JSON.parse(data);
    const u0 = users.find((user) => user.username === "u0")?.id;
    const u1 = users.find((user) => user.username === "u1")?.id;

    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    // u0 as manager
    const assignManager = await request.put(path + u0, {
      headers,
      data: JSON.stringify({
        profileName: "Manager",
        roleName: "manager",
      }),
    });

    // u1 as reporter
    const assignReporter = await request.put(path + u1, {
      headers,
      data: JSON.stringify({
        profileName: "Reporter",
        roleName: "reporter",
      }),
    });

    expect(assignManager.status()).toBe(200);
    expect(assignReporter.status()).toBe(200);
  });

  // add manager email
  setup.afterAll(async ({ request }) => {
    const data = await fs.readFile(usersFile, "utf8");
    const users: User[] = JSON.parse(data);
    const u0 = users.find((user) => user.username === "u0")?.id;

    console.log("manager id:" + u0);

    // add email to u0 record
    const updateManagerEmail = await request.put(baseURL + `v1/d/user/${u0}`, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email,
      }),
    });

    console.log(updateManagerEmail);
  });
});
