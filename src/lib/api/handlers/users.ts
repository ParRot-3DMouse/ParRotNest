import { AppType } from "../../../app/api/[[...route]]/route";
import { hc } from "hono/client";

export const UsersAPI = () => {
  const appClient = hc<AppType>("/");

  return {
    postUser: async ({
      user_id,
      user_email,
      user_name,
    }: {
      user_id: string;
      user_email: string;
      user_name: string;
    }) => {
      const res = await appClient.api.users.$post({
        json: {
          user_id: user_id,
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
  };
};
