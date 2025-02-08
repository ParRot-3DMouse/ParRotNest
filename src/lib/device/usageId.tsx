import { Key, KeyboardInput, ModifierKey, UniqueKey } from "./types";

export type Uint8 = number & { __brand: "uint8" };
export type Uint16 = [Uint8, Uint8];

// HID Usage ID を返す関数
export function getCharacterUsageID(key: KeyboardInput): Uint8 {
  const usageIDMap: { [K in KeyboardInput]: number } = {
    // ModifierKeys
    Shift: 0xe1, // Left Shift
    Ctrl: 0xe0, // Left Control
    Meta: 0xe3, // Left GUI
    Alt: 0xe2, // Left ALT
    Esc: 0x29,

    // AlphanumericKeys
    A: 0x04,
    B: 0x05,
    C: 0x06,
    D: 0x07,
    E: 0x08,
    F: 0x09,
    G: 0x0a,
    H: 0x0b,
    I: 0x0c,
    J: 0x0d,
    K: 0x0e,
    L: 0x0f,
    M: 0x10,
    N: 0x11,
    O: 0x12,
    P: 0x13,
    Q: 0x14,
    R: 0x15,
    S: 0x16,
    T: 0x17,
    U: 0x18,
    V: 0x19,
    W: 0x1a,
    X: 0x1b,
    Y: 0x1c,
    Z: 0x1d,
    1: 0x1e,
    2: 0x1f,
    3: 0x20,
    4: 0x21,
    5: 0x22,
    6: 0x23,
    7: 0x24,
    8: 0x25,
    9: 0x26,
    0: 0x27,

    // FunctionKeys
    F1: 0x3a,
    F2: 0x3b,
    F3: 0x3c,
    F4: 0x3d,
    F5: 0x3e,
    F6: 0x3f,
    F7: 0x40,
    F8: 0x41,
    F9: 0x42,
    F10: 0x43,
    F11: 0x44,
    F12: 0x45,

    // SpecialKeys
    Enter: 0x28,
    Backspace: 0x2a,
    Tab: 0x2b,
    Space: 0x2c,
    CapsLock: 0x39,
    Delete: 0x4c,
    Home: 0x4a,
    End: 0x4d,
    PageUp: 0x4b,
    PageDown: 0x4e,
    Left: 0x50,
    Right: 0x4f,
    Up: 0x52,
    Down: 0x51,

    // 空文字列のケース
    "": 0x00,
  };

  const usageID = usageIDMap[key] || 0x00;

  return usageID as Uint8;
}

export function getModifierUsageID(keys: ModifierKey[]): Uint8 {
  const modifierBitMap: { [K in ModifierKey]: number } = {
    Ctrl: 0x01,
    Shift: 0x02,
    Alt: 0x04,
    Meta: 0x08,
  };

  const uniqueKeys = Array.from(new Set(keys));
  const modifierByte = uniqueKeys.reduce((acc, key) => {
    return acc | modifierBitMap[key];
  }, 0x00);

  return modifierByte as Uint8;
}

export function getUniqueKeyUsageID(uniqueKey: UniqueKey): Uint8 {
  const usageIDMap: { [K in UniqueKey]: number } = {
    "MOVEMENT MODE TOGGLE": 0x11,
    "MOVEMENT MODE HOLD": 0x12,

    "DPI CYCLE": 0x22,

    "LAYER CYCLE": 0x33,
    "LAYER HOLD 1": 0x34,
    "LAYER HOLD 2": 0x35,
    "LAYER HOLD 3": 0x36,

    "SLOT CYCLE": 0x44,

    "AXIS LOCK X": 0x51,
    "AXIS LOCK Y": 0x52,
    "AXIS LOCK Z": 0x53,

    "AXIS LOCK X HOLD": 0x54,
    "AXIS LOCK Y HOLD": 0x55,
    "AXIS LOCK Z HOLD": 0x56,
  };

  const usageID = usageIDMap[uniqueKey] || 0x00;

  console.log("uniqueKey", uniqueKey);
  console.log("usageIDMap", usageIDMap[uniqueKey]);
  console.log("usageID", usageID);

  return usageID as Uint8;
}

export function getKeyUsageID(key: Key): Uint16 {
  if (key.type === "custom") {
    const upperID = getUniqueKeyUsageID(key.uniqueKey);
    return [upperID, 0x00 as Uint8];
  } else if (key.type === "standard") {
    const modifierID = getModifierUsageID(key.modifiers);
    const characterID = getCharacterUsageID(key.character);
    return [modifierID, characterID];
  } else {
    throw new Error("Invalid key type");
  }
}
