import { Key, KeyColumn, KeymapType, UniqueKey } from "../lib/device/types";
import { useDrop } from "react-dnd";

interface DraggableKeyPropsBase {
  className: string;
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
  className,
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
      className={className}
    />
  );
};
