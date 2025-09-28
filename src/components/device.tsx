import React, { useCallback } from "react";
import { css } from "../../styled-system/css";
import {
  Key,
  KeyColumn,
  KeymapCollection,
  KeymapType,
  KeyboardInput,
  ModifierKey,
  StandardKey,
  isValidKey,
} from "../lib/device/types";
import { DraggableKey } from "./DraggableKeyInput";

const trackBallStyle = css({
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 30% 30%, #b13d57, #932e44 40%, #7a2639 70%, #611e2e 100%)",
  boxShadow: "0 0 20px rgba(0,0,0,0.3)",
  '@media (max-width: 1050px)': {
    width: "170px",
    height: "170px",
  },
  '@media (max-width: 820px)': {
    width: "150px",
    height: "150px",
  },
});

const inputKeyStyle = css({
  width: "72px",
  height: "72px",
  margin: "6px",
  padding: "8px",
  borderRadius: "14px",
  border: "1px solid rgba(245,235,227,0.14)",
  backgroundColor: "rgba(245,235,227,0.08)",
  color: "#f5ebe3",
  fontWeight: "600",
  fontSize: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  cursor: "pointer",
  transition: "background 0.12s ease, border 0.12s ease, transform 0.12s ease",
  boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
  _hover: {
    backgroundColor: "rgba(245,235,227,0.18)",
    borderColor: "rgba(245,235,227,0.28)",
  },
  _active: {
    transform: "translateY(1px)",
    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
  },
  _focus: {
    outline: "none",
    borderColor: "rgba(177,61,87,0.6)",
    boxShadow: "0 0 0 2px rgba(177,61,87,0.35)",
  },
  '@media (max-width: 1050px)': {
    width: "62px",
    height: "62px",
    fontSize: "13px",
  },
  '@media (max-width: 820px)': {
    width: "54px",
    height: "54px",
    fontSize: "12px",
  },
});

interface DeviceProps {
  pageKinds: "new" | "edit" | "share";
  keymapCollection: KeymapCollection;
  setKeymapCollection: React.Dispatch<React.SetStateAction<KeymapCollection>>;
  activeLayer: 1 | 2 | 3;
}

function getActiveLayerKeymap(
  collection: KeymapCollection,
  layer: 1 | 2 | 3
): KeymapType {
  if (layer === 1) return collection.layer1;
  if (layer === 2) return collection.layer2;
  if (layer === 3) return collection.layer3;
  return collection.layer1;
}

function updateActiveLayerKeymap(
  collection: KeymapCollection,
  layer: 1 | 2 | 3,
  newLayerState: KeymapType
): KeymapCollection {
  if (layer === 1) {
    return { ...collection, layer1: newLayerState };
  } else if (layer === 2) {
    return { ...collection, layer2: newLayerState };
  } else {
    return { ...collection, layer3: newLayerState };
  }
}

const Device: React.FC<DeviceProps> = ({
  pageKinds,
  keymapCollection,
  setKeymapCollection,
  activeLayer,
}) => {
  const tempState: KeymapType = getActiveLayerKeymap(
    keymapCollection,
    activeLayer
  );
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): StandardKey => {
      e.preventDefault();
      const modifiers: ModifierKey[] = [];
      let character: KeyboardInput = "";

      // 最初に押されたキーを取得
      const pressedKey = e.key;

      // モディファイアキーの処理
      if (e.ctrlKey && pressedKey !== "Control") modifiers.push("Ctrl");
      if (e.altKey && pressedKey !== "Alt") modifiers.push("Alt");
      if (e.shiftKey && pressedKey !== "Shift") modifiers.push("Shift");
      if (e.metaKey && pressedKey !== "Meta") modifiers.push("Meta");

      // キーの判定
      if (pressedKey.length === 1) {
        // 単一文字キー
        character = pressedKey.toUpperCase() as KeyboardInput;
      } else {
        switch (pressedKey) {
          case "Control":
            character = "Ctrl";
            break;
          case "Alt":
            character = "Alt";
            break;
          case "Shift":
            character = "Shift";
            break;
          case "Meta":
            character = "Meta";
            break;
          case " ":
            character = "Space";
            break;
          case "Escape":
            character = "Esc";
            break;
          case "ArrowRight":
            character = "Right";
            break;
          case "ArrowLeft":
            character = "Left";
            break;
          case "ArrowUp":
            character = "Up";
            break;
          case "ArrowDown":
            character = "Down";
            break;
          default:
            if (isValidKey(pressedKey)) {
              character = pressedKey as KeyboardInput;
            } else {
              character = "";
            }
        }
      }

      const uniqueModifiers = Array.from(new Set(modifiers)); // 重複を削除

      return { type: "standard", modifiers: uniqueModifiers, character };
    },
    []
  );

  // Key型の値を表示用の文字列に変換する関数
  const getDisplayValue = (key: Key): string => {
    if (!key) return "No Key";
    if (typeof key !== "object") return String(key);

    if (key.type === "custom") {
      return `${key.uniqueKey}`;
    } else if (key.type === "standard") {
      const modifierStr = Array.isArray(key.modifiers)
        ? key.modifiers.join("+")
        : "";
      const characterStr = key.character || "";

      return modifierStr ? `${modifierStr}+${characterStr}` : characterStr;
    } else {
      return "No Key";
    }
  };

  const setLayerState = (newLayerState: KeymapType) => {
    setKeymapCollection((prev) =>
      updateActiveLayerKeymap(prev, activeLayer, newLayerState)
    );
  };

  const handleInputChange = (
    col: keyof Omit<KeymapType, "thumbKey1" | "thumbKey2" | "monitorKey">,
    row: keyof KeyColumn,
    value: Key
  ) => {
    const newLayerState: KeymapType = {
      ...tempState,
      [col]: {
        ...tempState[col],
        [row]: value,
      },
    };

    setLayerState(newLayerState);
  };

  const handleThumbKey1Change = (value: Key) => {
    setLayerState({
      ...tempState,
      thumbKey1: value,
    });
  };

  const handleThumbKey2Change = (value: Key) => {
    setLayerState({
      ...tempState,
      thumbKey2: value,
    });
  };

  const handleMonitorKeyChange = (value: Key) => {
    setLayerState({
      ...tempState,
      monitorKey: value,
    });
  };
  // キーコンポーネント
  const renderKeyInputs = (
    column: keyof Omit<KeymapType, "thumbKey1" | "thumbKey2" | "monitorKey">
  ) => {
    if (!tempState[column]) {
      throw new Error(`tempState does not contain the expected key: ${column}`);
    }

    return (Object.keys(tempState[column]) as Array<keyof KeyColumn>).map(
      (key) => {
        const keyValue = tempState[column][key];
        return (
          <DraggableKey
            className={inputKeyStyle}
            key={`${column}-${key}`}
            keyValue={keyValue}
            row={key}
            col={column}
            handleInputChange={handleInputChange}
            handleKeyDown={handleKeyDown}
            getDisplayValue={getDisplayValue}
            pageKinds={pageKinds}
          />
        );
      }
    );
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          })}
        >
          {(["column3", "column2", "column1"] as const).map((column) => (
            <div
              key={column}
              className={css({
                display: "flex",
                alignItems: "center",
              })}
            >
              <div
                className={css({
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                })}
              >
                {renderKeyInputs(column)}
              </div>
            </div>
          ))}
        </div>
        <div
          className={css({
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          })}
        >
          <div className={trackBallStyle}></div>
          <div>
            <DraggableKey
              className={`${inputKeyStyle} ${css({ width: "120px" })}`}
              keyValue={tempState.monitorKey}
              handleKeyDown={handleKeyDown}
              getDisplayValue={getDisplayValue}
              pageKinds={pageKinds}
              onKeyChange={handleMonitorKeyChange}
            />
          </div>
        </div>
        <div>
          <div>
            <DraggableKey
              className={inputKeyStyle}
              keyValue={tempState.thumbKey1}
              handleKeyDown={handleKeyDown}
              getDisplayValue={getDisplayValue}
              pageKinds={pageKinds}
              onKeyChange={handleThumbKey1Change}
            />
          </div>
          <div>
            <DraggableKey
              className={inputKeyStyle}
              keyValue={tempState.thumbKey2}
              handleKeyDown={handleKeyDown}
              getDisplayValue={getDisplayValue}
              pageKinds={pageKinds}
              onKeyChange={handleThumbKey2Change}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Device;
