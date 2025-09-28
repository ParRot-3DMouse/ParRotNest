"use client";

import { useMemo } from "react";
import type { ReactNode } from "react";
import { css } from "../../styled-system/css";
import {
  uniqueKeyGroups,
  type UniqueKeyCategoryId,
} from "../lib/device/unique-keys";
import type { UniqueKey } from "../lib/device/types";
import { useDrag } from "react-dnd";

const paletteContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  paddingBottom: "24px",
});

const sectionContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
});

const sectionTitle = css({
  fontSize: "14px",
  fontWeight: "600",
  color: "#f5ebe3",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
});

const keyList = css({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "12px",
});

const keyCard = css({
  display: "flex",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "rgba(245, 235, 227, 0.08)",
  color: "#f5ebe3",
  border: "1px solid rgba(245, 235, 227, 0.12)",
  cursor: "grab",
  fontSize: "13px",
  fontWeight: "500",
  lineHeight: "1.2",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(245, 235, 227, 0.16)",
    borderColor: "rgba(245, 235, 227, 0.24)",
  },
  _active: {
    cursor: "grabbing",
  },
});

const highlightClass = css({
  color: "#b13d57",
});

type ShortcutGroup = {
  id: UniqueKeyCategoryId;
  title: string;
  keys: UniqueKey[];
};

const baseGroups: ShortcutGroup[] = uniqueKeyGroups.map((group) => ({
  id: group.id,
  title: group.title,
  keys: [...group.keys],
}));

const highlightMatch = (label: string, keyword: string): ReactNode => {
  if (!keyword) return label;
  const index = label.toLowerCase().indexOf(keyword.toLowerCase());
  if (index === -1) return label;
  return (
    <>
      {label.slice(0, index)}
      <span className={highlightClass}>{label.slice(index, index + keyword.length)}</span>
      {label.slice(index + keyword.length)}
    </>
  );
};

const DraggableKey: React.FC<{ uniqueKey: UniqueKey; keyword: string }> = ({
  uniqueKey,
  keyword,
}) => {
  const [, drag] = useDrag(() => ({
    type: "uniqueKey",
    item: { uniqueKey },
  }));

  return (
    <div ref={drag as unknown as React.Ref<HTMLDivElement>} className={keyCard}>
      {highlightMatch(uniqueKey, keyword)}
    </div>
  );
};

export const ShortcutPalette: React.FC<{ search: string }> = ({ search }) => {
  const keyword = search.trim();

  const filteredGroups = useMemo<ShortcutGroup[]>(() => {
    if (!keyword) return baseGroups;
    return baseGroups
      .map((group) => ({
        ...group,
        keys: group.keys.filter((key) =>
          key.toLowerCase().includes(keyword.toLowerCase())
        ),
      }))
      .filter((group) => group.keys.length > 0);
  }, [keyword]);

  return (
    <div className={paletteContainer}>
      {filteredGroups.map((group) => (
        <section key={group.id} className={sectionContainer}>
          <h3 className={sectionTitle}>{group.title}</h3>
          <div className={keyList}>
            {group.keys.map((key) => (
              <DraggableKey key={key} uniqueKey={key} keyword={keyword} />
            ))}
          </div>
        </section>
      ))}

      {filteredGroups.length === 0 && (
        <div
          className={css({
            fontSize: "14px",
            color: "rgba(245,235,227,0.6)",
            textAlign: "center",
            paddingTop: "40px",
          })}
        >
          「{keyword}」に一致するショートカットが見つかりませんでした。
        </div>
      )}
    </div>
  );
};
