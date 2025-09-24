import React from "react";
import { useDrag } from "react-dnd";
import type { UniqueKey } from "../lib/device/types";
import { uniqueKeysByCategory } from "../lib/device/unique-keys";

// const uniqueKeys: UniqueKey[] = [
//   "MOVEMENT_MODE_TOGGLE",
//   "MOVEMENT_MODE_HOLD",
//   "DPI_CYCLE",
//   "LAYER_CYCLE",
//   "LAYER_HOLD_1",
//   "LAYER_HOLD_2",
//   "LAYER_HOLD_3",
//   "SLOT_CYCLE",
//   "AXIS_LOCK_X",
//   "AXIS_LOCK_Y",
//   "AXIS_LOCK_Z",
//   "AXIS_LOCK_X_HOLD",
//   "AXIS_LOCK_Y_HOLD",
//   "AXIS_LOCK_Z_HOLD",
// ];

export const uniqueKeyGroups = uniqueKeysByCategory;

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
        backgroundColor: "#f5ebe3",
        color: "#2b2727",
        border: "1px solid",
        borderRadius: "4px",
        cursor: "grab",
      }}
    >
      {uniqueKey}
    </div>
  );
};

// const UniqueKeyMenu: React.FC = () => {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//       {uniqueKeys.map((key) => (
//         <DraggableKey key={key} uniqueKey={key} />
//       ))}
//     </div>
//   );
// };
interface KeyMenuProps {
  keys: UniqueKey[];
}
export const KeyMenu: React.FC<KeyMenuProps> = ({ keys }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "13dvw",
        height: "200px",
        overflowY: "scroll",
      }}
    >
      {keys.map((key) => (
        <DraggableKey key={key} uniqueKey={key} />
      ))}
    </div>
  );
};
