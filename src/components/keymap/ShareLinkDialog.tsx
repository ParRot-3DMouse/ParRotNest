import type { FC } from "react";
import { Copy } from "lucide-react";
import { css } from "../../../styled-system/css";

const overlay = css({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1500,
});

const dialog = css({
  background: "#2b2727",
  borderRadius: "16px",
  padding: "28px",
  width: "min(480px, 90vw)",
  border: "1px solid rgba(245,235,227,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const field = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "10px",
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.1)",
  fontSize: "13px",
  color: "#f5ebe3",
});

const buttonRow = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
});

const secondaryButton = css({
  background: "rgba(245,235,227,0.08)",
  color: "#f5ebe3",
  border: "1px solid rgba(245,235,227,0.12)",
  borderRadius: "12px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.16)",
  },
});

interface ShareLinkDialogProps {
  link: string;
  onClose: () => void;
}

export const ShareLinkDialog: FC<ShareLinkDialogProps> = ({ link, onClose }) => {
  const handleCopy = () => navigator.clipboard.writeText(link);

  return (
    <div className={overlay}>
      <div className={dialog}>
        <h2 className={css({ fontSize: "18px", fontWeight: "700" })}>
          共有リンクをコピーしてください
        </h2>
        <div className={field}>
          <span
            className={css({
              flex: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {link}
          </span>
          <button className={secondaryButton} onClick={handleCopy}>
            <Copy size={16} /> コピー
          </button>
        </div>
        <div className={buttonRow}>
          <button className={secondaryButton} onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
