import type { KeymapToShare, User } from "../../../app/api/types";
import type { AppClient } from "../appClient";
import { parseOkJson } from "./utils";

export const LikesAPI = (appClient: AppClient) => {
  return {
    postLike: async ({ share_id }: { share_id: string }) => {
      const res = await appClient.api.likes.$post({
        json: {
          share_id: share_id,
        },
      });
      return await parseOkJson(res);
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
      const { is_liked } = await parseOkJson<{ is_liked: boolean }>(res);
      return is_liked;
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
      const { results } = await parseOkJson<{ results: User[] }>(res);
      return results;
    },
    getLikesByUser: async ({
      user_id,
    }: {
      user_id: string;
    }): Promise<KeymapToShare[]> => {
      const res = await appClient.api.likes.user[":user_id"].$get({
        param: { user_id: user_id },
      });
      const { results } = await parseOkJson<{ results: KeymapToShare[] }>(res);
      return results;
    },
    deleteLike: async ({ share_id }: { share_id: string }) => {
      const res = await appClient.api.likes.$delete({
        json: {
          share_id: share_id,
        },
      });
      return await parseOkJson(res);
    },
  };
};
