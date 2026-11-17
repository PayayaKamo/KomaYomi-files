# KomaYomi Files

[English](README.md) | [简体中文](README.zh-CN.md) | **日本語**

KomaYomi 向け `.mnproj` 作品ストアです。完全な静的サイトで、現在は『ご注文はうさぎですか？』
『ゆるゆり』『大室家』の 3 作品を掲載しています。各作品は 1 つの `.mnproj` プロジェクト
ファイルに対応しており、ダウンロード後に [KomaYomi デスクトップ版](https://github.com/PayayaKamo/KomaYomi)
または [モバイル版](https://github.com/PayayaKamo/KomaYomi-mobile) で開けばそのまま読めます。

- リポジトリ：<https://github.com/PayayaKamo/KomaYomi-files>
- Apple App Store 風のデザイン言語を踏襲しています（tokens.css / SidebarNav / PosterCard /
  SectionHeader / PillButton / Artwork / HorizontalShelf）。

## 技術スタック

- Vue 3.5 + TypeScript + Vue Router 4
- Vite 6 でビルドし、成果物は完全な静的ファイル

## ページとルート

| ルート | ページ |
|--------|--------|
| `/store` | 作品棚：編集部おすすめの小型カード（3 作品共通のポスターカード）、カテゴリタブ、特集コレクションの横スクロール、ランキング、全作品。`?q=` で作品名 / 原題 / 作者 / タグを絞り込み |
| `/titles/:slug` | 作品詳細：ヒーロー画像とアイコン、ダウンロードボタン、スクリーンショットの横スクロール、あらすじ、情報表、評価とレビュー（サンプル）、巻ごとに折りたたみ可能な章一覧、バージョン履歴 |
| `/guide` | 使い方ガイド：`.mnproj` とは何か、各プラットフォームへの入口、FAQ |
| `/` | `/store` へリダイレクト |

ダウンロードボタンは作品パックの公開後だけ有効になります。未公開の間は「準備中」と表示され、
無効化されます。画面上の評価、レビュー、ランキング、コレクション、編集部おすすめの文言は
すべてサンプルで、UI 上に対応する注記があります。

## データ管理

唯一のデータソースは [src/data/titles.ts](src/data/titles.ts)、型定義は
[src/types/title.ts](src/types/title.ts) です。

### 作品情報

作品名、原題、ローマ字、作者、ステータス、あらすじ、タグ、アクセントカラー。

### 巻と話

`volumes[].chapters[]` に話号を記録し、`packed: true` で現在の `.mnproj` に実際に収録されて
いる話を示します。未確認の章タイトルは記載せず、画面には話号のみを表示します。

### 作品パックの公開

1. ファイルを `public/packs/<slug>.mnproj` に配置します（例：
   `public/packs/gochiusa-14.mnproj`）。
2. 対応する `pack.status` を `'available'` に変更し、実際の `sizeLabel` を入力します
   （例：`'24.6 MB'`）。

変更後は詳細ページとポスターカードにダウンロード入口が自動的に表示され、コンポーネントの
変更は不要です。

### カバー画像の仕様

`public/covers/<slug>.jpg`。`demo-project.mnproj` のページ画像から抽出したもので、幅 800px、
1 枚 300KB 以内に収めています。

## 開発とビルド

```bash
npm install
npm run dev        # http://localhost:5273
npm run build      # vue-tsc の型チェック + vite build
npm run preview
```

## デプロイ

`dist/` は任意の静的サーバーに配置できます。history ルーティングを使うため、未知のパスは
`index.html` にフォールバックする必要があります（[nginx.conf](nginx.conf) の `try_files` を
参照）。

### GitHub Pages

リポジトリには [.github/workflows/deploy.yml](.github/workflows/deploy.yml) が含まれており、
`main` への push ごとにビルドして GitHub Pages へ公開します。

- URL：<https://payayakamo.github.io/KomaYomi-files/>
- プロジェクトサイトは `/KomaYomi-files/` サブパス配下にあります。workflow が `VITE_BASE`
  で base を注入し、Vite のアセットと vue-router の history が同じ base を使います。
- ビルド後に `dist/index.html` を `dist/404.html` へコピーし、詳細ページなどの深いリンクでも
  読み込めるようにしています。
- 初回デプロイ時は Settings → Pages の Source を **GitHub Actions** に設定してください
  （GITHUB_TOKEN には Pages サイトを作成する権限がないため、一度手動で有効化が必要です）。

### 別のマシンへのデプロイ

別のマシンへ配置する場合は、既定のルートパスのままで問題ありません。

```bash
npm run build          # base は /
# サブパスで配信する場合は base を明示的に指定
VITE_BASE=/sub-path/ npm run build
```
