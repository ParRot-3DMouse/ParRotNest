import type { FC, ReactNode } from "react";
import { css } from "../../../styled-system/css";

const card = css({
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.08)",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  minHeight: "140px",
  color: "#f5ebe3",
});

const heading = css({
  fontSize: "16px",
  fontWeight: "600",
});

const valueStyle = css({
  fontSize: "32px",
  fontWeight: "700",
});

const footer = css({
  marginTop: "auto",
  fontSize: "13px",
  color: "rgba(245,235,227,0.65)",
});

interface SummaryCardProps {
  title: string;
  value: ReactNode;
  description?: string;
  actions?: ReactNode;
}

export const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value,
  description,
  actions,
}) => (
  <section className={card}>
    <h3 className={heading}>{title}</h3>
    <div className={valueStyle}>{value}</div>
    {description && <p>{description}</p>}
    {actions && <div className={footer}>{actions}</div>}
  </section>
);
