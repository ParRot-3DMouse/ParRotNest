"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../components/provider/UserContext";
import { clientApi } from "../../lib/api/clientApi";
import { KeymapToShare } from "../api/types";
import Link from "next/link";
import { css } from "../../../styled-system/css"; // pandaCssのcss関数をインポート

const styles = {
  container: css({
    margin: "20px",
    padding: "20px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
    width: "100%",
    minHeight: "100vh",
  }),

  title: css({
    fontSize: "32px",
    fontWeight: "bold",
    color: "#FFFFFF", // white
    textAlign: "center",
    marginBottom: "16px",
  }),

  message: css({
    fontSize: "16px",
    color: "#A0AEC0", // gray.400
    textAlign: "center",
  }),

  listContainer: css({
    width: "100%",
    maxWidth: "800px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }),

  keymapItem: css({
    border: "1px solid #4A5568", // gray.700
    padding: "16px",
    borderRadius: "6px",
    backgroundColor: "#2D3748", // gray.800
    transition: "background-color 0.3s",
  }),

  keymapLink: css({
    display: "block",
    textDecoration: "none",
    color: "#FFFFFF", // white
  }),

  keymapTitle: css({
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "8px",
  }),

  keymapAuthor: css({
    fontSize: "14px",
    color: "#CBD5E0", // gray.300
  }),
};

export default function LikesPage() {
  const { userId } = useUser();
  const api = clientApi();
  const [likeKeymaps, setLikeKeymaps] = useState<KeymapToShare[]>([]);

  useEffect(() => {
    const fetchLikesList = async () => {
      try {
        if (!userId) return;
        const res = await api.likes.getLikesByUser({ user_id: userId });
        if (res) {
          console.log(res);
          setLikeKeymaps(res);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };
    fetchLikesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Likes</h1>
      {likeKeymaps.length === 0 ? (
        <p className={styles.message}>まだ「いいね」がありません。</p>
      ) : (
        <div className={styles.listContainer}>
          {likeKeymaps.map((keymap) => (
            <div key={keymap.share_id} className={styles.keymapItem}>
              <Link
                href={`/keymap/share/${keymap.share_id}`}
                className={styles.keymapLink}
              >
                <h2 className={styles.keymapTitle}>{keymap.keymap_name}</h2>
                <p className={styles.keymapAuthor}>
                  Author ID: {keymap.author_id}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
