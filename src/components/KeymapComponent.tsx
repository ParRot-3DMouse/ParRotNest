import { css } from "../../styled-system/css";
import Device from "./device";
import { KeymapCollection } from "../lib/device/types";
import { clientApi } from "../lib/api/clientApi";
import { initialState } from "../lib/device/reducer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import UniqueKeyMenu from "./UniqueKeyMenu";
import { useState } from "react";

interface KeymapComponentBaseProps {
  keymapCollection: KeymapCollection;
  setKeymapCollection: React.Dispatch<React.SetStateAction<KeymapCollection>>;
  activeLayer: 1 | 2 | 3;
  setActiveLayer: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
  pageKinds: "new" | "edit" | "share";
}

interface NewKeymapProps extends KeymapComponentBaseProps {
  pageKinds: "new";
  keymap_id?: never; // `isNew`がtrueの場合は`keymap_id`を渡さない
}

interface ExistingKeymapProps extends KeymapComponentBaseProps {
  pageKinds: "edit" | "share";
  keymap_id: string; // `isNew`がfalseの場合は`keymap_id`を必須にする
}

type KeymapComponentProps = NewKeymapProps | ExistingKeymapProps;

const buttonContainer = css({
  textAlign: "center",
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
});
const dangerButton = css({
  backgroundColor: "#b13d57",
  paddingLeft: "0.75rem",
  paddingRight: "0.75rem",
  paddingTop: "0.375rem",
  paddingBottom: "0.375rem",
  borderRadius: "0.375rem",
  fontSize: "0.875rem",
  fontWeight: "500",
  _hover: {
    // backgroundColor: "red.700",
  },
  _active: {
    // backgroundColor: "red.800",
  },
  width: "fit-content",
  cursor: "pointer",
});

const saveButton = css({
  backgroundColor: "#177b3a",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  borderRadius: "0.375rem",
  fontWeight: "500",
  _hover: {
    // backgroundColor: "blue.700",
  },
  _active: {
    // backgroundColor: "blue.800",
  },
  width: "fit-content",
  cursor: "pointer",
});

const postButton = css({
  backgroundColor: "#145991",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  paddingTop: "0.5rem",
  paddingBottom: "0.5rem",
  borderRadius: "0.375rem",
  fontWeight: "500",
  _hover: {
    // backgroundColor: "blue.700",
  },
  _active: {
    // backgroundColor: "blue.800",
  },
  width: "fit-content",
  cursor: "pointer",
});

export const KeymapComponent: React.FC<KeymapComponentProps> = ({
  keymap_id,
  keymapCollection,
  setKeymapCollection,
  activeLayer,
  setActiveLayer,
  pageKinds,
}) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleSave = async () => {
    try {
      if (pageKinds === "new") {
        const res = await clientApi().keymaps.postKeymap({
          keymap_name: keymapCollection.appName,
          keymap_json: keymapCollection,
        });
        router.push(`/keymap/${res.keymap_id}`);
      } else if (pageKinds === "edit") {
        await clientApi().keymaps.putKeymap({
          keymap_id: keymap_id,
          keymap_name: keymapCollection.appName,
          keymap_json: JSON.stringify(keymapCollection),
        });
        router.push(`/keymap/${keymap_id}`);
      }
    } catch (err) {
      throw Error(err instanceof Error ? err.message : "Failed to save keymap");
    }
  };

  const handlePost = async () => {
    try {
      if (pageKinds === "edit") {
        const res = await clientApi().keymaps_to_share.postKeymapToShare({
          keymap_name: keymapCollection.appName,
          keymap_json: keymapCollection,
        });

        const share_id = res.share_id;
        router.push(`/keymap/share/${share_id}`);
      }
    } catch (err) {
      throw Error(err instanceof Error ? err.message : "Failed to post keymap");
    }
  };

  const handleReset = () => {
    try {
      setKeymapCollection({
        appName: "",
        layer1: initialState,
        layer2: initialState,
        layer3: initialState,
      });
    } catch (err) {
      throw Error(
        err instanceof Error ? err.message : "Failed to reset keymap"
      );
    }
  };
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            // alignItems: "center",
            flexDirection: "column",
            gap: "20px",
          })}
        >
          <div
            className={css({
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              paddingTop: "50px",
            })}
          >
            <input
              type="text"
              placeholder="Keymap Name"
              value={keymapCollection.appName}
              onChange={(e) =>
                setKeymapCollection((prev) => {
                  return { ...prev, appName: e.target.value };
                })
              }
              disabled={pageKinds === "share"}
              className={css({
                width: "400px",
                maxWidth: "400px",
                padding: "8px",
                borderRadius: "0.375rem",
                border: "1px solid",
                backgroundColor: "#f5ebe3",
                color: "#2b2727",
              })}
            />
            <Device
              pageKinds={pageKinds}
              keymapCollection={keymapCollection}
              setKeymapCollection={setKeymapCollection}
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
            />
            <div className={buttonContainer}>
              {pageKinds === "edit" ||
                (pageKinds === "new" && (
                  <button onClick={handleReset} className={dangerButton}>
                    {" "}
                    Reset
                  </button>
                ))}
              {(pageKinds === "edit" || pageKinds === "new") && (
                <button onClick={handleSave} className={saveButton}>
                  Save
                </button>
              )}
              {pageKinds === "edit" && (
                <button onClick={handlePost} className={postButton}>
                  Post
                </button>
              )}
            </div>
          </div>
          <div
            className={css({
              position: "fixed",
              bottom: 0,
              right: 0,
              height: "250px",
              transform: isCollapsed ? "translateY(200px)" : "translateY(0px)",
              transition: "transform 0.3s ease",
              width: "calc(100dvw - 350px)",
            })}
          >
            <div
              className={css({
                height: "100%",
                padding: "20px",
                overflowY: "auto",
              })}
            >
              {pageKinds !== "share" && (
                <>
                  <h2>Unique Key</h2>
                  <UniqueKeyMenu />
                </>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={css({
                position: "absolute",
                top: "-25px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#606060",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              })}
            >
              {isCollapsed ? "▲" : "▼"}
            </button>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};
