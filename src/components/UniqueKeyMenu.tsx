import React from "react";
import { useDrag } from "react-dnd";
import { UniqueKey } from "../lib/device/types";

const uniqueKeys: UniqueKey[] = [
  "SWITCH_MOVEMENT",
  "DPI",
  "LAYER",
  "APP",
  "X_ONLY",
  "Y_ONLY",
  "Z_ONLY",
];

const UniqueKeyMenu: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {uniqueKeys.map((key) => (
        <DraggableKey key={key} uniqueKey={key} />
      ))}
    </div>
  );
};

const DraggableKey: React.FC<{ uniqueKey: UniqueKey }> = ({ uniqueKey }) => {
  const [, drag] = useDrag(() => ({
    type: "uniqueKey",
    item: { uniqueKey },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      style={{
        padding: "8px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      {uniqueKey}
    </div>
  );
};

export default UniqueKeyMenu;
