import { notFound } from "next/navigation";
import { KeymapCollection } from "../../../../lib/device/types";
import { KeymapShareClient } from "./KeymapShareClient";
import { clientApi } from "../../../../lib/api/clientApi";

// Edge Runtime を使う場合
export const runtime = "edge";

export default async function SharePage({
  params,
}: {
  params: Promise<{ share_id: string }>;
}) {
  const api = clientApi();
  const { share_id } = await params;

  let fetchedData: {
    share_id: string;
    keymap_json: KeymapCollection;
  } | null = null;

  try {
    fetchedData = await api.keymaps_to_share.getKeymapToShareById({
      share_id: share_id,
    });
  } catch (error) {
    console.error("Failed to fetch keymap:", error);
    return notFound();
  }

  if (!fetchedData || !fetchedData.keymap_json) {
    return notFound();
  }

  // 取得したデータをクライアントコンポーネントへ渡す
  return (
    <KeymapShareClient
      share_id={fetchedData.share_id}
      initialKeymapCollection={fetchedData.keymap_json}
    />
  );
}
