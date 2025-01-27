import { notFound } from "next/navigation";
import { KeymapClient } from "./KeymapClient";
import { KeymapCollection } from "../../../lib/device/types";
import { clientApi } from "../../../lib/api/clientApi";

export const runtime = "edge";

export default async function KeymapPage({
  params,
}: {
  params: Promise<{ keymap_id: string }>;
}) {
  const api = clientApi();

  let data: {
    keymap_id: string;
    keymap_name: string;
    keymap_json: KeymapCollection;
  } | null = null;

  try {
    const { keymap_id } = await params;
    data = await api.keymaps.getKeymapById({ keymap_id });
  } catch {
    return notFound();
  }

  if (!data || !data.keymap_json) {
    return notFound();
  }

  return (
    <KeymapClient
      keymap_id={data.keymap_id}
      initialKeymapCollection={data.keymap_json}
    />
  );
}
