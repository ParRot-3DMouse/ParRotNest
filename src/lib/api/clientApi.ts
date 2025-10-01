import { getAppClient } from "./appClient";
import { KeymapsAPI } from "./handlers/keymaps";
import { KeymapsToShareAPI } from "./handlers/keymaps_to_share";
import { LikesAPI } from "./handlers/likes";
import { UsersAPI } from "./handlers/users";

const appClient = getAppClient();

const cachedApi = {
  users: UsersAPI(appClient),
  keymaps: KeymapsAPI(appClient),
  keymaps_to_share: KeymapsToShareAPI(appClient),
  likes: LikesAPI(appClient),
} as const;

export const clientApi = () => cachedApi;
