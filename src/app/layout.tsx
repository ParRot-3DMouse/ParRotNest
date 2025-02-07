import type { Metadata } from "next";
import "./globals.css";
import { css } from "../../styled-system/css";
import Provider from "../components/provider/provider";
import { HeaderMenu } from "../components/HeaderMenu";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
