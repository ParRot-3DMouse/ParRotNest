import { useEffect, useMemo, useState } from "react";
import { clientApi } from "../api/clientApi";
import { normalizeKeymapCollection } from "../device/normalize";
import type { KeymapCollection } from "../device/types";

type LoaderKind = "edit" | "share";

interface UseKeymapLoaderOptions {
  kind: LoaderKind;
  id?: string;
  onLoaded: (collection: KeymapCollection) => void;
  enabled?: boolean;
  onError?: (error: unknown) => void;
}

interface UseKeymapLoaderResult {
  isLoading: boolean;
  error: unknown;
}

export function useKeymapLoader({
  kind,
  id,
  onLoaded,
  enabled = true,
  onError,
}: UseKeymapLoaderOptions): UseKeymapLoaderResult {
  const api = useMemo(() => clientApi(), []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!enabled || !id) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (kind === "edit") {
          const response = await api.keymaps.getKeymapById({ keymap_id: id });
          if (cancelled) return;
          onLoaded(normalizeKeymapCollection(response.keymap_json));
          return;
        }

        const response = await api.keymaps_to_share.getKeymapToShareById({
          share_id: id,
        });
        if (cancelled) return;
        onLoaded(normalizeKeymapCollection(response.keymap_json));
      } catch (err) {
        if (cancelled) return;
        setError(err);
        onError?.(err);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [api, enabled, id, kind, onError, onLoaded]);

  return { isLoading, error };
}
