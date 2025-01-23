import { KeymapsAPI } from "./handlers/keymaps";
import { KeymapsToShareAPI } from "./handlers/keymaps_to_share";
import { UsersAPI } from "./handlers/users";

export const clientApi = () => {
  return {
    users: {
      ...UsersAPI(),
    },
    keymaps: {
      ...KeymapsAPI(),
    },
    keymaps_to_share: {
      ...KeymapsToShareAPI(),
    },
  };
};
