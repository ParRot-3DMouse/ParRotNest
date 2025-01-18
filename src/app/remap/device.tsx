import React, { useCallback } from "react";
import { css } from "../../../styled-system/css";
import {
  Key,
  KeyColumn,
  KeyMapType,
  KeyboardInput,
  ModifierKey,
  StandardKey,
  isValidKey,
} from "../../lib/device/types";
import { DraggableKey } from "../../components/DraggableKeyInput";

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
  tempState: KeyMapType;
  handleInputChange: (
    col: keyof Omit<KeyMapType, "thumbKey1" | "thumbKey2" | "monitorKey">,
    row: keyof KeyColumn,
    value: Key
  ) => void;
  handleThumbKey1Change: (value: Key) => void;
  handleThumbKey2Change: (value: Key) => void;
  handleMonitorKeyChange: (value: Key) => void;
}

const Device = (params: DeviceProps) => {
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

  // キーコンポーネント
  const renderKeyInputs = (
    column: keyof Omit<KeyMapType, "thumbKey1" | "thumbKey2" | "monitorKey">
  ) => {
    return (
      Object.keys(params.tempState[column]) as Array<keyof KeyColumn>
    ).map((key) => {
      const keyValue = params.tempState[column][key];
      return (
        // <input
        //   key={`${row}-${key}`}
        //   type="text"
        //   value={getDisplayValue(keyValue)}
        //   onKeyDown={(e) =>
        //     params.handleInputChange(row, key, handleKeyDown(e))
        //   }
        //   readOnly
        //   className={inputKeyStyle}
        // />
        <DraggableKey
          key={`${column}-${key}`}
          keyValue={keyValue}
          row={key}
          col={column}
          handleInputChange={params.handleInputChange}
          handleKeyDown={handleKeyDown}
          getDisplayValue={getDisplayValue}
        />
      );
    });
  };

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

  return (
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
            value={getDisplayValue(params.tempState.thumbKey1)}
            onKeyDown={(e) => params.handleThumbKey1Change(handleKeyDown(e))}
            className={inputKeyThumbStyle}
            readOnly
          />
        </div>
        <div>
          <input
            type="text"
            value={getDisplayValue(params.tempState.thumbKey2)}
            onKeyDown={(e) => params.handleThumbKey2Change(handleKeyDown(e))}
            className={inputKeyThumbStyle}
            readOnly
          />
        </div>
        <div>
          <input
            type="text"
            value={getDisplayValue(params.tempState.monitorKey)}
            onKeyDown={(e) => params.handleMonitorKeyChange(handleKeyDown(e))}
            className={inputKeyThumbStyle}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default Device;
