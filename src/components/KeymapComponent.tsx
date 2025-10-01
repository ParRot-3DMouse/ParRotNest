"use client";

import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { css } from "../../styled-system/css";
import { Check, Library } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { KeymapCollection } from "../lib/device/types";
import { useKeymapCollectionState } from "../lib/hooks/useKeymapCollectionState";
import { useKeymapActions } from "../lib/hooks/useKeymapActions";
import Device from "./device";
import { ShortcutDrawer } from "./ShortcutDrawer";
import { LayerTabs } from "./keymaps/LayerTabs";
import { ShareLinkDialog } from "./keymaps/ShareLinkDialog";

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

export const KeymapComponent: React.FC<KeymapComponentProps> = ({
  keymap_id: keymapId,
  keymapCollection,
  setKeymapCollection,
  activeLayer,
  setActiveLayer,
  pageKinds,
}) => {
  const [isPaletteOpen, setPaletteOpen] = useState(false);
  const [paletteSearch, setPaletteSearch] = useState("");
  const { collection, updateCollection, resetCollection } =
    useKeymapCollectionState(keymapCollection, setKeymapCollection);

  const {
    handleSave,
    handleShare,
    handleReset,
    shareLink,
    dismissShare,
    toastMessage,
  } = useKeymapActions({
    pageKind: pageKinds,
    collection,
    keymapId,
    onReset: resetCollection,
  });

  useEffect(() => {
    if (!isPaletteOpen) {
      setPaletteSearch("");
    }
  }, [isPaletteOpen]);

  const actionButtons =
    pageKinds === "share" ? null : (
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
              <LayerTabs
                activeLayer={activeLayer}
                disabled={pageKinds === "share"}
                onSelect={(layer) => setActiveLayer(layer)}
              />
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
          <ShareLinkDialog link={shareLink} onClose={dismissShare} />
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
