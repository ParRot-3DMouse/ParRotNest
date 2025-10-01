import type { FC, ReactNode } from "react";
import { css } from "../../../styled-system/css";

const wrapper = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  paddingBottom: "24px",
  borderBottom: "1px solid rgba(245,235,227,0.08)",
  marginBottom: "24px",
});

const heading = css({
  fontSize: "28px",
  fontWeight: "700",
  color: "#f5ebe3",
});

const descriptionStyle = css({
  fontSize: "15px",
  color: "rgba(245,235,227,0.7)",
  lineHeight: "1.6",
  maxWidth: "680px",
});

const actionsRow = css({
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
});

interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
}) => (
  <header className={wrapper}>
    <h2 className={heading}>{title}</h2>
    {description && <p className={descriptionStyle}>{description}</p>}
    {actions && <div className={actionsRow}>{actions}</div>}
  </header>
);
