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

const inputKeyThumbStyle = css({
  width: "100px",
  height: "40px",
  margin: "5px",
  padding: "5px",
  textAlign: "center",
  backgroundColor: "#f0f0f0",
  color: "#333",
  border: "none",
  borderRadius: "20px",
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

const trackBallStyle = css({
  width: "200px",
  height: "200px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle at 30% 30%, #b13d57, #932e44 40%, #7a2639 70%, #611e2e 100%)",
  boxShadow: "0 0 20px rgba(0,0,0,0.3)",
});
interface DeviceProps {
  pageKinds: "new" | "edit" | "share";
  keymapCollection: KeymapCollection;
  setKeymapCollection: React.Dispatch<React.SetStateAction<KeymapCollection>>;
  activeLayer: 1 | 2 | 3;
  setActiveLayer: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

function getActiveLayerKeymap(
  collection: KeymapCollection,
  layer: 1 | 2 | 3
): KeymapType {
  if (layer === 1) return collection.rayer1;
  if (layer === 2) return collection.rayer2;
  if (layer === 3) return collection.rayer3;
  return collection.rayer1;
}

function updateActiveLayerKeymap(
  collection: KeymapCollection,
  layer: 1 | 2 | 3,
  newLayerState: KeymapType
): KeymapCollection {
  if (layer === 1) {
    return { ...collection, rayer1: newLayerState };
  } else if (layer === 2) {
    return { ...collection, rayer2: newLayerState };
  } else {
    return { ...collection, rayer3: newLayerState };
  }
}

const Device: React.FC<DeviceProps> = ({
  pageKinds,
  keymapCollection,
  setKeymapCollection,
  activeLayer,
  setActiveLayer,
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
          gap: "1rem",
          marginBottom: "1rem",
          justifyContent: "center",
        })}
      >
        <button
          onClick={() => setActiveLayer(1)}
          disabled={activeLayer === 1}
          className={css({
            padding: "0.5rem 1rem",
            backgroundColor: activeLayer === 1 ? "teal.500" : "gray.600",
            borderRadius: "0.25rem",
            color: "white",
            cursor: "pointer",
          })}
        >
          Layer 1
        </button>
        <button
          onClick={() => setActiveLayer(2)}
          disabled={activeLayer === 2}
          className={css({
            padding: "0.5rem 1rem",
            backgroundColor: activeLayer === 2 ? "teal.500" : "gray.600",
            borderRadius: "0.25rem",
            color: "white",
            cursor: "pointer",
          })}
        >
          Layer 2
        </button>
        <button
          onClick={() => setActiveLayer(3)}
          disabled={activeLayer === 3}
          className={css({
            padding: "0.5rem 1rem",
            backgroundColor: activeLayer === 3 ? "teal.500" : "gray.600",
            borderRadius: "0.25rem",
            color: "white",
            cursor: "pointer",
          })}
        >
          Layer 3
        </button>
      </div>
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
          {(["column4", "column3", "column2", "column1"] as const).map(
            (column) => (
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
            )
          )}
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
            <input
              type="text"
              value={getDisplayValue(tempState.thumbKey1)}
              onKeyDown={(e) => handleThumbKey1Change(handleKeyDown(e))}
              className={inputKeyThumbStyle}
              readOnly
            />
          </div>
          <div>
            <input
              type="text"
              value={getDisplayValue(tempState.thumbKey2)}
              onKeyDown={(e) => handleThumbKey2Change(handleKeyDown(e))}
              className={inputKeyThumbStyle}
              readOnly
            />
          </div>
          <div>
            <input
              type="text"
              value={getDisplayValue(tempState.monitorKey)}
              onKeyDown={(e) => handleMonitorKeyChange(handleKeyDown(e))}
              className={inputKeyThumbStyle}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Device;
