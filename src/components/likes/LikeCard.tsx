import type { FC } from "react";
import Link from "next/link";
import { css } from "../../../styled-system/css";
import { ArrowUpRight } from "lucide-react";

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

const actionRow = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "auto",
  gap: "12px",
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

const secondaryButton = css({
  background: "rgba(245,235,227,0.08)",
  border: "1px solid rgba(245,235,227,0.16)",
  borderRadius: "10px",
  color: "#f5ebe3",
  padding: "8px 14px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.16)",
  },
  _disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

interface LikeCardProps {
  title: string;
  author: string;
  createdAt?: string;
  updatedAt?: string;
  shareId: string;
  onUnlike?: () => Promise<void> | void;
  disabling?: boolean;
}

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString();
};

export const LikeCard: FC<LikeCardProps> = ({
  title,
  author,
  createdAt,
  updatedAt,
  shareId,
  onUnlike,
  disabling = false,
}) => {
  return (
    <article className={card}>
      <div className={titleRow}>
        <h3 className={titleStyle}>{title}</h3>
        <Link href={`/keymaps/share/${shareId}`} className={linkButton}>
          詳細を見る <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className={metaList}>
        <span>作者ID: {author}</span>
        {updatedAt && <span>最終更新: {formatDate(updatedAt)}</span>}
        {!updatedAt && createdAt && (
          <span>作成日: {formatDate(createdAt)}</span>
        )}
      </div>
      <div className={actionRow}>
        <Link href={`/keymaps/share/${shareId}`} className={linkButton}>
          共有ページへ移動 <ArrowUpRight size={16} />
        </Link>
        {onUnlike && (
          <button
            className={secondaryButton}
            onClick={() => onUnlike()}
            disabled={disabling}
          >
            いいねを外す
          </button>
        )}
      </div>
    </article>
  );
};
