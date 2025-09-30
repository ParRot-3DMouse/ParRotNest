"use client";

import { css, cva } from "../../styled-system/css";
import { ShortcutPalette } from "./ShortcutPalette";
import { GripHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const floatingLayer = css({
  pointerEvents: "none",
  position: "fixed",
  inset: 0,
  zIndex: 2000,
});

const windowStyle = css({
  pointerEvents: "auto",
  position: "fixed",
  width: "min(440px, 38vw)",
  minWidth: "320px",
  maxWidth: "90vw",
  maxHeight: "min(78vh, 640px)",
  backgroundColor: "#2b2727",
  borderRadius: "16px",
  border: "1px solid rgba(245,235,227,0.12)",
  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const headerStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid rgba(245,235,227,0.08)",
  background: "rgba(245,235,227,0.05)",
  cursor: "grab",
  userSelect: "none",
});

const titleGroup = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  pointerEvents: "none",
});

const titleStyle = css({
  fontSize: "16px",
  fontWeight: "600",
  color: "#f5ebe3",
});

const headerActions = css({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const iconButton = css({
  background: "rgba(245,235,227,0.08)",
  border: "1px solid rgba(245,235,227,0.12)",
  color: "#f5ebe3",
  cursor: "pointer",
  width: "28px",
  height: "28px",
  display: "grid",
  placeItems: "center",
  borderRadius: "10px",
  transition: "background 0.12s ease, border 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.14)",
    borderColor: "rgba(245,235,227,0.22)",
  },
});

const bodyStyle = css({
  flex: 1,
  overflowY: "auto",
  padding: "18px",
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

const defaultPosition = () => {
  if (typeof window === "undefined") {
    return { x: 48, y: 96 };
  }
  const width = Math.min(440, Math.max(320, window.innerWidth * 0.38));
  const x = Math.max(window.innerWidth - width - 64, 32);
  const y = Math.max(72, window.innerHeight * 0.12);
  return { x, y };
};

export const ShortcutDrawer: React.FC<ShortcutDrawerProps> = ({
  open,
  search,
  onSearchChange,
  onClose,
}) => {
  const windowRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({ offsetX: 0, offsetY: 0 });
  const draggingRef = useRef(false);

  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);

  const clampPosition = useCallback((x: number, y: number) => {
    if (typeof window === "undefined") return { x, y };
    const rect = windowRef.current?.getBoundingClientRect();
    const width = rect?.width ?? 360;
    const height = rect?.height ?? 520;
    const maxX = Math.max(16, window.innerWidth - width - 16);
    const maxY = Math.max(16, window.innerHeight - height - 16);
    return {
      x: Math.min(Math.max(16, x), maxX),
      y: Math.min(Math.max(16, y), maxY),
    };
  }, []);

  const updatePosition = useCallback(
    (x: number, y: number) => {
      setPosition(clampPosition(x, y));
    },
    [clampPosition]
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!draggingRef.current) return;
      const { offsetX, offsetY } = dragStateRef.current;
      updatePosition(event.clientX - offsetX, event.clientY - offsetY);
    },
    [updatePosition]
  );

  const endDrag = useCallback(() => {
    draggingRef.current = false;
    setIsDragging(false);
    window.removeEventListener("pointermove", handlePointerMove);
    window.removeEventListener("pointerup", endDrag);
  }, [handlePointerMove]);

  const startDrag = useCallback(
    (event: React.PointerEvent) => {
      if (!windowRef.current) return;
      const rect = windowRef.current.getBoundingClientRect();
      dragStateRef.current = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
      draggingRef.current = true;
      setIsDragging(true);
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", endDrag, { once: true });
    },
    [endDrag, handlePointerMove]
  );

  useEffect(() => {
    if (!open) {
      draggingRef.current = false;
      return;
    }
    setPosition((prev) => clampPosition(prev.x, prev.y));
  }, [open, clampPosition]);

  useEffect(() => {
    if (!open) return;
    const reposition = () => {
      setPosition((previous) => clampPosition(previous.x, previous.y));
    };
    window.addEventListener("resize", reposition);
    return () => window.removeEventListener("resize", reposition);
  }, [open, clampPosition]);

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
    setPosition(defaultPosition());
  }, [open]);

  const windowInlineStyle = useMemo(() => {
    return {
      top: `${position.y}px`,
      left: `${position.x}px`,
      cursor: isDragging ? "grabbing" : undefined,
    } as React.CSSProperties;
  }, [isDragging, position]);

  if (!open) return null;

  return (
    <div className={floatingLayer} role="dialog" aria-modal="false">
      <div ref={windowRef} className={windowStyle} style={windowInlineStyle}>
        <header
          className={headerStyle}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            startDrag(event);
          }}
        >
          <div className={titleGroup}>
            <GripHorizontal size={16} aria-hidden="true" />
            <span className={titleStyle}>ショートカットライブラリ</span>
          </div>
          <div className={headerActions}>
            <button
              type="button"
              className={iconButton}
              onClick={onClose}
              aria-label="Close shortcut library"
            >
              <X size={16} />
            </button>
          </div>
        </header>
        <div className={css({ padding: "14px 16px 0" })}>
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
