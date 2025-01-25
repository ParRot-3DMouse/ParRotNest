import { hc } from "hono/client";
import { AppType } from "../../../app/api/[[...route]]/route";
import { User } from "../../../app/api/types";

export const LikesAPI = () => {
  const appClient = hc<AppType>("/");
  return {
    postLike: async ({
      share_id,
      user_id,
    }: {
      share_id: string;
      user_id: string;
    }) => {
      const res = await appClient.api.likes.$post({
        json: {
          share_id: share_id,
          user_id: user_id,
        },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    getLikesByShare: async ({
      share_id,
    }: {
      share_id: string;
    }): Promise<User[]> => {
      const res = await appClient.api.likes.share[":share_id"].$get({
        param: { share_id: share_id },
      });
      if (res.ok) {
        const { results }: { results: User[] } = await res.json();

        return results;
      } else {
        throw new Error(await res.text());
      }
    },
    getLikesByUser: async ({
      user_id,
    }: {
      user_id: string;
    }): Promise<User[]> => {
      const res = await appClient.api.likes.user[":user_id"].$get({
        param: { user_id: user_id },
      });
      if (res.ok) {
        const { results }: { results: User[] } = await res.json();

        return results;
      } else {
        throw new Error(await res.text());
      }
    },
    deleteLike: async ({
      share_id,
      user_id,
    }: {
      share_id: string;
      user_id: string;
    }) => {
      const res = await appClient.api.likes.$delete({
        json: {
          share_id: share_id,
          user_id: user_id,
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
