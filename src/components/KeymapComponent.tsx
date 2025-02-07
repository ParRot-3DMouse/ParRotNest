import { css } from "../../styled-system/css";
import Device from "./device";
import { KeymapCollection } from "../lib/device/types";
import { clientApi } from "../lib/api/clientApi";
import { initialState } from "../lib/device/reducer";
import UniqueKeyMenu from "./UniqueKeyMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { useHID } from "./provider/HIDContext";
import { DeviceCard } from "./DeviceCard";

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
  margin: "30px",
  textAlign: "center",
  display: "flex",
  gap: "1rem",
  justifyContent: "center",
});
const dangerButton = css({
  // backgroundColor: "red.600",
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

const primaryButton = css({
  // backgroundColor: "blue.600",
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
  const { connectedDevice, connect, disconnect } = useHID();
  const router = useRouter();

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
    <div className={css({ maxWidth: "500px", margin: "0 auto" })}>
      <DndProvider backend={HTML5Backend}>
        <DeviceCard
          keymapCollection={keymapCollection}
          connectedDevice={connectedDevice}
          connect={connect}
          disconnect={disconnect}
        />
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
            width: "100%",
            padding: "8px",
            marginBottom: "1rem",
            borderRadius: "0.375rem",
            // border: "1px solid gray",
            // backgroundColor: "gray.800",
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
            <button onClick={handleSave} className={primaryButton}>
              Save
            </button>
          )}
          {pageKinds === "edit" && (
            <button onClick={handlePost} className={primaryButton}>
              Post
            </button>
          )}
        </div>
        {!(pageKinds === "share") && <UniqueKeyMenu />}
      </DndProvider>
    </div>
  );
};
