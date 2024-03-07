import { promises as fs } from 'fs';
type User = {
    origins: {
      origin: string;
      localStorage: { name: string; value: string }[];
    }[];
  };
  
  type TokenData = {
    accessToken: string;
  };
  
  type Role = {
    id: string;
    name: string;
    displayName: string;
    reportsToRole?: { id: string; name: string; displayName: string, createdAt: string, updatedAt: string };
    createdAt: string;
    updatedAt: string;
  };
  
export const getAccessToken = async (filePath: string) => {
    const data = await fs.readFile(filePath, 'utf8');
    const user: User = JSON.parse(data);
    const tokenDataString = user.origins[0].localStorage.find(item => item.name === '@nFlow/TOKEN_DATA')?.value;
  
    if (tokenDataString) {
      const tokenData: TokenData = JSON.parse(tokenDataString);
      return tokenData.accessToken;
    }
  
    return '';
};
  
export async function getRoleId(responseText: string, role: string) {
      // Parse the JSON response text
      const roles: Role[] = JSON.parse(responseText);
    
      // Find the root role
      const rootRole = roles.find(item => item.name === role);
    
      // Return the id of the root role or undefined if not found
      return rootRole ? rootRole.id : '';
}