import { Key, KeyColumn, KeymapCollection, KeymapType } from "./types";
import { getKeyUsageID, Uint8 } from "./usageId";

export async function sendKeymapCollection(
  keymapCollection: KeymapCollection,
  connectedDevice: HIDDevice | null
): Promise<void> {
  console.log("connectedDevice", connectedDevice);
  if (!connectedDevice) {
    throw new Error("Device not connected");
  }

  try {
    const data = convertKeymapCollectionToBytes(keymapCollection);
    console.log("data", data);

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

export const convertKeymapToBytes = (keymap: KeymapType): Uint8Array => {
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
    const column1Bytes = processColumn(keymap.column1);
    const column2Bytes = processColumn(keymap.column2);
    const column3Bytes = processColumn(keymap.column3);
    const column4Bytes = processColumn(keymap.column4);
    const thumbKey1Byte = processKey(keymap.thumbKey1);
    const thumbKey2Byte = processKey(keymap.thumbKey2);
    const monitorKeyByte = processKey(keymap.monitorKey);

    // 全てのバイト配列を結合
    const allBytes = [
      ...thumbKey1Byte,
      ...thumbKey2Byte,
      ...monitorKeyByte,
      ...column1Bytes,
      ...column2Bytes,
      ...column3Bytes,
      ...column4Bytes,
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

export function convertKeymapCollectionToBytes(
  keymapCollection: KeymapCollection
): Uint8Array {
  const appNameBytes = stringToByteArray(keymapCollection.appName);
  // layer1 は必須
  const layer1Bytes = convertKeymapToBytes(keymapCollection.layer1);

  // layer2, layer3 は存在する場合のみ変換
  const layer2Bytes = keymapCollection.layer2
    ? convertKeymapToBytes(keymapCollection.layer2)
    : new Uint8Array(32);

  const layer3Bytes = keymapCollection.layer3
    ? convertKeymapToBytes(keymapCollection.layer3)
    : new Uint8Array(32);

  const totalSize = 96 + appNameBytes.length;

  const allBytes = new Uint8Array(totalSize);
  allBytes.set(layer1Bytes, 0); // 先頭0～31
  allBytes.set(layer2Bytes, 32); // 32～63
  allBytes.set(layer3Bytes, 64); // 64～95
  allBytes.set(appNameBytes, 96);

  return allBytes;
}

function stringToByteArray(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}
