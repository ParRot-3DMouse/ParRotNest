import { Key, KeyColumn, KeymapType, UniqueKey } from "../lib/device/types";
import { useDrop } from "react-dnd";
import { css } from "../../styled-system/css";

const inputKeyStyle = css({
  width: "60px",
  height: "60px",
  margin: "5px",
  padding: "5px",
  textAlign: "center",
  backgroundColor: "#f0f0f0",
  color: "#333",
  border: "none",
  borderRadius: "5px",
  boxShadow: "0 4px 0 #999, 0 5px 5px rgba(0,0,0,0.3)",
  fontWeight: "bold",
  fontSize: "16px",
  transition: "all 0.1s",
  cursor: "pointer",
  "&:active": {
    boxShadow: "0 1px 0 #999",
    transform: "translateY(3px)",
  },
  "&:focus": {
    outline: "none",
    backgroundColor: "#e0e0e0",
  },
});

interface DraggableKeyProps {
  keyValue: Key;
  col: keyof Omit<KeymapType, "thumbKey1" | "thumbKey2" | "monitorKey">;
  row: keyof KeyColumn;
  handleInputChange: (
    col: keyof Omit<KeymapType, "thumbKey1" | "thumbKey2" | "monitorKey">,
    key: keyof KeyColumn,
    value: Key
  ) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => Key;
  getDisplayValue: (key: Key) => string;
}

export const DraggableKey: React.FC<DraggableKeyProps> = ({
  keyValue,
  row,
  col,
  handleInputChange,
  handleKeyDown,
  getDisplayValue,
}) => {
  const [, drop] = useDrop({
    accept: "uniqueKey",
    drop: (item: { uniqueKey: UniqueKey }) => {
      handleInputChange(col, row, {
        type: "custom",
        uniqueKey: item.uniqueKey,
      });
    },
  });

  const dropRef = (node: HTMLInputElement | null) => {
    drop(node);
  };

  return (
    <input
      ref={dropRef}
      type="text"
      value={getDisplayValue(keyValue)}
      onKeyDown={(e) => handleInputChange(col, row, handleKeyDown(e))}
      readOnly
      className={inputKeyStyle}
    />
  );
};
