import { KeymapsAPI } from "./handlers/keymaps";
import { UsersAPI } from "./handlers/users";

export const clientApi = () => {
  return {
    users: {
      ...UsersAPI(),
    },
    keymaps: {
      ...KeymapsAPI(),
    },
  };
};
