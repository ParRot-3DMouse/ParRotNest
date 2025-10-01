import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clientApi } from "../api/clientApi";
import type { KeymapCollection } from "../device/types";

interface UseKeymapActionsOptions {
  pageKind: "new" | "edit" | "share";
  collection: KeymapCollection;
  keymapId?: string;
  onReset: () => void;
}

interface UseKeymapActionsResult {
  handleSave: () => Promise<void>;
  handleShare: () => Promise<void>;
  handleReset: () => void;
  shareLink: string | null;
  dismissShare: () => void;
  toastMessage: string | null;
}

const SAVE_SUCCESS_MESSAGE = "保存しました";
const TOAST_DISMISS_DELAY = 3200;

export const useKeymapActions = ({
  pageKind,
  collection,
  keymapId,
  onReset,
}: UseKeymapActionsOptions): UseKeymapActionsResult => {
  const router = useRouter();
  const api = useMemo(() => clientApi(), []);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), TOAST_DISMISS_DELAY);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const handleSave = useCallback(async () => {
    try {
      if (pageKind === "new") {
        const res = await api.keymaps.postKeymap({
          keymap_name: collection.appName,
          keymap_json: collection,
        });
        router.push(`/keymap/${res.keymap_id}`);
        return;
      }

      if (pageKind === "edit" && keymapId) {
        await api.keymaps.putKeymap({
          keymap_id: keymapId,
          keymap_name: collection.appName,
          keymap_json: JSON.stringify(collection),
        });
        setToastMessage(SAVE_SUCCESS_MESSAGE);
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to save keymap"
      );
    }
  }, [api, collection, keymapId, pageKind, router]);

  const handleShare = useCallback(async () => {
    if (pageKind !== "edit") return;
    try {
      const res = await api.keymaps_to_share.postKeymapToShare({
        keymap_name: collection.appName,
        keymap_json: collection,
      });
      const url = `${window.location.origin}/keymap/share/${res.share_id}`;
      setShareLink(url);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to share keymap"
      );
    }
  }, [api, collection, pageKind]);

  const handleReset = useCallback(() => {
    if (pageKind === "share") return;
    onReset();
  }, [onReset, pageKind]);

  const dismissShare = useCallback(() => setShareLink(null), []);

  return {
    handleSave,
    handleShare,
    handleReset,
    shareLink,
    dismissShare,
    toastMessage,
  };
};
