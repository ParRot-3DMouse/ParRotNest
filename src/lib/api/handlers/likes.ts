import { hc } from "hono/client";
import { AppType } from "../../../app/api/[[...route]]/route";
import { KeymapToShare, User } from "../../../app/api/types";

export const LikesAPI = () => {
  const appClient = hc<AppType>("/");
  return {
    postLike: async ({ share_id }: { share_id: string }) => {
      const res = await appClient.api.likes.$post({
        json: {
          share_id: share_id,
        },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    // 投稿に対するいいねを取得
    getLikesCheck: async ({
      share_id,
    }: {
      share_id: string;
    }): Promise<boolean> => {
      const res = await appClient.api.likes.check[":share_id"].$get({
        param: { share_id: share_id },
      });
      if (res.ok) {
        const { is_liked }: { is_liked: boolean } = await res.json();
        return is_liked;
      } else {
        throw new Error(await res.text());
      }
    },
    // 投稿に対するいいねの一覧を取得
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
    }): Promise<KeymapToShare[]> => {
      const res = await appClient.api.likes.user[":user_id"].$get({
        param: { user_id: user_id },
      });
      console.log(res);
      if (res.ok) {
        const { results }: { results: KeymapToShare[] } = await res.json();

        return results;
      } else {
        throw new Error(await res.text());
      }
    },
    deleteLike: async ({ share_id }: { share_id: string }) => {
      const res = await appClient.api.likes.$delete({
        json: {
          share_id: share_id,
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
