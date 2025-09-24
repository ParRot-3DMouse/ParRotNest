import {
  Key,
  KeyColumn,
  KeymapCollection,
  KeymapConfig,
  KeymapType,
} from "./types";
import { getKeyUsageID, Uint8 } from "./usageId";
import { initialConfig } from "./reducer";
import {
  APP_NAME_HEADER_LENGTH,
  APP_SLOT_IDS,
  BYTES_PER_DPI_VALUE,
  COMMAND_ID,
  CONFIG_FLAG_COUNT,
  CONFIG_HEADER_LENGTH,
  DPI_SLOT_COUNT,
  HID_REPORT_LENGTH,
  LAYER_IDS,
  LED_CONFIG_INDEX,
  REPORT_ID,
} from "./constants";
import type { AppSlotId, LayerId } from "./constants";
import { clampToUint16, clampToUint8 } from "./utils";

export async function sendKeymapCollection(
  keymapCollection: KeymapCollection,
  connectedDevice: HIDDevice | null,
  selectedSlot: 1 | 2 | 3
): Promise<void> {
  if (!connectedDevice) {
    throw new Error("Device not connected");
  }

  try {
    if (!connectedDevice.opened) {
      await connectedDevice.open();
    }

    const appIndex = selectedSlot - 1;
    const appNum = APP_SLOT_IDS[appIndex];

    if (appNum === undefined) {
      throw new Error(`Invalid slot number: ${selectedSlot}`);
    }

    const send = async (payload: Uint8Array) => {
      await connectedDevice.sendReport(REPORT_ID, payload as BufferSource);
    };

    const configBytes = convertConfigToBytes(
      keymapCollection.config ?? initialConfig,
      appNum as AppSlotId
    );
    await send(configBytes);

    const appNameBytes = stringToByteArray(
      keymapCollection.appName,
      appNum as AppSlotId
    );
    await send(appNameBytes);

    const layers: KeymapType[] = [
      keymapCollection.layer1,
      keymapCollection.layer2,
      keymapCollection.layer3,
    ];

    for (const [index, layer] of LAYER_IDS.entries()) {
      const layerBytes = convertKeymapToBytes(
        layers[index],
        appNum as AppSlotId,
        layer as LayerId
      );
      await send(layerBytes);
    }
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

function convertConfigToBytes(
  config: KeymapConfig,
  appNum: AppSlotId
): Uint8Array {
  const bytes = new Uint8Array(HID_REPORT_LENGTH);
  bytes[0] = COMMAND_ID.CONFIG;
  bytes[1] = appNum;

  const flags = [
    config.xFlip,
    config.yFlip,
    config.zFlip,
    config.xMirror,
    config.yMirror,
    config.zMirror,
  ];

  flags.slice(0, CONFIG_FLAG_COUNT).forEach((flag, index) => {
    bytes[CONFIG_HEADER_LENGTH + index] = flag ? 0x01 : 0x00;
  });

  const dpiValues = [config.dpiSlot1, config.dpiSlot2, config.dpiSlot3];
  const dpiStartIndex = CONFIG_HEADER_LENGTH + CONFIG_FLAG_COUNT;

  dpiValues.slice(0, DPI_SLOT_COUNT).forEach((dpi, index) => {
    const clamped = clampToUint16(dpi);
    const baseIndex = dpiStartIndex + index * BYTES_PER_DPI_VALUE;
    bytes[baseIndex] = clamped & 0xff;
    bytes[baseIndex + 1] = (clamped >> 8) & 0xff;
  });

  if (typeof config.ledConfig === "number") {
    bytes[LED_CONFIG_INDEX] = clampToUint8(config.ledConfig);
  }

  return bytes;
}

function stringToByteArray(str: string, appNum: AppSlotId): Uint8Array {
  const encoder = new TextEncoder();
  const encodedName = encoder.encode(str);
  const maxPayloadLength = HID_REPORT_LENGTH - APP_NAME_HEADER_LENGTH;

  if (encodedName.length > maxPayloadLength) {
    throw new Error(
      `Keymap name is too long. Limit to ${maxPayloadLength} bytes (current: ${encodedName.length} bytes).`
    );
  }

  const allBytes = new Uint8Array(HID_REPORT_LENGTH);
  allBytes.set([COMMAND_ID.APP_NAME, appNum]);
  allBytes.set(encodedName, APP_NAME_HEADER_LENGTH);

  return allBytes;
}

export const convertKeymapToBytes = (
  keymap: KeymapType,
  appNum: AppSlotId,
  layerNum: LayerId
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

    const allBytesWithPrefix = [
      COMMAND_ID.KEYMAP,
      appNum,
      layerNum,
      ...allBytes,
    ];

    if (allBytesWithPrefix.length > HID_REPORT_LENGTH) {
      throw new Error(
        "Keymap data is too large to fit into a single HID report."
      );
    }

    const paddedBytes = new Uint8Array(HID_REPORT_LENGTH);
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
