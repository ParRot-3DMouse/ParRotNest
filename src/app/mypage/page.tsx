"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { css } from "../../../styled-system/css";
import { useUser } from "../../components/provider/UserContext";
import { clientApi } from "../../lib/api/clientApi";
import { useMyPageData } from "../../lib/hooks/useMyPageData";
import { ProfileCard } from "../../components/mypage/ProfileCard";
import { SummaryCard } from "../../components/mypage/SummaryCard";
import { RecentList } from "../../components/mypage/RecentList";

const pageContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
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

const listsGrid = css({
  display: "grid",
  gap: "20px",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
});

const linkButton = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: "rgba(245,235,227,0.9)",
  textDecoration: "none",
  _hover: {
    color: "#f5ebe3",
  },
});

const loadingBox = css({
  display: "grid",
  placeItems: "center",
  padding: "60px 0",
  color: "rgba(245,235,227,0.65)",
});

const errorBox = css({
  display: "grid",
  placeItems: "center",
  padding: "60px 0",
  color: "#ff8a8a",
});

const formatDateTime = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

export default function MyPage() {
  const { userId } = useUser();
  const { data: session } = useSession();
  const [profileName, setProfileName] = useState<string>("");
  const api = useMemo(() => clientApi(), []);

  const {
    isLoading,
    error,
    keymaps,
    sharedKeymaps,
    likedKeymaps,
    userProfile,
  } = useMyPageData({ userId });

  useEffect(() => {
    if (userProfile?.user_name) {
      setProfileName(userProfile.user_name);
    }
  }, [userProfile?.user_name]);

  const handleSaveName = useCallback(
    async (nextName: string) => {
      if (!userId) throw new Error("ユーザー情報が見つかりません");
      await api.users.updateUser({ user_id: userId, user_name: nextName });
      setProfileName(nextName);
    },
    [api, userId]
  );

  if (!userId) {
    return (
      <div className={loadingBox}>
        <p>ユーザー情報を読み込み中です…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={errorBox}>
        <p>マイページの読み込みに失敗しました。</p>
      </div>
    );
  }

  if (isLoading && !userProfile) {
    return (
      <div className={loadingBox}>
        <p>データを読み込み中です…</p>
      </div>
    );
  }

  const keymapCount = keymaps.length;
  const sharedCount = sharedKeymaps.length;
  const likedCount = likedKeymaps.length;

  const recentKeymaps = keymaps.slice(0, 3).map((item) => ({
    id: item.keymap_id,
    title: item.keymap_name || "無題のキーマップ",
    href: `/keymaps/${item.keymap_id}`,
    meta: `更新: ${formatDateTime(item.updated_at || item.created_at)}`,
  }));

  const recentShared = sharedKeymaps.slice(0, 3).map((item) => ({
    id: item.share_id,
    title: item.keymap_name,
    href: `/keymaps/share/${item.share_id}`,
    meta: `共有: ${formatDateTime(item.updated_at || item.created_at)}`,
  }));

  const recentLikes = likedKeymaps.slice(0, 3).map((item) => ({
    id: item.share_id,
    title: item.keymap_name,
    href: `/keymaps/share/${item.share_id}`,
    meta: `作者ID: ${item.author_id}`,
  }));

  return (
    <div className={pageContainer}>
      <ProfileCard
        name={
          profileName || userProfile?.user_name || session?.user?.name || ""
        }
        email={userProfile?.user_email || session?.user?.email || ""}
        joinedAt={userProfile?.created_at}
        onSaveName={handleSaveName}
      />

      <div className={summaryGrid}>
        <SummaryCard
          title="保存したキーマップ"
          value={keymapCount}
          actions={
            <Link href="/keymaps" className={linkButton}>
              キーマップ一覧へ
            </Link>
          }
        />
        <SummaryCard
          title="公開中"
          value={sharedCount}
          actions={
            <Link href="/keymaps" className={linkButton}>
              キーマップ管理へ
            </Link>
          }
        />
        <SummaryCard
          title="いいね"
          value={likedCount}
          actions={
            <Link href="/likes" className={linkButton}>
              いいね一覧へ
            </Link>
          }
        />
      </div>

      <div className={listsGrid}>
        <RecentList
          title="最近保存したキーマップ"
          items={recentKeymaps}
          emptyMessage="まだ保存済みのキーマップがありません。"
          viewAllHref="/keymap"
        />
        <RecentList
          title="共有したキーマップ"
          items={recentShared}
          emptyMessage="まだ共有しているキーマップがありません。"
          viewAllHref="/keymap"
        />
        <RecentList
          title="いいねしたキーマップ"
          items={recentLikes}
          emptyMessage="まだ「いいね」したキーマップがありません。"
          viewAllHref="/likes"
        />
      </div>
    </div>
  );
}
