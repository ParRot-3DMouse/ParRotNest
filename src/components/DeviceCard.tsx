"use client";

import { useEffect, useRef, useState } from "react";
import { css } from "../../styled-system/css";
import { sendKeymapCollection } from "../lib/device/hid";
import type { KeymapCollection, KeymapConfig } from "../lib/device/types";
import { ConfigPanel } from "./ConfigPanel";
import { Usb, ChevronDown } from "lucide-react";

const containerStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const devicePanel = css({
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.12)",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  color: "#f5ebe3",
});

const headerRow = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
});

const headerContent = css({
  display: "flex",
  gap: "12px",
  alignItems: "center",
});

const iconBox = css({
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  background: "rgba(177,61,87,0.16)",
  display: "grid",
  placeItems: "center",
  color: "#f5ebe3",
});

const cardTitle = css({
  fontSize: "16px",
  fontWeight: "600",
});

const statusBadge = css({
  fontSize: "12px",
  fontWeight: "600",
  padding: "4px 12px",
  borderRadius: "999px",
  letterSpacing: "0.01em",
  background: "rgba(245,235,227,0.06)",
  borderColor: "rgba(245,235,227,0.16)",
  color: "rgba(245,235,227,0.65)",
  border: "1px solid",
});

const deviceInfo = css({
  display: "flex",
  flexDirection: "column",
  gap: "6px",
});

const deviceName = css({
  fontSize: "15px",
  fontWeight: "600",
});

const deviceMeta = css({
  fontSize: "12px",
  color: "rgba(245,235,227,0.65)",
  fontFamily:
    "ui-monospace, SFMono-Regular, SFMono, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
});

const helperText = css({
  fontSize: "13px",
  lineHeight: "1.6",
  color: "rgba(245,235,227,0.7)",
});

const buttonRowSingle = css({
  display: "flex",
  justifyContent: "flex-end",
});

const buttonRowConnected = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "12px",
  flexWrap: "nowrap",
  "@media (max-width: 540px)": {
    justifyContent: "stretch",
    gap: "10px",
    flexDirection: "column",
    alignItems: "stretch",
    flexWrap: "nowrap",
  },
});

const buttonBase = css({
  border: "none",
  borderRadius: "12px",
  padding: "10px 18px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  color: "#f5ebe3",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  flexShrink: 0,
  transition:
    "transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease",
  _hover: {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
  },
  _active: {
    transform: "translateY(0)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.22)",
  },
  _disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
});

const primaryButton = css({
  background: "linear-gradient(135deg, #177b3a 0%, #1d9454 100%)",
});

const dangerButton = css({
  background: "rgba(177,61,87,0.2)",
  border: "1px solid rgba(177,61,87,0.45)",
});

const splitButtonContainer = css({
  position: "relative",
  display: "inline-flex",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid rgba(23,123,58,0.35)",
  background: "rgba(23,123,58,0.15)",
  whiteSpace: "nowrap",
  flexShrink: 0,
});

const splitMainButton = css({
  border: "none",
  background: "linear-gradient(135deg, #177b3a 0%, #1d9454 100%)",
  color: "#f5ebe3",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 20px",
  cursor: "pointer",
  transition: "background 0.12s ease",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  whiteSpace: "nowrap",
  _hover: {
    background: "linear-gradient(135deg, #1d9454 0%, #23ac63 100%)",
  },
});

const splitToggleButton = css({
  border: "none",
  background: "rgba(23,123,58,0.16)",
  color: "#f5ebe3",
  padding: "0 14px",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
  transition: "background 0.12s ease",
  flexShrink: 0,
  _hover: {
    background: "rgba(23,123,58,0.25)",
  },
});

const dropdownMenu = css({
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  minWidth: "140px",
  background: "#2b2727",
  border: "1px solid rgba(245,235,227,0.12)",
  borderRadius: "12px",
  boxShadow: "0 24px 48px rgba(0,0,0,0.5)",
  padding: "6px",
  zIndex: 20,
});

const dropdownItem = css({
  width: "100%",
  border: "none",
  background: "transparent",
  color: "#f5ebe3",
  fontSize: "13px",
  fontWeight: "500",
  padding: "8px 10px",
  borderRadius: "8px",
  textAlign: "left",
  cursor: "pointer",
  transition: "background 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.08)",
  },
});

const dropdownItemActive = css({
  background: "rgba(23,123,58,0.25)",
  color: "#a5f0c1",
});

// ── スプリットボタンコンポーネント ──
interface WriteButtonWithSlotProps {
  selectedSlot: 1 | 2 | 3;
  setSelectedSlot: (slot: 1 | 2 | 3) => void;
  onWrite: () => void;
}

const WriteButtonWithSlot = ({
  selectedSlot,
  setSelectedSlot,
  onWrite,
}: WriteButtonWithSlotProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  const handleSelect = (slot: 1 | 2 | 3) => {
    setSelectedSlot(slot);
    setIsDropdownOpen(false);
  };

  // コンポーネント外をクリックした場合、ドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={splitButtonContainer}>
      <button type="button" className={splitMainButton} onClick={onWrite}>
        Write (Slot {selectedSlot})
      </button>
      <button
        type="button"
        className={splitToggleButton}
        aria-haspopup="menu"
        aria-expanded={isDropdownOpen}
        onClick={toggleDropdown}
      >
        <ChevronDown size={16} />
      </button>
      {isDropdownOpen && (
        <div className={dropdownMenu} role="menu">
          {[1, 2, 3].map((slot) => {
            const typedSlot = slot as 1 | 2 | 3;
            const isActive = selectedSlot === typedSlot;
            return (
              <button
                key={slot}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                className={`${dropdownItem} ${isActive ? dropdownItemActive : ""}`}
                onClick={() => handleSelect(typedSlot)}
              >
                Slot {slot}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const DeviceCard = ({
  keymapCollection,
  connectedDevice,
  connect,
  disconnect,
  config,
  onConfigChange,
  configDisabled = false,
}: {
  keymapCollection: KeymapCollection;
  connectedDevice: HIDDevice | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  config: KeymapConfig;
  onConfigChange: (updater: (prev: KeymapConfig) => KeymapConfig) => void;
  configDisabled?: boolean;
}) => {
  const [selectedSlot, setSelectedSlot] = useState<1 | 2 | 3>(1);
  const handleWrite = () => {
    if (!connectedDevice) return;
    sendKeymapCollection(keymapCollection, connectedDevice, selectedSlot);
  };

  const formatHex = (value: number) =>
    value.toString(16).toUpperCase().padStart(4, "0");

  return (
    <div className={containerStyle}>
      <div className={devicePanel}>
        <div className={headerRow}>
          <div className={headerContent}>
            <span className={iconBox}>
              <Usb size={20} />
            </span>
            <p className={cardTitle}>ParRot</p>
          </div>
        </div>

        {connectedDevice ? (
          <div className={deviceInfo}>
            <p className={deviceName}>{connectedDevice.productName}</p>
            <p className={deviceMeta}>
              VendorID: 0x{formatHex(connectedDevice.vendorId)}, ProductID: 0x
              {formatHex(connectedDevice.productId)}
            </p>
          </div>
        ) : (
          <p className={helperText}>ParRotをUSBで接続してください</p>
        )}

        {connectedDevice ? (
          <div className={buttonRowConnected}>
            <WriteButtonWithSlot
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
              onWrite={handleWrite}
            />
            <button
              type="button"
              onClick={disconnect}
              className={`${buttonBase} ${dangerButton}`}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div className={buttonRowSingle}>
            <button
              type="button"
              onClick={connect}
              className={`${buttonBase} ${primaryButton}`}
            >
              Connect
            </button>
          </div>
        )}
      </div>

      <ConfigPanel
        config={config}
        onConfigChange={onConfigChange}
        disabled={configDisabled}
      />
    </div>
  );
};
