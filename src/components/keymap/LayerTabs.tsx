import type { FC } from "react";
import { css } from "../../../styled-system/css";

const tabs = css({
  display: "inline-flex",
  marginTop: "12px",
  background: "rgba(245,235,227,0.06)",
  borderRadius: "12px",
  padding: "4px",
  border: "1px solid rgba(245,235,227,0.14)",
  gap: "8px",
  alignSelf: "flex-start",
});

const button = css({
  background: "transparent",
  color: "rgba(245,235,227,0.55)",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.18s ease",
  _hover: {
    color: "#f5ebe3",
  },
  _focusVisible: {
    outline: "none",
    boxShadow: "0 0 0 2px rgba(245,235,227,0.45)",
  },
});

const buttonActive = css({
  background:
    "linear-gradient(135deg, rgba(177,61,87,0.85) 0%, rgba(216,102,136,0.9) 100%)",
  color: "#fdf5f0",
  borderColor: "rgba(245,235,227,0.4)",
  boxShadow: "0 6px 18px rgba(177,61,87,0.24)",
});

export const layerLabels: Record<1 | 2 | 3, string> = {
  1: "Layer 1",
  2: "Layer 2",
  3: "Layer 3",
};

interface LayerTabsProps {
  activeLayer: 1 | 2 | 3;
  disabled?: boolean;
  onSelect: (layer: 1 | 2 | 3) => void;
}

export const LayerTabs: FC<LayerTabsProps> = ({
  activeLayer,
  disabled = false,
  onSelect,
}) => {
  return (
    <div className={tabs} role="tablist">
      {[1, 2, 3].map((layer) => {
        const typedLayer = layer as 1 | 2 | 3;
        const isActive = activeLayer === typedLayer;
        return (
          <button
            key={layer}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(typedLayer)}
            className={`${button} ${isActive ? buttonActive : ""}`}
            disabled={disabled && !isActive}
          >
            {layerLabels[typedLayer]}
          </button>
        );
      })}
    </div>
  );
};
