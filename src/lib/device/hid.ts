"use client";

import { Key, KeyColumn, KeyMapCollection, KeyMapType } from "./types";
import { getKeyUsageID, Uint8 } from "./usageId";

let connectedDevice: HIDDevice | null = null;
/**
 * HIDデバイスに接続する
 */
export async function connectHIDDevice(): Promise<void> {
  try {
    const devices = await navigator.hid.requestDevice({
      filters: [
        {
          usagePage: 0x01,
        },
      ],
    });

    if (devices.length === 0) {
      throw new Error("No devices selected");
    }

    connectedDevice = devices[0];
    // 明示的にデバイスを開く
    if (!connectedDevice.opened) {
      await connectedDevice.open();
    }
  } catch (error) {
    console.error("Failed to connect device", error);
    throw error;
  }
}

/**
 * キーマップをデバイスに送信する
 * @param keyMap 送信するキーマップ
 */
export async function sendKeyMap(keyMap: KeyMapType): Promise<void> {
  if (!connectedDevice) {
    throw new Error("Device not connected");
  }

  try {
    // KeyMapTypeをバイト配列に変換
    const data = convertKeyMapToBytes(keyMap);

    if (!connectedDevice.opened) {
      await connectedDevice.open();
    }

    // レポートIDを0x05として送信
    await connectedDevice.sendReport(0x1f, data);
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      throw new Error(
        "デバイスへの書き込み権限がありません。デバイスを再接続してください。"
      );
    }
    console.error("Failed to send key map", error);
    throw error;
  }
}

export async function sendKeyMapCollection(
  keyMapCollection: KeyMapCollection
): Promise<void> {
  if (!connectedDevice) {
    throw new Error("Device not connected");
  }

  try {
    const data = convertKeyMapCollectionToBytes(keyMapCollection);

    if (!connectedDevice.opened) {
      await connectedDevice.open();
    }

    await connectedDevice.sendReport(0x1f, data);
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      throw new Error(
        "デバイスへの書き込み権限がありません。デバイスを再接続してください。"
      );
    }
    console.error("Failed to send key map", error);
    throw error;
  }
}

/**
 * HIDデバイスとの接続を切断する
 */
export async function disconnectHIDDevice(): Promise<void> {
  if (connectedDevice) {
    await connectedDevice.close();
    connectedDevice = null;
  }
}

/**
 * 現在接続されているデバイスを取得する
 * @returns 接続されているHIDデバイス、または未接続の場合はnull
 */
export function getConnectedDevice(): HIDDevice | null {
  return connectedDevice;
}
export const convertKeyMapToBytes = (keyMap: KeyMapType): Uint8Array => {
  const processKey = (key: Key): Uint8[] => {
    const [modifier, character] = getKeyUsageID(key);
    return [modifier, character];
  };

  const processColumn = (column: KeyColumn): Uint8[] => {
    return [
      ...processKey(column.key1),
      ...processKey(column.key2),
      ...processKey(column.key3),
    ];
  };

  try {
    const column1Bytes = processColumn(keyMap.column1);
    const column2Bytes = processColumn(keyMap.column2);
    const column3Bytes = processColumn(keyMap.column3);
    const column4Bytes = processColumn(keyMap.column4);
    const thumbKey1Byte = processKey(keyMap.thumbKey1);
    const thumbKey2Byte = processKey(keyMap.thumbKey2);
    const monitorKeyByte = processKey(keyMap.monitorKey);

    // 全てのバイト配列を結合
    const allBytes = [
      ...column1Bytes,
      ...column2Bytes,
      ...column3Bytes,
      ...column4Bytes,
      ...thumbKey1Byte,
      ...thumbKey2Byte,
      ...monitorKeyByte,
    ];

    const allBytesWithPrefix = [
      // 0x05,
      ...allBytes,
    ];

    const paddedBytes = new Uint8Array(32);
    paddedBytes.set(
      allBytesWithPrefix
      // .slice(0, 32)
    );

    return paddedBytes;
  } catch (error) {
    console.error("Error converting key map to bytes:", error);
    throw new Error("Failed to convert key map to bytes");
  }
};

export function convertKeyMapCollectionToBytes(
  keyMapCollection: KeyMapCollection
): Uint8Array {
  // rayer1 は必須
  const layer1Bytes = convertKeyMapToBytes(keyMapCollection.rayer1);

  // rayer2, rayer3 は存在する場合のみ変換
  const layer2Bytes = keyMapCollection.rayer2
    ? convertKeyMapToBytes(keyMapCollection.rayer2)
    : new Uint8Array(32);

  const layer3Bytes = keyMapCollection.rayer3
    ? convertKeyMapToBytes(keyMapCollection.rayer3)
    : new Uint8Array(32);

  // 結合 (1レイヤー=32バイト x 3レイヤー = 96バイト)
  const allBytes = new Uint8Array(96);
  allBytes.set(layer1Bytes, 0); // 先頭0～31
  allBytes.set(layer2Bytes, 32); // 32～63
  allBytes.set(layer3Bytes, 64); // 64～95

  return allBytes;
}
