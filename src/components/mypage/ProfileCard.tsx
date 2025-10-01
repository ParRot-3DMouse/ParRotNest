"use client";

import { useState } from "react";
import type { FC } from "react";
import { css } from "../../../styled-system/css";

const card = css({
  background: "rgba(245,235,227,0.05)",
  border: "1px solid rgba(245,235,227,0.12)",
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  color: "#f5ebe3",
});

const header = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
});

const nameLabel = css({
  fontSize: "22px",
  fontWeight: "700",
});

const emailText = css({
  fontSize: "14px",
  color: "rgba(245,235,227,0.7)",
  wordBreak: "break-all",
});

const metaRow = css({
  display: "flex",
  gap: "12px",
  fontSize: "13px",
  color: "rgba(245,235,227,0.6)",
});

const button = css({
  background: "rgba(245,235,227,0.08)",
  border: "1px solid rgba(245,235,227,0.16)",
  borderRadius: "10px",
  color: "#f5ebe3",
  padding: "8px 14px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  transition: "all 0.12s ease",
  _hover: {
    background: "rgba(245,235,227,0.16)",
  },
  _disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

const nameInput = css({
  width: "100%",
  maxWidth: "320px",
  padding: "10px 12px",
  background: "rgba(245,235,227,0.08)",
  border: "1px solid rgba(245,235,227,0.16)",
  borderRadius: "10px",
  color: "#f5ebe3",
  fontSize: "15px",
  fontWeight: "600",
  outline: "none",
  transition: "border 0.12s ease",
  _focus: {
    borderColor: "rgba(177,61,87,0.6)",
    boxShadow: "0 0 0 1px rgba(177,61,87,0.4)",
  },
});

const errorText = css({
  color: "#ff8a8a",
  fontSize: "12px",
});

interface ProfileCardProps {
  name: string;
  email: string;
  joinedAt?: string;
  onSaveName: (nextName: string) => Promise<void>;
}

export const ProfileCard: FC<ProfileCardProps> = ({
  name,
  email,
  joinedAt,
  onSaveName,
}) => {
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!draftName.trim() || draftName === name) {
      setEditing(false);
      setDraftName(name);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onSaveName(draftName.trim());
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={card}>
      <div className={header}>
        {editing ? (
          <input
            className={nameInput}
            value={draftName}
            onChange={(event) => setDraftName(event.target.value)}
            disabled={submitting}
          />
        ) : (
          <span className={nameLabel}>{name || "未設定ユーザー"}</span>
        )}
        <div>
          {editing ? (
            <div className={css({ display: "flex", gap: "8px" })}>
              <button
                className={button}
                onClick={handleSubmit}
                disabled={submitting}
              >
                保存
              </button>
              <button
                className={button}
                onClick={() => {
                  setEditing(false);
                  setDraftName(name);
                  setError(null);
                }}
                disabled={submitting}
              >
                キャンセル
              </button>
            </div>
          ) : (
            <button className={button} onClick={() => setEditing(true)}>
              名前を編集
            </button>
          )}
        </div>
      </div>
      <p className={emailText}>{email}</p>
      <div className={metaRow}>
        <span>登録日: {joinedAt ? new Date(joinedAt).toLocaleDateString() : "不明"}</span>
      </div>
      {error && <p className={errorText}>{error}</p>}
    </section>
  );
};
