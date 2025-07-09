# 🌸 タスクリスト - 和風Todoアプリケーション

> 美しい日本風デザインと高機能を兼ね備えたタスク管理アプリケーション

![Demo](https://img.shields.io/badge/Demo-Live-brightgreen) ![Version](https://img.shields.io/badge/Version-2.0-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🖼️ プレビュー

![アプリスクリーンショット](https://via.placeholder.com/800x400/ff6b6b/ffffff?text=Japanese+Todo+App)

## ✨ 主な機能

### 📋 タスク管理
- ✅ **CRUD操作**: タスクの追加、編集、削除、完了
- 📅 **期限日と優先度**: 締切日と重要度の設定
- 🏷️ **カテゴリとタグ**: 詳細な分類システム
- 🔍 **検索とフィルター**: 高度な検索機能
- 📊 **統計情報**: 生産性と進捗の分析

### 🎨 美しいデザイン
- 🌸 **和風デザイン**: 桜をモチーフにした日本的な美しさ
- 🌙 **ダーク/ライトモード**: お好みに合わせたテーマ切り替え
- 📱 **レスポンシブデザイン**: モバイル・タブレット完全対応
- ✨ **滑らかなアニメーション**: 心地よい操作感

### ⚡ 高度な機能
- 🖱️ **ドラッグ&ドロップ**: 直感的なタスク並び替え
- ⏱️ **ポモドーロタイマー**: 25分集中作業タイマー
- 🔄 **サブタスク**: 大きなタスクを細分化
- 📦 **一括操作**: 複数タスクの同時処理
- ☁️ **自動バックアップ**: 5分間隔の自動保存
- 📤 **エクスポート/インポート**: JSON形式でのデータ移行
- ⌨️ **キーボードショートカット**: 効率的な操作
- 📱 **PWA対応**: アプリのようにインストール可能

## 🚀 インストールと実行

### システム要件
- モダンブラウザ（Chrome、Firefox、Safari、Edge）
- その他のインストールは不要！

### 方法1: 直接実行
1. **プロジェクトをダウンロード**:
   ```bash
   git clone https://github.com/your-username/japanese-todo-app.git
   cd japanese-todo-app
   ```

2. **HTMLファイルを開く**:
   - `index.html`をダブルクリック
   - またはブラウザにファイルをドラッグ&ドロップ

### 方法2: ローカルサーバーで実行（推奨）
```bash
# Python使用（インストール済みの場合）
python -m http.server 8000

# Node.js使用
npx http-server

# PHP使用
php -S localhost:8000

# Live Server（VS Code拡張機能）
# Live Serverをインストール → "Go Live"をクリック
```

その後、`http://localhost:8000` にアクセス

## 📖 使用方法

### 新しいタスクの追加
1. 「新しいタスクを追加...」に入力
2. 期限日を設定（任意）
3. 優先度を選択：低/中/高
4. カテゴリを選択：仕事/個人/買い物/健康
5. 「追加」ボタンをクリックまたはEnterキー

### タスクの管理
- **完了**: 左側のチェックボックス ✅ をクリック
- **編集**: タスク名をクリック
- **削除**: 🗑️ ボタンをクリック
- **並び替え**: ドラッグ&ドロップで順序変更
- **サブタスク追加**: タスク内の「+」ボタンをクリック

### 高度な機能
- **ポモドーロ**: ⏱️ アイコンをクリックして25分タイマー開始
- **一括操作**: 複数のタスクを選択して一括処理
- **タグ**: 詳細な分類のためのタグ追加
- **検索**: 検索ボックスで素早くタスクフィルタリング

## ⌨️ キーボードショートカット

| ショートカット | 機能 |
|---------------|------|
| `N` | 新しいタスクを追加 |
| `Ctrl + F` | 検索 |
| `Ctrl + A` | 全タスクを選択 |
| `Ctrl + D` | 完了タスクを削除 |
| `Delete` | 選択したタスクを削除 |
| `Ctrl + M` | ダークモード切り替え |
| `Ctrl + E` | データをエクスポート |
| `Ctrl + I` | データをインポート |
| `Ctrl + B` | 手動バックアップ |
| `Ctrl + Z` | 元に戻す |
| `Ctrl + Y` | やり直し |
| `?` | ヘルプを表示 |
| `Esc` | モーダル/パネルを閉じる |

## 📁 プロジェクト構造

```
todo_list/
├── 📄 index.html              # メインHTMLファイル
├── 🎨 style.css               # CSSスタイリングとアニメーション
├── ⚙️ app.js                  # メインJavaScriptロジック
├── ☁️ cloud-sync.js           # バックアップと同期機能
├── 📊 analytics.js            # 分析と統計機能
├── 📱 manifest.json           # PWA設定
├── 🖼️ icons/                  # PWA用アイコンフォルダ
│   ├── icon-192x192.png
│   ├── icon-512x512.png
│   └── icon.svg
├── 📸 screenshots/            # README用スクリーンショット
├── 📖 README.md               # このドキュメント
└── 📄 LICENSE                 # MITライセンス
```

## 🛠️ 使用技術

### フロントエンド
- **HTML5**: セマンティックマークアップ
- **CSS3**: Flexbox、Grid、アニメーション
- **JavaScript (ES6+)**: モダンJS機能
- **Tailwind CSS**: ユーティリティファーストCSSフレームワーク

### ライブラリとツール
- **Font Awesome 6**: アイコン
- **Google Fonts**: Noto Sans JPフォント
- **LocalStorage**: データ永続化
- **Service Worker**: PWAオフライン対応

### 機能
- **レスポンシブデザイン**: モバイルファーストアプローチ
- **PWA**: プログレッシブウェブアプリ
- **クロスブラウザ**: Chrome、Firefox、Safari、Edge対応
- **パフォーマンス**: 最適化されたローディングとレンダリング

## 📱 プログレッシブウェブアプリ (PWA)

このアプリはPWAに対応しており、ネイティブアプリのようにインストール可能です：

### インストール方法：
1. **デスクトップ**: 
   - Chrome/Edge: アドレスバーの「インストール」アイコンをクリック
   - Firefox: メニュー → 「このサイトをアプリとしてインストール」

2. **モバイル**:
   - Safari: 共有 → 「ホーム画面に追加」
   - Chrome: メニュー → 「ホーム画面に追加」

### PWA機能：
- ✅ オフライン動作
- ✅ デスクトップ/ホーム画面にアイコン
- ✅ フルスクリーン体験
- ✅ キャッシュによる高速読み込み

## 🌐 デモとリンク

- 🔗 **ライブデモ**: [https://your-username.github.io/japanese-todo-app](https://your-username.github.io/japanese-todo-app)
- 📱 **PWAデモ**: [https://your-app.netlify.app](https://your-app.netlify.app)
- 🎥 **動画デモ**: [YouTube Link](https://youtube.com/watch?v=...)

## 📸 スクリーンショット

### 🖥️ デスクトップ表示
![デスクトップ ライトモード](screenshots/desktop-light.png)
![デスクトップ ダークモード](screenshots/desktop-dark.png)

### 📱 モバイル表示
![モバイルインターフェース](screenshots/mobile.png)

### ⚡ 機能
![ポモドーロタイマー](screenshots/pomodoro.png)
![分析ダッシュボード](screenshots/analytics.png)

## 🧪 テスト

### 手動テスト
- ✅ 全てのCRUD操作
- ✅ 複数デバイスでのレスポンシブデザイン
- ✅ ダーク/ライトモードの切り替え
- ✅ データの永続化
- ✅ PWAインストール

### ブラウザ互換性
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚀 デプロイ

### GitHub Pages
```bash
# GitHubにコードをプッシュ
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main

# SettingsでGitHub Pagesを有効化
```

### Netlify
1. [Netlify](https://netlify.com)にフォルダをドラッグ&ドロップ
2. またはGitHubリポジトリと連携

### Vercel
```bash
npm i -g vercel
vercel --prod
```

## 🤝 貢献

あらゆる貢献を歓迎します！

### 貢献方法：
1. **Fork** リポジトリ
2. **Create** 機能ブランチ: `git checkout -b feature/AmazingFeature`
3. **Commit** 変更: `git commit -m 'Add some AmazingFeature'`
4. **Push** ブランチ: `git push origin feature/AmazingFeature`
5. **Open** プルリクエスト

### ルール：
- クリーンなコードとコメント
- PR提出前のテスト
- 既存のコードスタイルに従う
- 必要に応じてドキュメント更新

## 🐛 バグ報告

バグを発見した場合は、以下の情報でissueを作成してください：
- **ブラウザとバージョン**: Chrome 91、Firefox 89など
- **OS**: Windows 10、macOS Big Surなど
- **再現手順**: バグを再現する手順
- **期待値vs実際値**: 期待した結果vs実際の結果
- **スクリーンショット**: 可能であれば

## 💡 機能リクエスト

新機能のアイデアがありますか？`enhancement`ラベルでissueを作成してください：
- **説明**: 機能の詳細説明
- **使用例**: なぜこの機能が必要か？
- **実装案**: 実装方法のアイデア

## 📄 ライセンス

このプロジェクトは **MIT License** の下で配布されています。詳細は `LICENSE` ファイルを参照してください。

```
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

## 🙏 謝辞

### 感謝：
- [**Tailwind CSS**](https://tailwindcss.com/) - 素晴らしいCSSフレームワーク
- [**Font Awesome**](https://fontawesome.com/) - 美しいアイコン
- [**Google Fonts**](https://fonts.google.com/) - Noto Sans JPフォント
- [**Unsplash**](https://unsplash.com/) - ストック写真
- **日本のデザイン** - 伝統的な美学

### インスピレーション：
- Todoist - タスク管理機能
- Notion - クリーンなインターフェースデザイン
- TickTick - ポモドーロ統合
- 日本のミニマリズム - デザイン哲学

## 👤 作者

**Your Name**
- 🌐 ウェブサイト: [yourwebsite.com](https://yourwebsite.com)
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)
- 📧 メール: your.email@example.com
- 💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourname)
- 🐦 Twitter: [@yourusername](https://twitter.com/yourusername)

## 📊 プロジェクト統計

![GitHub stars](https://img.shields.io/github/stars/yourusername/japanese-todo-app)
![GitHub forks](https://img.shields.io/github/forks/yourusername/japanese-todo-app)
![GitHub issues](https://img.shields.io/github/issues/yourusername/japanese-todo-app)
![GitHub license](https://img.shields.io/github/license/yourusername/japanese-todo-app)

---

<div align="center">

**⭐ このプロジェクトが役に立った場合は、スターをつけてください！ ⭐**

**❤️ とたくさんの ☕ で作られました**

⬆ トップに戻る

</div>