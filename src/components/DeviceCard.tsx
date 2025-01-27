import { css } from "../../styled-system/css";

const card = css({
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
});

const normal = css({
  fontSize: "0.875rem",
  color: "gray.200",
});

const small = css({
  fontSize: "0.75rem",
  color: "gray.400",
  fontFamily: "monospace",
});

const buttonGroup = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "4",
});

const dangerButton = css({
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
});

const primaryButton = css({
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
});

export const DeviceCard = ({
  connectedDevice,
  connect,
  disconnect,
}: {
  connectedDevice: HIDDevice | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}) => {
  return (
    <div className={card}>
      {connectedDevice ? (
        <>
          <p className={normal}>
            接続中のデバイス: {connectedDevice.productName}
          </p>
          <p className={small}>
            VendorID: 0x{connectedDevice.vendorId.toString(16)}, ProductID: 0x
            {connectedDevice.productId.toString(16)}
          </p>
          <div className={buttonGroup}>
            <button onClick={disconnect} className={dangerButton}>
              切断
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={normal}>デバイスが接続されていません。</p>
          <div className={buttonGroup}>
            <button onClick={connect} className={primaryButton}>
              接続
            </button>
          </div>
        </>
      )}
    </div>
  );
};
