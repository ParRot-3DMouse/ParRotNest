import type { AppClient } from "../appClient";
import { parseOkJson } from "./utils";

export const UsersAPI = (appClient: AppClient) => {
  return {
    postUser: async ({
      user_email,
      user_name,
    }: {
      user_email: string;
      user_name: string;
    }) => {
      const res = await appClient.api.users.$post({
        json: {
          user_email: user_email,
          user_name: user_name,
        },
      });
      return await parseOkJson<{ status: string; user_id?: string }>(res);
    },
    getUser: async ({ user_id }: { user_id: string }) => {
      const res = await appClient.api.users[":user_id"].$get({
        param: { user_id: user_id },
      });
      return await parseOkJson(res);
    },
    updateUser: async ({
      user_id,
      user_name,
    }: {
      user_id: string;
      user_name: string;
    }) => {
      const res = await appClient.api.users[":user_id"].$put({
        param: { user_id: user_id },
        json: {
          user_name: user_name,
        },
      });
      return await parseOkJson(res);
    },
    deleteUser: async ({ user_id }: { user_id: string }) => {
      const res = await appClient.api.users[":user_id"].$delete({
        param: { user_id: user_id },
      });
      return await parseOkJson(res);
    },
  };
};
