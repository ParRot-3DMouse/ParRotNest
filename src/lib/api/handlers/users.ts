import { AppType } from "../../../app/api/[[...route]]/route";
import { hc } from "hono/client";

export const UsersAPI = () => {
  const appClient = hc<AppType>("/");
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
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    getUser: async ({ user_id }: { user_id: string }) => {
      const res = await appClient.api.users[":user_id"].$get({
        param: { user_id: user_id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
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
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    deleteUser: async ({ user_id }: { user_id: string }) => {
      const res = await appClient.api.users[":user_id"].$delete({
        param: { user_id: user_id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
  };
};
