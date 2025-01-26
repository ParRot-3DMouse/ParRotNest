import { hc } from "hono/client";
import { AppType } from "../../../app/api/[[...route]]/route";
import { KeymapCollection } from "../../device/types";
import { redirectTo404 } from "../../redirectTo404";

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
        try {
          return await res.json();
        } catch (error) {
          throw error;
        }
      } else {
        throw new Error(`Error: ${res.status} - ${await res.text()}`);
      }
    },
    getKeymapById: async ({
      keymap_id,
    }: {
      keymap_id: string;
    }): Promise<{
      keymap_id: string;
      keymap_name: string;
      keymap_json: KeymapCollection;
    }> => {
      const res = await appClient.api.keymaps[":keymap_id"].$get({
        param: { keymap_id: keymap_id },
      });
      if (res.ok) {
        try {
          const data = await res.json();
          return {
            keymap_id: data[0].keymap_id,
            keymap_name: data[0].keymap_name,
            keymap_json: JSON.parse(data[0].keymap_json),
          };
        } catch (error) {
          if (res.status === 404) {
            redirectTo404();
          }
          throw error;
        }
      } else {
        redirectTo404();
        throw new Error(`Error: ${res.status} - ${await res.text()}`);
      }
    },
    getKeymapsByUser: async ({
      user_id,
    }: {
      user_id: string;
    }): Promise<
      {
        keymap_id: string;
        keymap_name: string;
        keymap_json: KeymapCollection;
      }[]
    > => {
      const res = await appClient.api.keymaps.user[":user_id"].$get({
        param: { user_id: user_id },
      });
      if (res.ok) {
        try {
          const data = await res.json();
          const formattedData = data.map((item) => ({
            keymap_id: item.keymap_id,
            keymap_name: item.keymap_name,
            keymap_json: JSON.parse(item.keymap_json),
          }));
          return formattedData;
        } catch (error) {
          redirectTo404();
          throw error;
        }
      } else {
        redirectTo404();
        throw new Error(`Error: ${res.status} - ${await res.text()}`);
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
        try {
          return await res.json();
        } catch (error) {
          throw error;
        }
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
