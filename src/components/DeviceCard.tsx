"use client";

import { useEffect, useRef, useState } from "react";
import { css } from "../../styled-system/css";
import { sendKeymapCollection } from "../lib/device/hid";
import { KeymapCollection } from "../lib/device/types";

const card = css({
  border: "1px solid",
  // borderColor: "gray.700",
  padding: "1rem",
  borderRadius: "0.5rem",
  // backgroundColor: "gray.800",
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  height: "fit-content",
});

const normal = css({
  fontSize: "0.875rem",
  // color: "gray.200",
});

const small = css({
  fontSize: "0.75rem",
  // color: "gray.400",
  fontFamily: "monospace",
});

const buttonGroup = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "4",
});

const dangerButton = css({
  // backgroundColor: "#611e2e",
  backgroundColor: "#b13d57",
  padding: "6px 12px",
  borderRadius: "0.375rem",
  fontSize: "14px",
  fontWeight: "500",
  _hover: {
    // backgroundColor: "red.700",
  },
  _active: {
    // backgroundColor: "red.800",
  },
  width: "fit-content",
  cursor: "pointer",
});

const primaryButton = css({
  backgroundColor: "#b13d57",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  borderRadius: "0.375rem",
  fontWeight: "500",
  _hover: {
    // backgroundColor: "blue.700",
  },
  width: "fit-content",
  marginLeft: "auto",
  marginRight: "auto",
  cursor: "pointer",
});

const splitButtonContainer = css({
  display: "inline-flex",
  position: "relative", // ドロップダウンメニューの絶対配置用
  borderRadius: "0.375rem",
  border: "1px solid #177b3a",
});

const mainButton = css({
  backgroundColor: "#177b3a",
  color: "#f5ebe3",
  padding: "6px 12px",
  border: "none",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.3s",
  _hover: {
    backgroundColor: "#1e8a50",
  },
  borderRight: "1px solid #1e8a50",
});

// ── ドロップダウントグル部分 ──
const dropdownToggle = css({
  backgroundColor: "#177b3a",
  color: "#f5ebe3",
  padding: "6px",
  border: "none",
  fontSize: "16px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.3s",
  // ホバー時の色調整
  _hover: {
    backgroundColor: "#1e8a50",
  },
});

// ── ドロップダウンメニュー（絶対配置） ──
const dropdownMenu = css({
  position: "absolute",
  top: "100%",
  right: 0,
  backgroundColor: "#606060",
  border: "1px solid #606060",
  borderRadius: "0.375rem",
  marginTop: "4px",
  zIndex: 10,
  minWidth: "100px",
  overflow: "hidden",
});

// ── ドロップダウンメニューの各項目 ──
const dropdownItem = css({
  padding: "8px 12px",
  backgroundColor: "#606060",
  color: "#f5ebe3",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "background-color 0.2s",
  _hover: {
    backgroundColor: "#1e8a50",
  },
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

  const toggleDropdown = (e: React.MouseEvent) => {
    console.log("toggleDropdown");
    e.stopPropagation(); // メインアクションと分離
    console.log("isDropdownOpen", isDropdownOpen);
    setIsDropdownOpen((prev) => !prev);
    console.log("isDropdownOpen", isDropdownOpen);
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
      {/* メインボタン */}
      <button className={mainButton} onClick={onWrite}>
        Write (Slot {selectedSlot})
      </button>
      {/* ドロップダウントグル */}
      <button className={dropdownToggle} onClick={toggleDropdown}>
        ▼
      </button>
      {/* ドロップダウンメニュー */}
      {isDropdownOpen && (
        <ul className={dropdownMenu}>
          {[1, 2, 3].map((slot) => (
            <li
              key={slot}
              className={dropdownItem}
              onClick={() => handleSelect(slot as 1 | 2 | 3)}
            >
              Slot {slot}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const DeviceCard = ({
  keymapCollection,
  connectedDevice,
  connect,
  disconnect,
}: {
  keymapCollection: KeymapCollection;
  connectedDevice: HIDDevice | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}) => {
  const [selectedSlot, setSelectedSlot] = useState<1 | 2 | 3>(1);
  const handleWrite = () => {
    sendKeymapCollection(keymapCollection, connectedDevice, selectedSlot);
  };

  return (
    <div>
      <div className={card}>
        <p className={normal}>Device</p>
        {connectedDevice ? (
          <>
            <p className={normal}>{connectedDevice.productName}</p>
            <p className={small}>
              VendorID: 0x{connectedDevice.vendorId.toString(16)}, ProductID: 0x
              {connectedDevice.productId.toString(16)}
            </p>
          </>
        ) : (
          <>
            <p className={normal}>No device connected</p>
          </>
        )}
      </div>
      {connectedDevice ? (
        <div className={buttonGroup}>
          <button onClick={disconnect} className={dangerButton}>
            Disconnect
          </button>
          <WriteButtonWithSlot
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
            onWrite={handleWrite}
          />
        </div>
      ) : (
        <div className={buttonGroup}>
          <button onClick={connect} className={primaryButton}>
            接続
          </button>
        </div>
      )}
    </div>
  );
};
