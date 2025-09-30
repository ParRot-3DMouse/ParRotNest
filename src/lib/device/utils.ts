export const clampToRange = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
};

export const clampToUint8 = (value: number): number => clampToRange(value, 0, 0xff);

export const clampToUint16 = (value: number): number => clampToRange(value, 0, 0xffff);
