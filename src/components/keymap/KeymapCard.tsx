import type { FC } from "react";
import Link from "next/link";
import { css } from "../../../styled-system/css";
import { PenSquare } from "lucide-react";

const card = css({
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.12)",
  borderRadius: "16px",
  padding: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  color: "#f5ebe3",
  transition: "border 0.12s ease, transform 0.12s ease",
  _hover: {
    borderColor: "rgba(245,235,227,0.3)",
    transform: "translateY(-2px)",
  },
});

const titleRow = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "8px",
});

const titleStyle = css({
  fontSize: "18px",
  fontWeight: "600",
  flex: 1,
  lineHeight: "1.3",
});

const metaList = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "13px",
  color: "rgba(245,235,227,0.65)",
});

const linkButton = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  color: "rgba(245,235,227,0.9)",
  fontSize: "13px",
  textDecoration: "none",
  _hover: {
    color: "#f5ebe3",
  },
});

interface KeymapCardProps {
  keymapId: string;
  name: string;
  updatedAt?: string;
  createdAt?: string;
}

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
};

export const KeymapCard: FC<KeymapCardProps> = ({
  keymapId,
  name,
  updatedAt,
  createdAt,
}) => {
  return (
    <article className={card}>
      <div className={titleRow}>
        <h3 className={titleStyle}>{name || "無題のキーマップ"}</h3>
      </div>
      <div className={metaList}>
        <span>最終更新: {formatDate(updatedAt)}</span>
        <span>作成日: {formatDate(createdAt)}</span>
      </div>
      <Link href={`/keymap/${keymapId}`} className={linkButton}>
        編集ページを開く <PenSquare size={16} />
      </Link>
    </article>
  );
};
