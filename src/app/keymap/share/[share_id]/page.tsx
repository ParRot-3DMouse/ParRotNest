"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeymapComponent } from "../../../../components/KeymapComponent";
import { clientApi } from "../../../../lib/api/clientApi";
import { css } from "../../../../../styled-system/css";
import { useKeymap } from "../../../../components/provider/KeymapContext";

export default function KeymapPage({
  params,
}: {
  params: Promise<{ share_id: string }>;
}) {
  const { keymapCollection, setKeymapCollection } = useKeymap();
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [share_id, setshare_id] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const router = useRouter();
  const api = clientApi();

  const fetchKeymap = async () => {
    try {
      const { share_id } = await params;
      setshare_id(share_id);
      const res = await api.keymaps_to_share.getKeymapToShareById({
        share_id: share_id,
      });
      if (res) {
        const receivedKeymap = res.keymap_json;
        setKeymapCollection(receivedKeymap);
      }
    } catch (error) {
      router.push("/404");
      console.error("Failed to fetch keymap:", error);
    }
  };

  const checkLikedStatus = async () => {
    try {
      const isLikedTemp = await api.likes.getLikesCheck({
        share_id: share_id,
      });
      setIsLiked(isLikedTemp);
    } catch (error) {
      console.error("Failed to fetch liked status:", error);
    }
  };

  useEffect(() => {
    fetchKeymap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!(share_id === "")) checkLikedStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [share_id]);

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await api.likes.deleteLike({
          share_id: share_id,
        });
      } else {
        await api.likes.postLike({
          share_id: share_id,
        });
      }
      checkLikedStatus();
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
export const runtime = "edge";
