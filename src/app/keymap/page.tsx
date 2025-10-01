"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { css } from "../../../styled-system/css";
import { useUser } from "../../components/provider/UserContext";
import { clientApi } from "../../lib/api/clientApi";
import { SectionHeader } from "../../components/common/SectionHeader";
import { SummaryCard } from "../../components/mypage/SummaryCard";
import { KeymapCard } from "../../components/keymap/KeymapCard";

type SortOption = "recent" | "oldest" | "name";

interface KeymapItem {
  keymap_id: string;
  keymap_name: string;
  created_at: string;
  updated_at: string;
}

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

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

export default function KeymapPage() {
  const { userId } = useUser();
  const api = useMemo(() => clientApi(), []);
  const [keymaps, setKeymaps] = useState<KeymapItem[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  useEffect(() => {
    const fetchOwnKeymaps = async () => {
      try {
        if (!userId) return;
        const res = await api.keymaps.getKeymapsByUser({ user_id: userId });
        if (res) {
          setKeymaps(
            res.map((item) => ({
              keymap_id: item.keymap_id,
              keymap_name: item.keymap_name,
              created_at: item.created_at,
              updated_at: item.updated_at,
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch own keymaps:", error);
      }
    };
    fetchOwnKeymaps();
  }, [api, userId]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const base = keyword
      ? keymaps.filter(
          (item) =>
            item.keymap_name?.toLowerCase().includes(keyword) ||
            item.keymap_id.includes(keyword)
        )
      : keymaps;

    return [...base].sort((a, b) => {
      if (sortBy === "name") {
        return a.keymap_name.localeCompare(b.keymap_name);
      }
      const dateA = new Date(a.updated_at ?? a.created_at ?? 0).getTime();
      const dateB = new Date(b.updated_at ?? b.created_at ?? 0).getTime();
      return sortBy === "recent" ? dateB - dateA : dateA - dateB;
    });
  }, [keymaps, search, sortBy]);

  const totals = keymaps.length;
  const latestUpdate = keymaps.length
    ? formatDate(
        keymaps
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
      <SectionHeader
        title="Keymaps"
        description="保存したキーマップを修正・削除・共有できます。まずは新しいキーマップを作成してみましょう。"
        actions={
          <Link href="/keymap/new" className={linkButton}>
            新しいキーマップを作成
          </Link>
        }
      />

      <div className={summaryGrid}>
        <SummaryCard
          title="保存済み"
          value={totals}
          actions={<span>最終更新: {latestUpdate}</span>}
        />
      </div>

      <div className={toolbar}>
        <input
          className={searchInput}
          placeholder="キーマップ名やIDで検索"
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
          <option value="name">名前順</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={emptyState}>
          <p>条件に一致するキーマップがありません。</p>
          <Link href="/keymap/new" className={linkButton}>
            新しいキーマップを作る
          </Link>
        </div>
      ) : (
        <div className={grid}>
          {filtered.map((keymap) => (
            <KeymapCard
              key={keymap.keymap_id}
              keymapId={keymap.keymap_id}
              name={keymap.keymap_name}
              createdAt={keymap.created_at}
              updatedAt={keymap.updated_at}
            />
          ))}
        </div>
      )}
    </div>
  );
}
