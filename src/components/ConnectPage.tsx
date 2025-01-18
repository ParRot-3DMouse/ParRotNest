"use client";

import { css } from "../../styled-system/css";
import { useState, useEffect, useReducer } from "react";
import {
  connectHIDDevice,
  convertKeyMapToBytes,
  disconnectHIDDevice,
  getConnectedDevice,
  sendKeyMap,
} from "../lib/device/hid";
import Device from "../app/remap/device";
import { Key, KeyColumn, KeyMapType } from "../lib/device/types";
import { reducer, initialState, update } from "../lib/device/reducer";
import UniqueKeyMenu from "../components/UniqueKeyMenu";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ConnectedDevice {
  productName: string;
  vendorId: number;
  productId: number;
  device: HIDDevice;
}

const style = {
  container: css({
    margin: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  }),

  // Typography
  title: css({
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "white",
  }),

  // Buttons
  primaryButton: css({
    backgroundColor: "blue.600",
    color: "white",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem",
    borderRadius: "0.375rem",
    fontWeight: "500",
    _hover: {
      backgroundColor: "blue.700",
    },
    _active: {
      backgroundColor: "blue.800",
    },
    width: "fit-content",
    marginLeft: "auto",
    marginRight: "auto",
    cursor: "pointer",
  }),

  dangerButton: css({
    backgroundColor: "red.600",
    color: "white",
    paddingLeft: "0.75rem",
    paddingRight: "0.75rem",
    paddingTop: "0.375rem",
    paddingBottom: "0.375rem",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    _hover: {
      backgroundColor: "red.700",
    },
    _active: {
      backgroundColor: "red.800",
    },
    width: "fit-content",
    cursor: "pointer",
  }),

  successButton: css({
    backgroundColor: "teal.400",
    color: "white",
    padding: "10px 20px",
    borderRadius: "0.375rem",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    _hover: {
      backgroundColor: "teal.500",
    },
    width: "fit-content",
  }),

  // Info Cards
  card: css({
    border: "1px solid",
    borderColor: "gray.700",
    padding: "1rem",
    borderRadius: "0.5rem",
    backgroundColor: "gray.800",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    height: "fit-content",
    margin: "20px",
  }),

  // Code Display
  codeBlock: css({
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "gray.800",
    borderRadius: "5px",
    overflowX: "auto",
    width: "100%",
    color: "white",
  }),
  alert: css({
    padding: "1rem",
    borderRadius: "0.375rem",
    border: "1px solid",
  }),

  warningAlert: css({
    backgroundColor: "yellow.900",
    borderColor: "yellow.700",
    color: "yellow.100",
  }),

  errorAlert: css({
    backgroundColor: "red.900",
    borderColor: "red.700",
    color: "red.200",
    fontSize: "0.875rem",
  }),

  bulletList: css({
    marginTop: "0.5rem",
    marginLeft: "1.5rem",
    listStyle: "disc",
    color: "yellow.100",
  }),

  text: {
    normal: css({
      fontSize: "0.875rem",
      color: "gray.200",
    }),
    small: css({
      fontSize: "0.75rem",
      color: "gray.400",
      fontFamily: "monospace",
    }),
  },

  buttonGroup: css({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "4",
  }),
  arrow: css({
    width: "0",
    height: "0",
    borderLeft: "40px solid transparent",
    borderRight: "40px solid transparent",
    borderTopWidth: "40px",
    borderTopStyle: "solid",
    borderTopColor: "teal.400",
    margin: "20px 0",
  }),

  buttonContainer: css({
    marginTop: "30px",
    textAlign: "center",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  }),

  deviceInfo: css({
    backgroundColor: "gray.800",
    padding: "4",
    borderRadius: "md",
    marginBottom: "6",
  }),

  deviceText: {
    normal: css({
      fontSize: "0.875rem",
      color: "gray.200",
    }),
    small: css({
      fontSize: "0.75rem",
      color: "gray.400",
      fontFamily: "monospace",
    }),
  },
};

export default function ConnectPage() {
  const [connectedDevice, setConnectedDevice] =
    useState<ConnectedDevice | null>(null);
  const [error, setError] = useState<string>("");
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [keyState, dispatch] = useReducer(reducer, initialState);
  const [tempState, setTempState] = useState<KeyMapType>(initialState);

  useEffect(() => {
    setMounted(true);
    setIsSupported(typeof window !== "undefined" && "hid" in navigator);
  }, []);

  useEffect(() => {
    const checkConnectedDevice = () => {
      const device = getConnectedDevice();
      if (device) {
        setConnectedDevice({
          productName: device.productName,
          vendorId: device.vendorId,
          productId: device.productId,
          device: device,
        });
      }
    };

    if (mounted) {
      checkConnectedDevice();
    }
  }, [mounted]);

  const handleConnect = async () => {
    try {
      await connectHIDDevice();
      const device = getConnectedDevice();
      if (device) {
        setConnectedDevice({
          productName: device.productName,
          vendorId: device.vendorId,
          productId: device.productId,
          device: device,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect device");
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectHIDDevice();
      setConnectedDevice(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to disconnect device"
      );
    }
  };

  if (!mounted) {
    return null;
  }

  const handleInputChange = (
    col: keyof Omit<KeyMapType, "thumbKey1" | "thumbKey2" | "monitorKey">,
    key: keyof KeyColumn,
    value: Key
  ) => {
    setTempState((prev) => ({
      ...prev,
      [col]: { ...prev[col], [key]: value },
    }));
  };

  const handleThumbKey1Change = (value: Key) => {
    setTempState((prev) => ({
      ...prev,
      thumbKey1: value,
    }));
  };

  const handleThumbKey2Change = (value: Key) => {
    setTempState((prev) => ({
      ...prev,
      thumbKey2: value,
    }));
  };

  const handleMonitorKeyChange = (value: Key) => {
    setTempState((prev) => ({
      ...prev,
      monitorKey: value,
    }));
  };

  const handleUpdate = () => {
    dispatch(update(tempState));
    sendKeyMap(tempState);
  };

  const keyArray = convertKeyMapToBytes(keyState);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={style.container}>
        <h1 className={style.title}>HIDデバイス接続</h1>

        {!isSupported ? (
          <div className={`${style.alert} ${style.warningAlert}`}>
            <p>
              お使いのブラウザはWebHID APIをサポートしていません。
              以下のブラウザで開いてください：
            </p>
            <ul className={style.bulletList}>
              <li>Google Chrome</li>
              <li>Microsoft Edge</li>
              <li>Opera</li>
            </ul>
          </div>
        ) : (
          <div
            className={css({
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "1000px",
            })}
          >
            {!connectedDevice ? (
              <button onClick={handleConnect} className={style.primaryButton}>
                デバイスを接続
              </button>
            ) : (
              <div>
                <div
                  className={css({
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    "@media (max-width: 799px)": {
                      flexDirection: "column",
                    },
                  })}
                >
                  <div className={style.card}>
                    <p className={style.text.normal}>
                      接続中のデバイス: {connectedDevice.productName}
                    </p>
                    <p className={style.text.small}>
                      VendorID: 0x{connectedDevice.vendorId.toString(16)},
                      ProductID: 0x
                      {connectedDevice.productId.toString(16)}
                    </p>
                    <div className={style.buttonGroup}>
                      <div>
                        <button
                          onClick={handleDisconnect}
                          className={style.dangerButton}
                        >
                          切断
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={style.container}>
                      <div className={css({ pointerEvents: "none" })}>
                        <Device
                          tempState={keyState}
                          handleInputChange={handleInputChange}
                          handleThumbKey1Change={handleThumbKey1Change}
                          handleThumbKey2Change={handleThumbKey2Change}
                          handleMonitorKeyChange={handleMonitorKeyChange}
                        />
                      </div>

                      <div className={style.arrow}></div>

                      <Device
                        tempState={tempState}
                        handleInputChange={handleInputChange}
                        handleThumbKey1Change={handleThumbKey1Change}
                        handleThumbKey2Change={handleThumbKey2Change}
                        handleMonitorKeyChange={handleMonitorKeyChange}
                      />

                      <div className={style.buttonContainer}>
                        <button
                          onClick={() => setTempState(initialState)}
                          className={style.dangerButton}
                        >
                          Reset
                        </button>
                        <button
                          onClick={handleUpdate}
                          className={style.successButton}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <UniqueKeyMenu />
                </div>

                <pre className={style.codeBlock}>{keyArray}</pre>
                <pre className={style.codeBlock}>
                  {JSON.stringify(keyState, null, 2)}
                </pre>
              </div>
            )}

            {error && (
              <p className={`${style.alert} ${style.errorAlert}`}>{error}</p>
            )}
          </div>
        )}
      </div>
    </DndProvider>
  );
}
