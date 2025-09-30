"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { css } from "../../styled-system/css";
import { DeviceCard } from "./DeviceCard";
import { useHID } from "./provider/HIDContext";
import { useKeymap } from "./provider/KeymapContext";
import { PanelLeftOpen, X } from "lucide-react";
import type { KeymapConfig } from "../lib/device/types";

type ClientLayoutProps = {
  children: React.ReactNode;
};

const layoutStyle = css({
  display: "flex",
  flexDirection: "row",
});

const sidePanelStyle = css({
  width: "350px",
  minWidth: "350px",
  padding: "20px",
  borderRight: "1px solid #606060",
  height: "calc(100dvh - 70px)",
  backgroundColor: "#2b2727",
  zIndex: 10,
});

const contentStyle = css({
  flex: 1,
  position: "relative",
  minHeight: "calc(100dvh - 70px)",
});

const floatingButton = css({
  position: "fixed",
  bottom: "24px",
  left: "24px",
  padding: "12px 16px",
  borderRadius: "999px",
  background: "rgba(245,235,227,0.12)",
  border: "1px solid rgba(245,235,227,0.24)",
  color: "#f5ebe3",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  zIndex: 1100,
  backdropFilter: "blur(10px)",
});

const drawerOverlay = css({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "stretch",
  zIndex: 2000,
  opacity: 0,
  pointerEvents: "none",
  transition: "opacity 0.25s ease",
  '&[data-open="true"]': {
    opacity: 1,
    pointerEvents: "auto",
  },
});

const drawerBackdrop = css({
  flex: 1,
  order: 2,
});

const drawerPanel = css({
  width: "min(320px, 90vw)",
  background: "#2b2727",
  borderRight: "1px solid rgba(245,235,227,0.12)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
  height: "100%",
  boxShadow: "12px 0 28px rgba(0,0,0,0.35)",
  order: 1,
  transform: "translateX(-100%)",
  transition: "transform 0.25s ease",
  '&[data-open="true"]': {
    transform: "translateX(0)",
  },
});

const drawerHeader = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  color: "#f5ebe3",
});

const closeButton = css({
  background: "transparent",
  border: "none",
  color: "inherit",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "13px",
  padding: "6px 10px",
  borderRadius: "8px",
  transition: "background 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.12)",
  },
});

export const ClientLayout = ({ children }: ClientLayoutProps) => {
  const { connectedDevice, connect, disconnect } = useHID();
  const { keymapCollection, setKeymapCollection } = useKeymap();
  const pathname = usePathname() ?? "";

  const [isCompact, setIsCompact] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleConfigChange = useCallback(
    (updater: (prev: KeymapConfig) => KeymapConfig) => {
      setKeymapCollection((prev) => ({
        ...prev,
        config: updater(prev.config),
      }));
    },
    [setKeymapCollection]
  );

  const isShareView = pathname.startsWith("/keymap/share");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 950px)");
    const update = () => {
      const compact = media.matches;
      setIsCompact(compact);
      if (!compact) {
        setDrawerOpen(false);
      }
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  const sidePanel = (
    <DeviceCard
      keymapCollection={keymapCollection}
      connectedDevice={connectedDevice}
      connect={connect}
      disconnect={disconnect}
      config={keymapCollection.config}
      onConfigChange={handleConfigChange}
      configDisabled={isShareView}
    />
  );

  return (
    <div className={layoutStyle}>
      {!isCompact && <div className={sidePanelStyle}>{sidePanel}</div>}
      <div className={contentStyle}>
        {children}
        {isCompact && (
          <button className={floatingButton} onClick={() => setDrawerOpen(true)}>
            <PanelLeftOpen size={18} /> デバイス
          </button>
        )}
      </div>

      {isCompact && (
        <div
          className={drawerOverlay}
          data-open={drawerOpen}
          role="dialog"
          aria-modal="true"
        >
          <div className={drawerBackdrop} onClick={() => setDrawerOpen(false)} />
          <div className={drawerPanel} data-open={drawerOpen}>
            <div className={drawerHeader}>
              <h2 className={css({ fontSize: "18px", fontWeight: "700" })}>
                デバイス
              </h2>
              <button className={closeButton} onClick={() => setDrawerOpen(false)}>
                <X size={16} /> 閉じる
              </button>
            </div>
            {sidePanel}
          </div>
        </div>
      )}
    </div>
  );
};
