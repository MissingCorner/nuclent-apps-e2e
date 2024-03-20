import { promises as fs } from "fs";

type User = {
  origins: {
    origin: string;
    localStorage: { name: string; value: string }[];
  }[];
};

type TokenData = {
  accessToken: string;
};

export const getAccessToken = async (filePath: string) => {
  const data = await fs.readFile(filePath, "utf8");
  const user: User = JSON.parse(data);
  const tokenDataString = user.origins[0].localStorage.find(
    (item) => item.name === "@nFlow/TOKEN_DATA"
  )?.value;

  if (tokenDataString) {
    const tokenData: TokenData = JSON.parse(tokenDataString);
    return tokenData.accessToken;
  }

  return "";
};
