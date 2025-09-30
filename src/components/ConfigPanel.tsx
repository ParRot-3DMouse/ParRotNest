"use client";

import { css } from "../../styled-system/css";
import type { KeymapConfig } from "../lib/device/types";

const panel = css({
  backgroundColor: "rgba(245,235,227,0.05)",
  borderRadius: "16px",
  padding: "20px",
  border: "1px solid rgba(245,235,227,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  minWidth: "280px",
});

const sectionTitle = css({
  fontSize: "15px",
  fontWeight: "600",
  color: "#f5ebe3",
});

const toggleGroup = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const toggleButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "rgba(177,61,87,0.12)",
  border: "1px solid transparent",
  borderRadius: "10px",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
  color: "#f5ebe3",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(177,61,87,0.2)",
  },
  _active: {
    transform: "translateY(1px)",
  },
});

const toggleInactive = css({
  background: "rgba(245,235,227,0.05)",
  color: "rgba(245,235,227,0.7)",
  borderColor: "rgba(245,235,227,0.08)",
});

const toggleIndicator = css({
  width: "34px",
  height: "18px",
  borderRadius: "999px",
  background: "rgba(245,235,227,0.2)",
  position: "relative",
  transition: "all 0.12s ease",
});

const toggleIndicatorActive = css({
  background: "rgba(177,61,87,0.8)",
});

const toggleHandle = css({
  position: "absolute",
  top: "2px",
  left: "2px",
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  background: "#2b2727",
  transition: "transform 0.12s ease",
});

const toggleHandleActive = css({
  transform: "translateX(16px)",
  background: "#f5ebe3",
});

const inputGrid = css({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "12px",
});

const numberInput = css({
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid rgba(245,235,227,0.1)",
  background: "rgba(245,235,227,0.05)",
  color: "#f5ebe3",
  fontSize: "13px",
  fontVariantNumeric: "tabular-nums",
  outline: "none",
  transition: "border 0.12s ease",
  _focus: {
    borderColor: "rgba(177,61,87,0.6)",
    boxShadow: "0 0 0 1px rgba(177,61,87,0.4)",
  },
});

const label = css({
  fontSize: "12px",
  color: "rgba(245,235,227,0.7)",
  marginBottom: "6px",
});

interface ConfigPanelProps {
  config: KeymapConfig;
  onConfigChange: (updater: (prev: KeymapConfig) => KeymapConfig) => void;
  disabled?: boolean;
}

const flipItems: { key: keyof KeymapConfig; label: string }[] = [
  { key: "xFlip", label: "X 反転" },
  { key: "yFlip", label: "Y 反転" },
  { key: "zFlip", label: "Z 反転" },
];

const mirrorItems: { key: keyof KeymapConfig; label: string }[] = [
  { key: "xMirror", label: "X 平行反転" },
  { key: "yMirror", label: "Y 平行反転" },
  { key: "zMirror", label: "Z 平行反転" },
];

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onConfigChange,
  disabled = false,
}) => {
  const setToggle = (key: keyof KeymapConfig) => {
    if (disabled) return;
    onConfigChange((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setDpi = (key: "dpiSlot1" | "dpiSlot2" | "dpiSlot3", value: string) => {
    if (disabled) return;
    const parsed = Number(value);
    onConfigChange((prev) => ({
      ...prev,
      [key]: Number.isFinite(parsed) ? parsed : prev[key],
    }));
  };

  return (
    <aside className={panel}>
      <div>
        <h3 className={sectionTitle}>軸反転</h3>
        <div className={toggleGroup}>
          {flipItems.map((item) => {
            const active = !!config[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setToggle(item.key)}
                className={`${toggleButton} ${!active ? toggleInactive : ""}`}
                aria-pressed={active}
                aria-disabled={disabled}
                disabled={disabled}
              >
                <span>{item.label}</span>
                <span className={`${toggleIndicator} ${active ? toggleIndicatorActive : ""}`}>
                  <span className={`${toggleHandle} ${active ? toggleHandleActive : ""}`} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={sectionTitle}>平行反転</h3>
        <div className={toggleGroup}>
          {mirrorItems.map((item) => {
            const active = !!config[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setToggle(item.key)}
                className={`${toggleButton} ${!active ? toggleInactive : ""}`}
                aria-pressed={active}
                aria-disabled={disabled}
                disabled={disabled}
              >
                <span>{item.label}</span>
                <span className={`${toggleIndicator} ${active ? toggleIndicatorActive : ""}`}>
                  <span className={`${toggleHandle} ${active ? toggleHandleActive : ""}`} />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className={sectionTitle}>DPI スロット</h3>
        <div className={inputGrid}>
          {([
            { label: "Slot 1", key: "dpiSlot1" },
            { label: "Slot 2", key: "dpiSlot2" },
            { label: "Slot 3", key: "dpiSlot3" },
          ] as const).map(({ label: slotLabel, key }) => (
            <div key={key}>
              <p className={label}>{slotLabel}</p>
              <input
                type="number"
                min={0}
                max={65535}
                className={numberInput}
                value={config[key] ?? 0}
                onChange={(event) => setDpi(key, event.target.value)}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
