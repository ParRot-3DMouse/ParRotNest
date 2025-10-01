import type { KeymapCollection } from "../../device/types";
import { notFound } from "next/navigation";
import type { AppClient } from "../appClient";
import { buildResponseError, parseOkJson } from "./utils";

export const KeymapsToShareAPI = (appClient: AppClient) => {
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
      return await parseOkJson<{ status: string; share_id: string }>(res);
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
      try {
        if (!res.ok) {
          if (res.status === 404) {
            notFound();
          }
          throw await buildResponseError(res);
        }
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
      try {
        return await parseOkJson(res);
      } catch (error) {
        if (res.status === 404) {
          notFound();
        }
        throw error;
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
      return await parseOkJson(res);
    },
  };
};
