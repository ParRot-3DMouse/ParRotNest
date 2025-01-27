"use client";

import { useEffect, useState } from "react";
import { KeymapComponent } from "../../../../components/KeymapComponent";
import { KeymapCollection } from "../../../../lib/device/types";
import { initialState } from "../../../../lib/device/reducer";
import { clientApi } from "../../../../lib/api/clientApi";
import { css } from "../../../../../styled-system/css";

type KeymapShareClientProps = {
  share_id: string;
  initialKeymapCollection: KeymapCollection;
};

export function KeymapShareClient({
  share_id,
  initialKeymapCollection,
}: KeymapShareClientProps) {
  const [keymapCollection, setKeymapCollection] = useState<KeymapCollection>(
    initialKeymapCollection ?? {
      appName: "",
      layer1: initialState,
      layer2: initialState,
      layer3: initialState,
    }
  );
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const api = clientApi();

  const checkLikedStatus = async () => {
    try {
      const isLikedTemp = await api.likes.getLikesCheck({
        share_id,
      });
      setIsLiked(isLikedTemp);
    } catch (error) {
      console.error("Failed to fetch liked status:", error);
    }
  };

  useEffect(() => {
    if (share_id) {
      checkLikedStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share_id]);

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await api.likes.deleteLike({ share_id });
      } else {
        await api.likes.postLike({ share_id });
      }
      await checkLikedStatus();
    } catch (error) {
      console.error("Failed to toggle like status:", error);
    }
  };

  return (
    <div>
      <KeymapComponent
        pageKinds="share"
        keymap_id={share_id}
        keymapCollection={keymapCollection}
        setKeymapCollection={setKeymapCollection}
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
      />
      <div className={css({ display: "flex", justifyContent: "center" })}>
        <button
          className={css({
            backgroundColor: "teal.400",
            color: "white",
            padding: "10px 20px",
            borderRadius: "0.375rem",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.3s",
            _hover: {
              backgroundColor: "teal.500",
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
