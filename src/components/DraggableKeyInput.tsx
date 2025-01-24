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
interface DraggableKeyPropsBase {
  keyValue: Key;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => Key;
  getDisplayValue: (key: Key) => string;
  pageKinds: "new" | "edit" | "share";
}

interface DraggableKeyPropsRegular extends DraggableKeyPropsBase {
  col: keyof Omit<KeymapType, "thumbKey1" | "thumbKey2" | "monitorKey">;
  row: keyof KeyColumn;
  handleInputChange: (
    col: keyof Omit<KeymapType, "thumbKey1" | "thumbKey2" | "monitorKey">,
    key: keyof KeyColumn,
    value: Key
  ) => void;
  onKeyChange?: never;
}

interface DraggableKeyPropsSubKey extends DraggableKeyPropsBase {
  col?: never;
  row?: never;
  handleInputChange?: never;
  onKeyChange: (newKey: Key) => void;
}
type DraggableKeyProps = DraggableKeyPropsRegular | DraggableKeyPropsSubKey;

export const DraggableKey: React.FC<DraggableKeyProps> = ({
  keyValue,
  row,
  col,
  handleInputChange,
  handleKeyDown,
  getDisplayValue,
  pageKinds,
  onKeyChange,
}) => {
  const [, drop] = useDrop({
    accept: "uniqueKey",
    drop: (item: { uniqueKey: UniqueKey }) => {
      if (!(pageKinds === "share")) {
        const newKey: Key = {
          type: "custom",
          uniqueKey: item.uniqueKey,
        };

        if (handleInputChange) {
          handleInputChange(col, row, newKey);
        } else if (onKeyChange) {
          onKeyChange(newKey);
        }
      }
    },
    canDrop: () => pageKinds !== "share",
  });

  const dropRef = (node: HTMLInputElement | null) => {
    if (!(pageKinds === "share")) {
      drop(node);
    }
  };

  return (
    <input
      ref={dropRef}
      type="text"
      value={getDisplayValue(keyValue)}
      onKeyDown={(e) => {
        if (!(pageKinds === "share")) {
          if (handleInputChange) {
            handleInputChange(col, row, handleKeyDown(e));
          } else if (onKeyChange) {
            onKeyChange(handleKeyDown(e));
          }
        }
      }}
      readOnly
      className={inputKeyStyle}
    />
  );
};
