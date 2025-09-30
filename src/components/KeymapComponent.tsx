"use client";

import { useState, useMemo, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { css } from "../../styled-system/css";
import { Check, Copy, Library } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { clientApi } from "../lib/api/clientApi";
import { normalizeKeymapCollection } from "../lib/device/normalize";
import type { KeymapCollection } from "../lib/device/types";
import Device from "./device";
import { ShortcutDrawer } from "./ShortcutDrawer";

interface KeymapComponentBaseProps {
  keymapCollection: KeymapCollection;
  setKeymapCollection: Dispatch<SetStateAction<KeymapCollection>>;
  activeLayer: 1 | 2 | 3;
  setActiveLayer: Dispatch<SetStateAction<1 | 2 | 3>>;
  pageKinds: "new" | "edit" | "share";
}

interface NewKeymapProps extends KeymapComponentBaseProps {
  pageKinds: "new";
  keymap_id?: never;
}

interface ExistingKeymapProps extends KeymapComponentBaseProps {
  pageKinds: "edit" | "share";
  keymap_id: string;
}

type KeymapComponentProps = NewKeymapProps | ExistingKeymapProps;

const pageContainer = css({
  display: "flex",
  flexDirection: "column",
  gap: "32px",
  padding: "32px 40px 60px",
  alignItems: "center",
});

const focusColumn = css({
  width: "100%",
  maxWidth: "700px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
});

const headerRow = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "16px",
  width: "100%",
});

const nameInput = css({
  width: "min(420px, 100%)",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(245,235,227,0.12)",
  background: "rgba(245,235,227,0.08)",
  color: "#f5ebe3",
  fontSize: "18px",
  fontWeight: "600",
  outline: "none",
  transition: "all 0.15s ease",
  _focus: {
    borderColor: "rgba(177,61,87,0.6)",
    boxShadow: "0 0 0 2px rgba(177,61,87,0.25)",
  },
  _disabled: {
    opacity: 0.6,
  },
});

const layerTabs = css({
  display: "inline-flex",
  marginTop: "12px",
  background: "rgba(245,235,227,0.06)",
  borderRadius: "12px",
  padding: "4px",
  border: "1px solid rgba(245,235,227,0.14)",
  boxShadow: "0 12px 24px rgba(0,0,0,0.25)",
  gap: "8px",
  alignSelf: "flex-start",
});

const layerButton = css({
  background: "transparent",
  color: "rgba(245,235,227,0.55)",
  fontSize: "14px",
  fontWeight: "600",
  padding: "10px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  transition: "all 0.18s ease",
  _hover: {
    color: "#f5ebe3",
  },
  _focusVisible: {
    outline: "none",
    boxShadow: "0 0 0 2px rgba(245,235,227,0.45)",
  },
});

const layerButtonActive = css({
  background:
    "linear-gradient(135deg, rgba(177,61,87,0.85) 0%, rgba(216,102,136,0.9) 100%)",
  color: "#fdf5f0",
  borderColor: "rgba(245,235,227,0.4)",
  boxShadow: "0 6px 18px rgba(177,61,87,0.24)",
});

const headline = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  textAlign: "left",
});

const actionGroup = css({
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: "24px",
});

const primaryButton = css({
  background: "linear-gradient(135deg, #177b3a 0%, #1d9454 100%)",
  color: "#f5ebe3",
  border: "none",
  borderRadius: "12px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  transition: "transform 0.12s ease, box-shadow 0.12s ease",
  _hover: {
    transform: "translateY(-1px)",
    boxShadow: "0 10px 28px rgba(23,123,58,0.28)",
  },
  _disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
    boxShadow: "none",
  },
});

const secondaryButton = css({
  background: "rgba(245,235,227,0.08)",
  color: "#f5ebe3",
  border: "1px solid rgba(245,235,227,0.12)",
  borderRadius: "12px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.16)",
  },
});

const dangerButton = css({
  background: "rgba(177,61,87,0.18)",
  color: "#f5ebe3",
  border: "1px solid rgba(177,61,87,0.4)",
  borderRadius: "12px",
  padding: "12px 20px",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(177,61,87,0.28)",
  },
});

const workspaceCard = css({
  background: "rgba(245,235,227,0.03)",
  borderRadius: "20px",
  border: "1px solid rgba(245,235,227,0.08)",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  width: "100%",
});

const toolbar = css({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
  textAlign: "center",
});

const paletteTrigger = css({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "rgba(245,235,227,0.08)",
  color: "#f5ebe3",
  border: "1px solid rgba(245,235,227,0.12)",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.16)",
  },
});

const shareOverlay = css({
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1500,
});

const shareDialog = css({
  background: "#2b2727",
  borderRadius: "16px",
  padding: "28px",
  width: "min(480px, 90vw)",
  border: "1px solid rgba(245,235,227,0.12)",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const shareField = css({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px",
  borderRadius: "10px",
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.1)",
  fontSize: "13px",
  color: "#f5ebe3",
});

const shareButtonRow = css({
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
});

const toastContainer = css({
  position: "fixed",
  top: "24px",
  right: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  zIndex: 1600,
});

const toast = css({
  backdropFilter: "blur(18px)",
  background: "rgba(23, 123, 58, 0.18)",
  border: "1px solid rgba(23, 123, 58, 0.4)",
  borderRadius: "14px",
  padding: "12px 18px",
  display: "inline-flex",
  alignItems: "center",
  gap: "12px",
  color: "#f5ebe3",
  boxShadow: "0 14px 28px rgba(0,0,0,0.25)",
});

const layerLabels: Record<1 | 2 | 3, string> = {
  1: "Layer 1",
  2: "Layer 2",
  3: "Layer 3",
};

export const KeymapComponent: React.FC<KeymapComponentProps> = ({
  keymap_id,
  keymapCollection,
  setKeymapCollection,
  activeLayer,
  setActiveLayer,
  pageKinds,
}) => {
  const router = useRouter();
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isPaletteOpen) {
      setPaletteSearch("");
    }
  }, [isPaletteOpen]);

  const collection = useMemo(
    () => normalizeKeymapCollection(keymapCollection),
    [keymapCollection]
  );

  const updateCollection: Dispatch<SetStateAction<KeymapCollection>> = (
    value
  ) => {
    setKeymapCollection((prev) => {
      const normalizedPrev = normalizeKeymapCollection(prev);
      if (typeof value === "function") {
        const next = value(normalizedPrev);
        return normalizeKeymapCollection(next);
      }
      return normalizeKeymapCollection(value);
    });
  };

  const handleSave = async () => {
    try {
      if (pageKinds === "new") {
        const res = await clientApi().keymaps.postKeymap({
          keymap_name: collection.appName,
          keymap_json: collection,
        });
        router.push(`/keymap/${res.keymap_id}`);
      } else if (pageKinds === "edit") {
        await clientApi().keymaps.putKeymap({
          keymap_id,
          keymap_name: collection.appName,
          keymap_json: JSON.stringify(collection),
        });
        setToastMessage("保存しました");
      }
    } catch (error) {
      throw Error(
        error instanceof Error ? error.message : "Failed to save keymap"
      );
    }
  };

  const handleShare = async () => {
    if (pageKinds !== "edit") return;
    try {
      const res = await clientApi().keymaps_to_share.postKeymapToShare({
        keymap_name: collection.appName,
        keymap_json: collection,
      });
      const url = `${window.location.origin}/keymap/share/${res.share_id}`;
      setShareLink(url);
    } catch (error) {
      throw Error(
        error instanceof Error ? error.message : "Failed to share keymap"
      );
    }
  };

  const handleReset = () => {
    if (pageKinds === "share") return;
    updateCollection(() => normalizeKeymapCollection({}));
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const actionButtons =
    pageKinds === "share"
      ? null
      : (
          <div className={actionGroup}>
            <button className={dangerButton} onClick={handleReset}>
              すべてクリア
            </button>
            <button className={primaryButton} onClick={handleSave}>
              保存する
            </button>
            {pageKinds === "edit" && (
              <button className={secondaryButton} onClick={handleShare}>
                共有リンクを作成
              </button>
            )}
          </div>
        );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={pageContainer}>
        <div className={focusColumn}>
          <header className={headerRow}>
            <div className={headline}>
              <input
                className={nameInput}
                type="text"
                placeholder="キーマップの名称"
                value={collection.appName}
                onChange={(event) =>
                  updateCollection((prev) => ({
                    ...prev,
                    appName: event.target.value,
                  }))
                }
                disabled={pageKinds === "share"}
              />
              <div className={layerTabs} role="tablist">
                {[1, 2, 3].map((layer) => {
                  const isActive = activeLayer === layer;
                  return (
                    <button
                      key={layer}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveLayer(layer as 1 | 2 | 3)}
                      className={`${layerButton} ${isActive ? layerButtonActive : ""}`}
                      disabled={pageKinds === "share" && !isActive}
                    >
                      {layerLabels[layer as 1 | 2 | 3]}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          <section className={workspaceCard}>
            <Device
              pageKinds={pageKinds}
              keymapCollection={collection}
              setKeymapCollection={updateCollection}
              activeLayer={activeLayer}
            />

            {actionButtons}

            {pageKinds !== "share" && (
              <div className={toolbar}>
                <button
                  type="button"
                  className={paletteTrigger}
                  onClick={() => setPaletteOpen(true)}
                >
                  <Library size={18} />
                  ショートカットライブラリを開く
                </button>
              </div>
            )}
          </section>
        </div>

        {shareLink && (
          <div className={shareOverlay}>
            <div className={shareDialog}>
              <h2 className={css({ fontSize: "18px", fontWeight: "700" })}>
                共有リンクをコピーしてください
              </h2>
              <div className={shareField}>
                <span
                  className={css({
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  })}
                >
                  {shareLink}
                </span>
                <button
                  className={secondaryButton}
                  onClick={() => navigator.clipboard.writeText(shareLink)}
                >
                  <Copy size={16} /> コピー
                </button>
              </div>
              <div className={shareButtonRow}>
                <button
                  className={secondaryButton}
                  onClick={() => setShareLink(null)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        <ShortcutDrawer
          open={isPaletteOpen && pageKinds !== "share"}
          search={paletteSearch}
          onSearchChange={setPaletteSearch}
          onClose={() => setPaletteOpen(false)}
        />
      </div>
      {toastMessage && (
        <div className={toastContainer} role="status" aria-live="polite">
          <div className={toast}>
            <Check size={18} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </DndProvider>
  );
};
