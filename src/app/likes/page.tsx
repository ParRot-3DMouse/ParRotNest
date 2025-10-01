"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { css } from "../../../styled-system/css";
import { clientApi } from "../../lib/api/clientApi";
import { useUser } from "../../components/provider/UserContext";
import type { KeymapToShare } from "../api/types";
import { SectionHeader } from "../../components/common/SectionHeader";
import { SummaryCard } from "../../components/mypage/SummaryCard";
import { LikeCard } from "../../components/likes/LikeCard";

const container = css({
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "32px",
  width: "100%",
  maxWidth: "1080px",
  margin: "0 auto",
});

const summaryGrid = css({
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
});

const toolbar = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  alignItems: "center",
});

const searchInput = css({
  flex: "1 1 220px",
  minWidth: "200px",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "1px solid rgba(245,235,227,0.16)",
  background: "rgba(245,235,227,0.06)",
  color: "#f5ebe3",
  outline: "none",
  transition: "border 0.12s ease",
  _focus: {
    borderColor: "rgba(177,61,87,0.6)",
    boxShadow: "0 0 0 1px rgba(177,61,87,0.4)",
  },
});

const selectInput = css({
  padding: "10px 12px",
  borderRadius: "10px",
  border: "1px solid rgba(245,235,227,0.16)",
  background: "rgba(245,235,227,0.06)",
  color: "#f5ebe3",
  outline: "none",
});

const grid = css({
  display: "grid",
  gap: "16px",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
});

const emptyState = css({
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.1)",
  borderRadius: "16px",
  padding: "40px 24px",
  textAlign: "center",
  color: "rgba(245,235,227,0.7)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
});

const linkButton = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: "rgba(245,235,227,0.9)",
  textDecoration: "none",
  fontSize: "13px",
  _hover: {
    color: "#f5ebe3",
  },
});

type SortOption = "recent" | "oldest";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

export default function LikesPage() {
  const { userId } = useUser();
  const api = clientApi();
  const [likeKeymaps, setLikeKeymaps] = useState<KeymapToShare[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [busyShareId, setBusyShareId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikesList = async () => {
      try {
        if (!userId) return;
        const res = await api.likes.getLikesByUser({ user_id: userId });
        if (res) {
          setLikeKeymaps(res);
        }
      } catch (error) {
        console.error("Failed to fetch likes:", error);
      }
    };
    fetchLikesList();
  }, [api, userId]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const base = keyword
      ? likeKeymaps.filter((item) => {
          const title = item.keymap_name?.toLowerCase() ?? "";
          const author = item.author_id?.toLowerCase() ?? "";
          return title.includes(keyword) || author.includes(keyword);
        })
      : likeKeymaps;

    const sorter = [...base].sort((a, b) => {
      const dateA = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
      const dateB = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
      return sortBy === "recent" ? dateB - dateA : dateA - dateB;
    });

    return sorter;
  }, [likeKeymaps, search, sortBy]);

  const handleUnlike = async (shareId: string) => {
    if (!userId) return;
    try {
      setBusyShareId(shareId);
      await api.likes.deleteLike({ share_id: shareId });
      setLikeKeymaps((prev) =>
        prev.filter((item) => item.share_id !== shareId)
      );
    } catch (error) {
      console.error("Failed to unlike", error);
    } finally {
      setBusyShareId((prev) => (prev === shareId ? null : prev));
    }
  };

  const totals = likeKeymaps.length;
  const latestDate = likeKeymaps.length
    ? formatDate(
        likeKeymaps
          .map((item) => item.updated_at ?? item.created_at)
          .filter(Boolean)
          .sort(
            (a, b) =>
              new Date(b as string).getTime() - new Date(a as string).getTime()
          )[0] as string | undefined
      )
    : "-";

  return (
    <div className={container}>
      <SectionHeader title="Likes" />

      <div className={summaryGrid}>
        <SummaryCard
          title="いいねしたキーマップ"
          value={totals}
          actions={<span>最新のいいね: {latestDate}</span>}
        />
      </div>

      <div className={toolbar}>
        <input
          className={searchInput}
          placeholder="キーマップ名や作者IDで検索"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className={selectInput}
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as SortOption)}
        >
          <option value="recent">最新順</option>
          <option value="oldest">古い順</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={emptyState}>
          {likeKeymaps.length === 0 ? (
            <>
              <p>
                気に入ったキーマップをいいねして、いつでもアクセスできるようにしましょう。
              </p>
              <Link href="/keymap" className={linkButton}>
                公開キーマップを探しに行く
              </Link>
            </>
          ) : (
            <>
              <p>条件に一致するキーマップが見つかりませんでした。</p>
              <Link href="/keymap" className={linkButton}>
                公開キーマップを探しに行く
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className={grid}>
          {filtered.map((item) => (
            <LikeCard
              key={item.share_id}
              title={item.keymap_name}
              author={item.author_id}
              createdAt={item.created_at}
              updatedAt={item.updated_at}
              shareId={item.share_id}
              onUnlike={() => handleUnlike(item.share_id)}
              disabling={busyShareId === item.share_id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
