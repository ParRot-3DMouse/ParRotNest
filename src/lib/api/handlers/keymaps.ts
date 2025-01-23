import { hc } from "hono/client";
import { AppType } from "../../../app/api/[[...route]]/route";
import { KeymapCollection } from "../../device/types";

export const KeymapsAPI = () => {
  const appClient = hc<AppType>("/");
  return {
    postKeymap: async ({
      keymap_name,
      keymap_json,
    }: {
      keymap_name: string;
      keymap_json: KeymapCollection;
    }) => {
      const res = await appClient.api.keymaps.$post({
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
    getKeymapsByUser: async ({ user_id }: { user_id: string }) => {
      const res = await appClient.api.keymaps.user[":user_id"].$get({
        param: { user_id: user_id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    getKeymapById: async ({ keymap_id }: { keymap_id: string }) => {
      const res = await appClient.api.keymaps[":keymap_id"].$get({
        param: { keymap_id: keymap_id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    putKeymap: async ({
      keymap_id,
      keymap_name,
      keymap_json,
    }: {
      keymap_id: string;
      keymap_name: string;
      keymap_json: KeymapCollection;
    }) => {
      const res = await appClient.api.keymaps[":keymap_id"].$put({
        param: { keymap_id: keymap_id },
        json: {
          keymap_name: keymap_name,
          keymap_json: keymap_json as unknown as string,
        },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
    deleteKeymap: async ({ keymap_id }: { keymap_id: string }) => {
      const res = await appClient.api.keymaps[":keymap_id"].$delete({
        param: { keymap_id: keymap_id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error(await res.text());
      }
    },
  };
};
