import type { FC } from "react";
import Link from "next/link";
import { css } from "../../../styled-system/css";

const container = css({
  background: "rgba(245,235,227,0.04)",
  border: "1px solid rgba(245,235,227,0.08)",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  color: "#f5ebe3",
});

const header = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const titleStyle = css({
  fontSize: "16px",
  fontWeight: "600",
});

const linkStyle = css({
  fontSize: "13px",
  color: "rgba(245,235,227,0.75)",
  textDecoration: "none",
  _hover: {
    color: "#f5ebe3",
  },
});

const list = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const itemLink = css({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.08)",
  borderRadius: "12px",
  padding: "12px",
  textDecoration: "none",
  color: "inherit",
  transition: "background 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.1)",
  },
});

const itemTitle = css({
  fontSize: "15px",
  fontWeight: "600",
});

const itemMeta = css({
  fontSize: "13px",
  color: "rgba(245,235,227,0.65)",
});

interface RecentListItem {
  id: string;
  title: string;
  href: string;
  meta?: string;
}

interface RecentListProps {
  title: string;
  items: RecentListItem[];
  emptyMessage: string;
  viewAllHref: string;
}

export const RecentList: FC<RecentListProps> = ({
  title,
  items,
  emptyMessage,
  viewAllHref,
}) => (
  <section className={container}>
    <div className={header}>
      <h3 className={titleStyle}>{title}</h3>
      <Link href={viewAllHref} className={linkStyle}>
        すべて表示
      </Link>
    </div>
    {items.length === 0 ? (
      <p className={css({ fontSize: "14px", color: "rgba(245,235,227,0.6)" })}>
        {emptyMessage}
      </p>
    ) : (
      <div className={list}>
        {items.map((item) => (
          <Link key={item.id} href={item.href} className={itemLink}>
            <span className={itemTitle}>{item.title}</span>
            {item.meta && <span className={itemMeta}>{item.meta}</span>}
          </Link>
        ))}
      </div>
    )}
  </section>
);
