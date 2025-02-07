import { Key, KeyColumn, KeymapCollection, KeymapType } from "./types";
import { getKeyUsageID, Uint8 } from "./usageId";

export async function sendKeymapCollection(
  keymapCollection: KeymapCollection,
  connectedDevice: HIDDevice | null,
  selectedSlot: 1 | 2 | 3
): Promise<void> {
  console.log("connectedDevice", connectedDevice);
  if (!connectedDevice) {
    throw new Error("Device not connected");
  }

  try {
    if (!connectedDevice.opened) {
      await connectedDevice.open();
    }

    let appNum: 0x00 | 0x01 | 0x02;

    switch (selectedSlot) {
      case 1:
        appNum = 0x00;
        break;
      case 2:
        appNum = 0x01;
        break;
      case 3:
        appNum = 0x02;
        break;
      default:
        throw new Error("Invalid slot number");
    }

    const appNameBytes = stringToByteArray(keymapCollection.appName, appNum);
    console.log("appNameBytes", appNameBytes);
    console.log("Byte length", appNameBytes.length);
    await connectedDevice.sendReport(0x1f, appNameBytes);
    console.log("App name sent");

    const layer1Bytes = convertKeymapToBytes(
      keymapCollection.layer1,
      appNum,
      0x00
    );
    console.log("layer1Bytes", layer1Bytes);
    console.log("layer1Bytes length", layer1Bytes.length);
    await connectedDevice.sendReport(0x1f, layer1Bytes);
    console.log("Layer 1 sent");

    const layer2Bytes = convertKeymapToBytes(
      keymapCollection.layer2,
      appNum,
      0x01
    );
    console.log("layer2Bytes", layer2Bytes);
    console.log("layer2Bytes length", layer2Bytes.length);
    await connectedDevice.sendReport(0x1f, layer2Bytes);
    console.log("Layer 2 sent");

    const layer3Bytes = convertKeymapToBytes(
      keymapCollection.layer3,
      appNum,
      0x02
    );
    console.log("layer3Bytes", layer3Bytes);
    console.log("layer3Bytes length", layer3Bytes.length);
    await connectedDevice.sendReport(0x1f, layer3Bytes);
    console.log("Layer 3 sent");

    console.log("All data sent successfully");
  } catch (error) {
    console.log("error", error);
    if (error instanceof DOMException && error.name === "NotAllowedError") {
      throw new Error(
        "デバイスへの書き込み権限がありません。デバイスを再接続してください。"
      );
    }
    console.error("Failed to send key map", error);
    throw error;
  }
}

function stringToByteArray(
  str: string,
  appNum: 0x00 | 0x01 | 0x02
): Uint8Array {
  const encoder = new TextEncoder();
  const res = encoder.encode(str);

  const allBytesWithPrefix = [0x04, appNum, ...res];

  const allBytes = new Uint8Array(63);
  allBytes.set(allBytesWithPrefix);

  return allBytes;
}

export const convertKeymapToBytes = (
  keymap: KeymapType,
  appNum: 0x00 | 0x01 | 0x02,
  layerNum: 0x00 | 0x01 | 0x02
): Uint8Array => {
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
    ];

    const allBytesWithPrefix = [0x05, appNum, layerNum, ...allBytes];

    const paddedBytes = new Uint8Array(63);
    paddedBytes.set(allBytesWithPrefix);

    return paddedBytes;
  } catch (error) {
    console.error("Error converting key map to bytes:", error);
    throw new Error("Failed to convert key map to bytes");
  }
};

// export function convertKeymapCollectionToBytes(
//   keymapCollection: KeymapCollection
// ): Uint8Array {
//   const appNameBytes = stringToByteArray(keymapCollection.appName);

//   const layer1Bytes = convertKeymapToBytes(keymapCollection.layer1);

//   const layer2Bytes = convertKeymapToBytes(keymapCollection.layer2);

//   const layer3Bytes = convertKeymapToBytes(keymapCollection.layer3);

//   const totalSize = 96 + appNameBytes.length;

//   const allBytes = new Uint8Array(63);
//   allBytes.set(layer1Bytes, 0); // 先頭0～31
//   // allBytes.set(layer2Bytes, 32); // 32～63
//   // allBytes.set(layer3Bytes, 64); // 64～95
//   // allBytes.set(appNameBytes, 96);

//   console.log("size of allBytes", allBytes.length);

//   return allBytes;
// }
