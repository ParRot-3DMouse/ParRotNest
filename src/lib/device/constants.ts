export const HID_REPORT_LENGTH = 63;

export const REPORT_ID = 0x1f as const;

export const COMMAND_ID = {
  CONFIG: 0x03,
  APP_NAME: 0x04,
  KEYMAP: 0x05,
} as const;

export const APP_SLOT_IDS = [0x00, 0x01, 0x02] as const;
export type AppSlotId = (typeof APP_SLOT_IDS)[number];

export const LAYER_IDS = [0x00, 0x01, 0x02] as const;
export type LayerId = (typeof LAYER_IDS)[number];

export const CONFIG_FLAG_COUNT = 6; // x/y/z flip + x/y/z mirror
export const DPI_SLOT_COUNT = 3;
export const BYTES_PER_DPI_VALUE = 2;
export const LED_CONFIG_INDEX = 14;
export const CONFIG_HEADER_LENGTH = 2; // command id + app id

export const APP_NAME_HEADER_LENGTH = 2; // command id + app id
export const KEYMAP_HEADER_LENGTH = 3; // command id + app id + layer id
