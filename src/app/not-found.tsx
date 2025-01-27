"use client";

import { css } from "../../styled-system/css";
import { useRouter } from "next/navigation";

export const runtime = "edge";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - ページが見つかりません</h1>
      <p className={styles.message}>
        お探しのページが見つかりませんでした。URLが正しいかをご確認ください。
      </p>
      <button onClick={() => router.push("/")} className={styles.primaryButton}>
        トップページに戻る
      </button>
    </div>
  );
}

const styles = {
  container: css({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    height: "100vh",
    color: "#f7fafc",
    padding: "0 20px",
  }),
  title: css({
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#f7fafc",
  }),
  message: css({
    fontSize: "1rem",
    marginBottom: "1.5rem",
    color: "#f7fafc",
  }),
  primaryButton: css({
    backgroundColor: "#3182ce",
    color: "white",
    padding: "10px 20px",
    borderRadius: "0.375rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    _hover: {
      backgroundColor: "#2b6cb0",
    },
    _active: {
      backgroundColor: "#2c5282",
    },
  }),
};
