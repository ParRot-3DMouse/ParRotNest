import { UsersAPI } from "./handlers/users";

export const clientApi = () => {
  return {
    users: {
      ...UsersAPI(),
    },
  };
};
