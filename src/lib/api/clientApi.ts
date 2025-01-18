import { UsersAPI } from "./handlers/users";

export const clientApi = (jwt: string | undefined) => {
  if (!jwt) {
    throw new Error("Failed to provide a valid JWT token");
  }
  return {
    users: {
      ...UsersAPI(),
    },
  };
};
