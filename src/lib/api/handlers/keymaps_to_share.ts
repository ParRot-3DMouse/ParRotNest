import { hc } from "hono/client";
import { AppType } from "../../../app/api/[[...route]]/route";

export const KeymapsToShareAPI = () => {
  const appClient = hc<AppType>("/");
  return {
    postKeymapToShare: async ({
      keymap_name,
      keymap_json,
      author_id,
    }: {
      keymap_name: string;
      keymap_json: string;
      author_id: string;
    }) => {
      const res = await appClient.api.keymaps_to_share.$post({
        json: {
          keymap_name: keymap_name,
          keymap_json: keymap_json,
          author_id: author_id,
        },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    getKeymapsToShareByUser: async ({
      author_id,
    }: {
      author_id: string;
    }): Promise<
      {
        share_id: string;
        author_id: string;
        keymap_id: string;
      }[]
    > => {
      const res = await appClient.api.keymaps_to_share.author[
        ":author_id"
      ].$get({
        param: { author_id: author_id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    deleteKeymapToShare: async ({
      author_id,
      share_id,
    }: {
      author_id: string;
      share_id: string;
    }) => {
      const res = await appClient.api.keymaps_to_share[":share_id"].$delete({
        param: { share_id: share_id },
        json: {
          author_id: author_id,
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
