export const UNIQUE_KEY_CATEGORIES = [
  { id: "movement", title: "Movement Key" },
  { id: "dpi", title: "DPI Key" },
  { id: "layer", title: "Layer Key" },
  { id: "application", title: "Application Key" },
  { id: "slot", title: "Slot Key" },
  { id: "axis", title: "Axis Lock Key" },
  { id: "viewcube", title: "ViewCube Key" },
] as const;

export type UniqueKeyCategoryId = (typeof UNIQUE_KEY_CATEGORIES)[number]["id"];

const UNIQUE_KEY_FAMILIES = [
  {
    upper: 0x11,
    label: "Movement Mode",
    categoryId: "movement" as const,
    entries: [
      { key: "MOVEMENT MODE TOGGLE", lower: 0x01 },
      { key: "MOVEMENT MODE HOLD", lower: 0x02 },
    ],
  },
  {
    upper: 0x12,
    label: "DPI",
    categoryId: "dpi" as const,
    entries: [
      { key: "DPI CYCLE", lower: 0x00 },
      { key: "DPI SLOT 1", lower: 0x01 },
      { key: "DPI SLOT 2", lower: 0x02 },
      { key: "DPI SLOT 3", lower: 0x03 },
    ],
  },
  {
    upper: 0x13,
    label: "Layer",
    categoryId: "layer" as const,
    entries: [
      { key: "LAYER CYCLE", lower: 0x00 },
      { key: "LAYER HOLD 1", lower: 0x01 },
      { key: "LAYER HOLD 2", lower: 0x02 },
      { key: "LAYER HOLD 3", lower: 0x03 },
    ],
  },
  {
    upper: 0x14,
    label: "Application",
    categoryId: "application" as const,
    entries: [
      { key: "APP CYCLE", lower: 0x00 },
      { key: "APP 1 SELECT", lower: 0x01 },
      { key: "APP 2 SELECT", lower: 0x02 },
      { key: "APP 3 SELECT", lower: 0x03 },
    ],
  },
  {
    upper: 0x15,
    label: "Axis Lock",
    categoryId: "axis" as const,
    entries: [
      { key: "SLOT CYCLE", lower: 0x00 },
      { key: "AXIS LOCK X", lower: 0x01 },
      { key: "AXIS LOCK Y", lower: 0x02 },
      { key: "AXIS LOCK Z", lower: 0x03 },
      { key: "AXIS LOCK X HOLD", lower: 0x11 },
      { key: "AXIS LOCK Y HOLD", lower: 0x12 },
      { key: "AXIS LOCK Z HOLD", lower: 0x13 },
    ],
  },
  {
    upper: 0x16,
    label: "ViewCube",
    categoryId: "viewcube" as const,
    entries: [
      { key: "VIEWCUBE HOME", lower: 0x01 },
      { key: "VIEWCUBE NEAREST FACE", lower: 0x02 },
      { key: "VIEWCUBE UP", lower: 0x10 },
      { key: "VIEWCUBE DOWN", lower: 0x11 },
      { key: "VIEWCUBE LEFT", lower: 0x12 },
      { key: "VIEWCUBE RIGHT", lower: 0x13 },
      { key: "VIEWCUBE FRONT", lower: 0x14 },
      { key: "VIEWCUBE BACK", lower: 0x15 },
      { key: "VIEWCUBE ROTATE X +90", lower: 0x20 },
      { key: "VIEWCUBE ROTATE X -90", lower: 0x21 },
      { key: "VIEWCUBE ROTATE Y +90", lower: 0x22 },
      { key: "VIEWCUBE ROTATE Y -90", lower: 0x23 },
      { key: "VIEWCUBE ROTATE Z +90", lower: 0x24 },
      { key: "VIEWCUBE ROTATE Z -90", lower: 0x25 },
    ],
  },
] as const;

export const UNIQUE_KEY_DEFINITIONS = UNIQUE_KEY_FAMILIES.flatMap((family) =>
  family.entries.map((entry) => ({
    key: entry.key,
    upper: family.upper,
    lower: entry.lower,
    categoryId: family.categoryId,
  }))
);

export type UniqueKey = (typeof UNIQUE_KEY_DEFINITIONS)[number]["key"];

export const uniqueKeyUsageMap = new Map<
  UniqueKey,
  { upper: number; lower: number }
>(
  UNIQUE_KEY_DEFINITIONS.map(({ key, upper, lower }) => [key, { upper, lower }])
);

export const uniqueKeysByCategory = UNIQUE_KEY_CATEGORIES.map((category) => ({
  ...category,
  keys: UNIQUE_KEY_DEFINITIONS.filter(
    (definition) => definition.categoryId === category.id
  ).map((definition) => definition.key),
}));

export const uniqueKeyFamilies = UNIQUE_KEY_FAMILIES;
