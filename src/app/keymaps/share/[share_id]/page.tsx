"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { KeymapComponent } from "../../../../components/KeymapComponent";
import { css } from "../../../../../styled-system/css";
import { useKeymap } from "../../../../components/provider/KeymapContext";
import type { KeymapCollection } from "../../../../lib/device/types";
import { clientApi } from "../../../../lib/api/clientApi";
import { useKeymapLoader } from "../../../../lib/hooks/useKeymapLoader";

export default function KeymapPage({
  params,
}: {
  params: Promise<{ share_id: string }>;
}) {
  const { keymapCollection, setKeymapCollection } = useKeymap();
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [shareId, setShareId] = useState<string>();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const router = useRouter();
  const api = useMemo(() => clientApi(), []);

  const handleLoaded = useCallback(
    (collection: KeymapCollection) => {
      setKeymapCollection(collection);
    },
    [setKeymapCollection]
  );

  const handleError = useCallback(
    (error: unknown) => {
      console.error("Failed to fetch keymap:", error);
      router.replace("/404");
    },
    [router]
  );

  useEffect(() => {
    let isSubscribed = true;

    params
      .then(({ share_id }) => {
        if (!isSubscribed) return;
        setShareId(share_id);
      })
      .catch((error) => {
        if (!isSubscribed) return;
        handleError(error);
      });

    return () => {
      isSubscribed = false;
    };
  }, [handleError, params]);

  useKeymapLoader({
    kind: "share",
    id: shareId,
    onLoaded: handleLoaded,
    onError: handleError,
    enabled: Boolean(shareId),
  });

  const checkLikedStatus = useCallback(async () => {
    if (!shareId) return;
    try {
      const nextIsLiked = await api.likes.getLikesCheck({
        share_id: shareId,
      });
      setIsLiked(nextIsLiked);
    } catch (error) {
      console.error("Failed to fetch liked status:", error);
    }
  }, [api, shareId]);

  useEffect(() => {
    checkLikedStatus();
  }, [checkLikedStatus]);

  const toggleLike = useCallback(async () => {
    if (!shareId) return;
    try {
      if (isLiked) {
        await api.likes.deleteLike({
          share_id: shareId,
        });
      } else {
        await api.likes.postLike({
          share_id: shareId,
        });
      }
      checkLikedStatus();
    } catch (error) {
      console.error("Failed to toggle like status:", error);
    }
  }, [api, checkLikedStatus, isLiked, shareId]);

  if (!shareId) {
    return null;
  }

  return (
    <div>
      <KeymapComponent
        pageKinds="share"
        keymap_id={shareId}
        keymapCollection={keymapCollection}
        setKeymapCollection={setKeymapCollection}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
      <div className={css({ display: "flex", justifyContent: "center" })}>
        <button
          className={css({
            // backgroundColor: "teal.400",
            backgroundColor: isLiked ? "#b13d57" : "#177b3a",
            padding: "10px 20px",
            borderRadius: "0.375rem",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s",
            _hover: {
              // backgroundColor: "teal.500",
            },
            width: "fit-content",
          })}
          onClick={toggleLike}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    </div>
  );
}
