import { hc } from "hono/client";
import { AppType } from "../../../app/api/[[...route]]/route";
import { KeymapCollection } from "../../device/types";
import { notFound } from "next/navigation";

export const KeymapsToShareAPI = () => {
  const appClient = hc<AppType>("/");
  return {
    postKeymapToShare: async ({
      keymap_name,
      keymap_json,
    }: {
      keymap_name: string;
      keymap_json: KeymapCollection;
    }) => {
      const res = await appClient.api.keymaps_to_share.$post({
        json: {
          keymap_name: keymap_name,
          keymap_json: JSON.stringify(keymap_json),
        },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    getKeymapToShareById: async ({
      share_id,
    }: {
      share_id: string;
    }): Promise<{
      share_id: string;
      keymap_name: string;
      keymap_json: KeymapCollection;
    }> => {
      const res = await appClient.api.keymaps_to_share[":share_id"].$get({
        param: { share_id: share_id },
      });
      if (res.ok) {
        try {
          const data = await res.json();
          return {
            share_id: data[0].share_id,
            keymap_name: data[0].keymap_name,
            keymap_json: JSON.parse(data[0].keymap_json),
          };
        } catch (error) {
          if (res.status === 404) {
            notFound();
          }
          throw error;
        }
      } else {
        notFound();
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
        try {
          return await res.json();
        } catch (error) {
          notFound();
          throw error;
        }
      } else {
        notFound();
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
