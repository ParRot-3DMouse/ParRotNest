"use client";

import { useEffect, useState } from "react";
import { useUser } from "../../components/provider/UserContext";
import { clientApi } from "../../lib/api/clientApi";
import { KeymapCollection } from "../../lib/device/types";
import { css } from "../../../styled-system/css";
import Link from "next/link";

const container = css({
  margin: "20px",
  padding: "20px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  width: "100%",
  minHeight: "100vh",
});

const title = css({
  fontSize: "32px",
  fontWeight: "bold",
  color: "#FFFFFF", // white
  textAlign: "center",
  marginBottom: "16px",
});

const message = css({
  fontSize: "16px",
  color: "#A0AEC0", // gray.400
  textAlign: "center",
});

const listContainer = css({
  width: "100%",
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const keymapItem = css({
  border: "1px solid #4A5568", // gray.700
  padding: "16px",
  borderRadius: "6px",
  backgroundColor: "#2D3748", // gray.800
  transition: "background-color 0.3s",
});

const keymapLink = css({
  display: "block",
  textDecoration: "none",
  color: "#FFFFFF", // white
});

const keymapTitle = css({
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "8px",
});

const keymapAuthor = css({
  fontSize: "14px",
  color: "#CBD5E0", // gray.300
});

export default function KeymapPage() {
  const { userId } = useUser();
  const api = clientApi();
  const [ownKeymaps, setOwnKeymaps] = useState<
    {
      keymap_id: string;
      keymap_name: string;
      keymap_json: KeymapCollection;
      user_id: string;
      created_at: string;
      updated_at: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchOwnKeymaps = async () => {
      try {
        if (!userId) return;
        const res = await api.keymaps.getKeymapsByUser({
          user_id: userId,
        });
        if (res) {
          console.log(res);
          setOwnKeymaps(res);
        }
      } catch (error) {
        console.error("Failed to fetch own keymaps:", error);
      }
    };
    fetchOwnKeymaps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <div className={container}>
      <h1 className={title}>Keymaps</h1>
      {ownKeymaps.length === 0 ? (
        <p className={message}>まだ保存したキーマップがありません。</p>
      ) : (
        <div className={listContainer}>
          {ownKeymaps.map((keymap) => (
            <div key={keymap.keymap_id} className={keymapItem}>
              <Link href={`/keymap/${keymap.keymap_id}`} className={keymapLink}>
                <h2 className={keymapTitle}>
                  {keymap.keymap_name || "Keymap"}
                </h2>
                <p className={keymapAuthor}>作成日: {keymap.created_at}</p>
                {keymap.updated_at && (
                  <p className={keymapAuthor}>更新日: {keymap.updated_at}</p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
