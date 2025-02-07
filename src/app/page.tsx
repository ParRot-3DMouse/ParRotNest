"use client";

import { useEffect, useState } from "react";
import { css } from "../../styled-system/css";

const container = css({
  margin: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
});

const title = css({
  fontSize: "1.5rem",
  fontWeight: "bold",
  marginBottom: "1.5rem",
  textAlign: "center",
});

const alert = css({
  padding: "1rem",
  borderRadius: "0.375rem",
  border: "1px solid",
});

const warningAlert = css({
  backgroundColor: "yellow.900",
  borderColor: "yellow.700",
  color: "yellow.100",
});

const bulletList = css({
  marginTop: "0.5rem",
  marginLeft: "1.5rem",
  listStyle: "disc",
  // color: "yellow.100",
});

export default function Page() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsSupported(typeof window !== "undefined" && "hid" in navigator);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className={container}>
      <h1 className={title}>ParRotNestへようこそ！</h1>

      {!isSupported ? (
        <div className={`${alert} ${warningAlert}`}>
          <p>
            お使いのブラウザはWebHID APIをサポートしていません。
            以下のブラウザで開いてください：
          </p>
          <ul className={bulletList}>
            <li>Google Chrome</li>
            <li>Microsoft Edge</li>
            <li>Opera</li>
          </ul>
        </div>
      ) : (
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            maxWidth: "1000px",
          })}
        >
          <p>
            ParRotNestは、WebHID
            APIを使用して、あなたのParRotのキーマップを変更するためのツールです。
          </p>
          <p>
            まずは、ParRotをUSBで接続して、左のデバイスカードから接続してください！
          </p>
          <br />
          <p>
            接続できたら、早速「New
            Keymap」からオリジナルのキーマップを作成してみましょう！
          </p>
        </div>
      )}
    </div>
  );
}
