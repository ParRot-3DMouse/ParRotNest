import type { Metadata } from "next";
import "./globals.css";
import { css } from "../../styled-system/css";
import Provider from "../components/provider/provider";
import { HeaderMenu } from "../components/HeaderMenu";
import { ClientLayout } from "../components/clientLayout";

export const metadata: Metadata = {
  title: "ParRotNest",
  description: "ParRot設定用Webアプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={css({
          color: "#f5ebe3",
          backgroundColor: "#2b2727",
        })}
      >
        <HeaderMenu />
        <Provider>
          <ClientLayout>{children}</ClientLayout>
        </Provider>
      </body>
    </html>
  );
}
