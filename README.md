# ParRotNest

ParRotNestは、3Dポインティングデバイス「ParRot」のキーマップと本体設定をブラウザ上で編集・書き込みできるNext.jsアプリケーションです。WebHID APIに対応したブラウザからUSB接続したParRotにアクセスし、レイヤーごとのキー割り当てやDPIなどの細かな設定を管理できます。

## 主な機能
- WebHID経由でのParRot検出・接続と設定書き込み
- レイヤー3層構成のキーマップエディタ（ドラッグ&ドロップ対応）
- カスタムキーやDPI・レイヤー切替といったデバイス固有アクションの設定
- キーマップ共有・いいね機能を想定したREST APIとクライアント実装
- Googleログイン（NextAuth）によるユーザー管理

## 技術スタック
- Next.js 15（App Router / React 19）
- Panda CSS（`styled-system`）によるデザインシステム
- Hono によるエッジ向け API ルーティング
- Cloudflare Pages / D1 / Wrangler
- TypeScript & ESLint

## ディレクトリ構成（抜粋）
```text
src/
  app/            Next.js App Router エントリ、API ルート、ページ
  components/     Panda CSS ベースのUIコンポーネント
  lib/            APIクライアントやデバイス関連のドメインロジック
migrations/       D1データベース用SQLマイグレーション
public/           静的アセット
styled-system/    Panda CSSのビルド成果物（`npm run prepare`で再生成）
```

## セットアップ手順
1. 依存関係のインストール
   ```bash
   npm install
   ```
2. 環境変数の設定（`.env.local` を想定）
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - Cloudflare D1 バインディング（`wrangler.toml` 参照）
   - 必要に応じて `APP_ENV`（`production` 時は NextAuth cookie を secure に）
3. 開発サーバー起動
   ```bash
   npm run dev
   ```
4. WebHID対応ブラウザ（Chrome, Edge, Operaなど）で `http://localhost:3000` にアクセス

## 用意されたnpmスクリプト
- `npm run dev` : Next.js開発サーバー
- `npm run build` : プロダクションビルド
- `npm run start` : ビルド成果物のローカル実行
- `npm run lint` : ESLint
- `npm run prepare` : Panda CSSコード生成
- `npm run pages:build` : Cloudflare Pages向けビルド（`@cloudflare/next-on-pages`）
- `npm run preview` : Pagesビルド + `wrangler pages dev` によるローカルプレビュー
- `npm run deploy` : Pagesへのデプロイ（事前に `preview` 実行推奨）
- `npm run cf-typegen` : Wrangler経由で`env.d.ts`を再生成（バインディング追加時）

## Cloudflare Pages / D1 ワークフロー
1. スキーマ変更は `migrations` ディレクトリの連番SQLを更新。
2. `wrangler.toml` でD1などのバインディングを管理。変更時は `npm run cf-typegen` を実行。
3. Pages環境を再現する際は `npm run pages:build` → `npm run preview` の順で確認。
4. 問題なければ `npm run deploy` でPagesに反映。

## デバイス機能の要点
- `src/lib/device` にキーマップ定義やHIDレポート生成のロジックを集約。
- `KeymapProvider` でアプリ全体のキーマップ状態を管理し、`KeymapComponent` がUIを構築。
- `DeviceCard` から接続したデバイスに対し、選択したスロット（1〜3）へ書き込み可能。

## 開発時のヒント
- スタイルはPandaのトークンを利用し、変更時は `npm run prepare` でリビルド。
- 新しいAPIルートは Hono ルーター（`src/app/api/[[...route]]`）に追加し、クライアント側は `src/lib/api/handlers` にまとめる。
- UI可視変更を行った場合はスクリーンショットや動画をPRに添付。
- テストは未導入のため、挙動確認手順をPRで共有。

## ライセンス
`LICENSE` を参照してください。
