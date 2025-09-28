"use client";

import { css, cva } from "../../styled-system/css";
import { ShortcutPalette } from "./ShortcutPalette";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

const overlayStyle = css({
  pointerEvents: "none",
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 2000,
});

const drawerStyle = css({
  pointerEvents: "auto",
  width: "420px",
  maxWidth: "100%",
  height: "100%",
  backgroundColor: "#2b2727",
  borderLeft: "1px solid rgba(245,235,227,0.08)",
  display: "flex",
  flexDirection: "column",
});

const headerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "20px",
  borderBottom: "1px solid rgba(245,235,227,0.08)",
});

const titleStyle = css({
  fontSize: "18px",
  fontWeight: "600",
});

const closeButton = css({
  background: "transparent",
  border: "none",
  color: "#f5ebe3",
  cursor: "pointer",
  padding: "4px",
  borderRadius: "50%",
  transition: "background 0.12s ease",
  _hover: {
    backgroundColor: "rgba(245,235,227,0.08)",
  },
});

const bodyStyle = css({
  flex: 1,
  overflowY: "auto",
  padding: "20px",
});

const searchStyle = cva({
  base: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid rgba(245,235,227,0.1)",
    backgroundColor: "rgba(245,235,227,0.05)",
    color: "#f5ebe3",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.12s ease",
    _focusWithin: {
      borderColor: "rgba(177, 61, 87, 0.6)",
      boxShadow: "0 0 0 1px rgba(177, 61, 87, 0.6)",
    },
  },
});

interface ShortcutDrawerProps {
  open: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onClose: () => void;
}

export const ShortcutDrawer: React.FC<ShortcutDrawerProps> = ({
  open,
  search,
  onSearchChange,
  onClose,
}) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!open) return;

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (drawerRef.current && !drawerRef.current.contains(target)) {
        onClose();
      }
    };

    const listenerOptions: AddEventListenerOptions = { capture: true };
    window.addEventListener("pointerdown", handlePointerDown, listenerOptions);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown, listenerOptions);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={overlayStyle} role="dialog" aria-modal="true">
      <div className={drawerStyle} ref={drawerRef}>
        <header className={headerStyle}>
          <div>
            <h2 className={titleStyle}>ショートカットライブラリ</h2>
            <p
              className={css({
                fontSize: "13px",
                color: "rgba(245,235,227,0.65)",
                marginTop: "4px",
              })}
            >
              ドラッグ＆ドロップまたは検索して割り当てるショートカットを選んでください。
            </p>
          </div>
          <button className={closeButton} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        <div className={css({ padding: "16px 20px 0" })}>
          <div className={searchStyle()}>
            <input
              aria-label="ショートカット検索"
              className={css({
                width: "100%",
                border: "none",
                background: "transparent",
                color: "inherit",
                outline: "none",
                fontSize: "14px",
              })}
              placeholder="ショートカット名で検索"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>
        <main className={bodyStyle}>
          <ShortcutPalette search={search} />
        </main>
      </div>
    </div>
  );
};
