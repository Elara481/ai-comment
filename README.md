# AI打工人点评家 / AI社畜評論家

<p align="center">
  <a href="#chinese">🇨🇳 中文</a> ／ <a href="#japanese">🇯🇵 日本語</a>
</p>

---

<a id="chinese"></a>

# 🇨🇳 中文

## AI打工人点评家

今天的你，由AI毫不留情地点评。

### 🌐 在线体验 / Live Demo

👉 **[https://ai-comment-5mof.onrender.com/](https://ai-comment-5mof.onrender.com/)**

> ※ 使用免费计划托管，首次访问时启动可能需要 30～50 秒，请耐心等待。

---

### 项目简介

「AI打工人点评家」是一个娱乐向 Web 应用，针对用户输入的日常/工作内容，生成 AI 风格的毒辣点评。

**评论生成引擎为双层设计**：配置环境变量 `GEMINI_API_KEY` 后，由 Google Gemini 大模型实时创作；未配置时自动降级为本地规则引擎（`commentGenerator.ts`），两种状态下应用均可正常运行。

界面内置**日语 / 中文切换功能**（`i18n.js`），全站页面语言可动态切换。

---

### 主要功能

#### 1. 点评生成（`/api/generate`）
- 根据输入内容和所选 AI 模式生成点评
- 显示 1～5 星评分，评分随关键词动态变化
- **接入 Gemini API 时**：由 `gemini-3.6-flash` 模型实时生成
- **未接入时**：由 `commentGenerator.ts` 规则引擎分别生成日文和中文点评

#### 2. AI 模式（5种）

| 模式（中文） | 模式（日文） | 人设 |
|---|---|---|
| **毒舌AI** 😈 | 毒舌AI | 毒舌刻薄，结尾给一丝鼓励 |
| **温柔AI** 😊 | 優しいAI | 全力肯定，积极向上地鼓励 |
| **上司AI** 👔 | 上司AI | 满口职场黑话，绩效面谈施压风 |
| **同期AI** 🤝 | 同期AI | 像好朋友一样共情吐槽 |
| **极限社畜AI** 😵 | 限界社畜AI | 连续加班、生无可恋的颓废自嘲 |

#### 3. 语言切换
- 导航栏右上角的 **日本語 / 中文** 按钮可切换全站 UI 语言
- 所有文案集中定义在 `public/js/i18n.js`，API 调用时也会传递当前语言参数（`lang`）

#### 4. 用户互动评价与反驳功能
- **反向评分（★1～5）**：用户可对 AI 点评结果打分
- **理想回答 / 反驳输入**：对 AI 评价不满时，可记录自己的反驳意见
- 反馈内容自动保存至 LocalStorage，历史记录页随时可查

#### 5. 打工人广场（`/square`）
- 全员动态实时共享（昵称、职位、工作吐槽、评分）
- **点赞功能**（`/api/square/like`）
- **匿名跟帖回复功能**（`/api/square/reply`）
- 接入 Supabase 时持久化至 `square_posts` / `square_replies` 表；未接入时内存降级运行

#### 6. 历史记录（`/history`）
- 生成结果、用户评分与反驳自动保存至浏览器 LocalStorage
- 展示输入内容、AI 模式、生成点评、用户反馈及时间
- 支持一键清空所有历史

#### 7. 随机话题
- 点击"今日话题"按钮，随机题目自动填入输入框
- 日文、中文各预置 15 种话题（`commentGenerator.ts` 中的 `randomTopics` / `randomTopicsZh`）

#### 8. 联系表单（`/contact`）
- 可填写姓名、邮箱及问题内容并提交
- 接入 Supabase 时保存至 `contacts` 表

---

### 技术栈

| 分类 | 技术 |
|---|---|
| **后端** | Node.js, Express, TypeScript |
| **前端** | EJS, JavaScript, CSS |
| **AI引擎（主）** | Google Gemini API（`@google/generative-ai`） |
| **AI引擎（降级）** | 本地规则引擎（`commentGenerator.ts`） |
| **云数据库** | Supabase（PostgreSQL）/ 内存降级 |
| **国际化** | `public/js/i18n.js`（日语 / 中文） |
| **部署** | Render |
| **端口** | 8091（本地） |

---

### 安装与启动

#### 环境要求
- Node.js（推荐 v14 及以上）
- npm

#### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/Elara481/ai-comment.git
cd ai-comment
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量（可选）
```bash
# 在项目根目录创建 .env 文件
GEMINI_API_KEY=AIzaSy...        # Google Gemini API Key（可选）
SUPABASE_URL=https://xxx...     # Supabase 项目 URL（可选）
SUPABASE_KEY=eyJhbGci...        # Supabase anon key（可选）
```
> ※ 不配置环境变量也可正常运行，使用本地规则引擎 + 内存模式。

4. 编译并启动
```bash
npm run dev
```

或分步执行：
```bash
npm run build   # 仅编译 TypeScript
npm start       # 仅启动服务器
```

5. 在浏览器中访问
```
http://localhost:8091
```

#### Windows 一键启动

双击 `start.bat`，脚本将自动完成 Node.js 检查、依赖安装、编译与启动。

---

### 项目结构

```
ai-comment/
├── src/
│   ├── server.ts              # Express 服务器及全部 API 端点
│   ├── aiService.ts           # Gemini API 调用 + 降级控制逻辑
│   ├── commentGenerator.ts    # 本地规则引擎（日文/中文点评生成）
│   └── supabase.ts            # Supabase 客户端初始化及类型定义
├── views/
│   ├── index.ejs              # 首页（点评生成）
│   ├── square.ejs             # 打工人广场
│   ├── history.ejs            # 历史记录页
│   └── contact.ejs            # 联系页
├── public/
│   ├── css/style.css          # 样式表
│   └── js/
│       ├── i18n.js            # 中日双语国际化配置
│       ├── main.js            # 首页脚本
│       ├── square.js          # 广场脚本
│       ├── history.js         # 历史记录脚本
│       └── contact.js         # 联系页脚本
├── dist/                      # 编译后的 JS（自动生成）
├── GEMINI_SETUP.md            # Gemini API Key 配置指南
├── SUPABASE_SETUP.md          # Supabase 配置及 SQL 建表指南
├── package.json
├── tsconfig.json
├── start.bat                  # Windows 启动脚本
└── README.md
```

---

### 外部服务配置

- **Gemini API**：请参阅 [`GEMINI_SETUP.md`](GEMINI_SETUP.md)
- **Supabase**：请参阅 [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)（含完整 SQL 建表语句）

---

### 注意事项

- 未配置 `GEMINI_API_KEY` 时，使用本地规则引擎运行，功能完全可用
- 未配置 `SUPABASE_URL` / `SUPABASE_KEY` 时，广场与联系表单数据仅保存在内存中，重启后清空
- 历史记录保存在浏览器 LocalStorage 中，清除浏览器数据后记录将一并删除
- 联系表单在未接入 Supabase 时，内容仅输出至服务器控制台日志

---

### 许可证

MIT License

---

### 开发者

AI 打工人点评家开发团队

**欢迎体验，尽情吐槽！** 🎉

---

<p align="right"><a href="#top">▲ 返回顶部</a></p>

---
---

<a id="japanese"></a>

# 🇯🇵 日本語

## AI社畜評論家

あなたの今日を、AIが容赦なく評価します。

### 🌐 オンライン体験 / Live Demo

👉 **[https://ai-comment-5mof.onrender.com/](https://ai-comment-5mof.onrender.com/)**

> ※ 無料プランでホスティングしているため、初回アクセス時は起動に30秒〜50秒ほどかかる場合があります。

---

### 概要

「AI社畜評論家」は、ユーザーが入力した日常・仕事内容に対してAI風の評論コメントを生成するエンタメ系Webアプリです。

**コメント生成エンジンは2層構成**になっており、環境変数 `GEMINI_API_KEY` を設定すると Google Gemini 大モデルが実際に文章を生成し、未設定の場合はローカルのルールベースエンジンに自動フォールバックします。どちらの状態でもアプリは問題なく動作します。

UIには**日本語 / 中文の切り替え機能**（`i18n.js`）が実装されており、全ページで言語を動的に切り替えることができます。

---

### 主な機能

#### 1. コメント生成（`/api/generate`）
- ユーザーの入力とAIモードに応じて評論コメントを生成
- 5段階評価（★）を表示。入力キーワードで評価が変動
- **Gemini API 接続時**：`gemini-3.6-flash` モデルがリアルタイムで生成
- **未接続時**：`commentGenerator.ts` のルールベースエンジンが日本語・中国語双方でコメントを生成

#### 2. AIモード（5種類）

| モード（日本語） | モード（中文） | キャラクター |
|---|---|---|
| **毒舌AI** 😈 | 毒舌AI | 辛口で少し意地悪、最後にひとこと励ます |
| **優しいAI** 😊 | 温柔AI | 肯定的で前向きに励ます |
| **上司AI** 👔 | 上司AI | ビジネス風評価面談、プレッシャーをかける |
| **同期AI** 🤝 | 同期AI | 友達口調で共感しながらツッコむ |
| **限界社畜AI** 😵 | 极限社畜AI | 疲弊した社畜目線の自虐コメント |

#### 3. 言語切り替え機能
- ナビバー右上の **日本語 / 中文** ボタンで全UIを切り替え
- `public/js/i18n.js` にすべての文言が定義されており、API呼び出し時も選択言語（`lang` パラメータ）が渡される

#### 4. ユーザーインタラクティブ評価・反論機能
- **逆評価（★1〜5）**：AIの評論に対してユーザー自身が点数をつけられる
- **理想の回答 / 反論入力**：AIの評価に納得いかない場合、自分の意見を記録できる
- フィードバック内容はLocalStorageに自動保存され、履歴ページで確認できる

#### 5. 社畜広場（`/square`）
- 全ユーザーの投稿（ニックネーム・職種・仕事評価・吐槽）をリアルタイム共有
- **いいね機能**（`/api/square/like`）
- **匿名コメント返信機能**（`/api/square/reply`）
- Supabase 接続時は `square_posts` / `square_replies` テーブルに永続化。未接続時はメモリでフォールバック動作

#### 6. 履歴機能（`/history`）
- 生成結果・ユーザー評価・反論をブラウザの LocalStorage に自動保存
- 入力内容、AIモード、生成コメント、ユーザーフィードバック、日時を一覧表示
- 全履歴削除機能付き

#### 7. ランダムお題
- 「今日のお題」ボタンでランダムなネタが入力欄に自動入力
- 日本語・中国語それぞれ15種類のお題を搭載（`commentGenerator.ts` の `randomTopics` / `randomTopicsZh`）

#### 8. お問い合わせフォーム（`/contact`）
- 名前・メールアドレス・問い合わせ内容を入力して送信
- Supabase 接続時は `contacts` テーブルに保存

---

### 技術スタック

| 区分 | 技術 |
|---|---|
| **バックエンド** | Node.js, Express, TypeScript |
| **フロントエンド** | EJS, JavaScript, CSS |
| **AIエンジン（上位）** | Google Gemini API（`@google/generative-ai`） |
| **AIエンジン（フォールバック）** | ローカルルールベース（`commentGenerator.ts`） |
| **クラウドDB** | Supabase（PostgreSQL）/ 内メモリフォールバック |
| **国際化** | `public/js/i18n.js`（日本語 / 中文） |
| **デプロイ** | Render |
| **ポート** | 8091（ローカル） |

---

### セットアップ方法

#### 必要な環境
- Node.js（v14以上推奨）
- npm

#### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/Elara481/ai-comment.git
cd ai-comment
```

2. 依存パッケージをインストール
```bash
npm install
```

3. 環境変数を設定（任意）
```bash
# .env ファイルをプロジェクトルートに作成
GEMINI_API_KEY=AIzaSy...        # Google Gemini API Key（任意）
SUPABASE_URL=https://xxx...     # Supabase プロジェクト URL（任意）
SUPABASE_KEY=eyJhbGci...        # Supabase anon key（任意）
```
> ※ 環境変数を設定しなくても、ローカルエンジン＋メモリモードで動作します。

4. TypeScriptをコンパイル＆起動
```bash
npm run dev
```

または個別に実行：
```bash
npm run build   # コンパイルのみ
npm start       # 起動のみ
```

5. ブラウザで以下のURLにアクセス
```
http://localhost:8091
```

#### Windows用簡単起動

`start.bat` をダブルクリックするだけで Node.js の確認・インストール・ビルド・起動が自動実行されます。

---

### プロジェクト構造

```
ai-comment/
├── src/
│   ├── server.ts              # Express サーバー・全 API エンドポイント
│   ├── aiService.ts           # Gemini API 呼び出し + フォールバック制御
│   ├── commentGenerator.ts    # ローカルルールベースコメント生成（日本語・中文）
│   └── supabase.ts            # Supabase クライアント初期化・型定義
├── views/
│   ├── index.ejs              # ホームページ（評価生成）
│   ├── square.ejs             # 社畜広場
│   ├── history.ejs            # 履歴ページ
│   └── contact.ejs            # お問い合わせページ
├── public/
│   ├── css/style.css          # スタイルシート
│   └── js/
│       ├── i18n.js            # 日中切り替え国際化設定
│       ├── main.js            # ホームページのスクリプト
│       ├── square.js          # 社畜広場のスクリプト
│       ├── history.js         # 履歴ページのスクリプト
│       └── contact.js         # お問い合わせページのスクリプト
├── dist/                      # コンパイル後の JS（自動生成）
├── GEMINI_SETUP.md            # Gemini API Key 設定ガイド
├── SUPABASE_SETUP.md          # Supabase 設定・SQL ガイド
├── package.json
├── tsconfig.json
├── start.bat                  # Windows 起動スクリプト
└── README.md
```

---

### 外部サービスのセットアップ

- **Gemini API**：[`GEMINI_SETUP.md`](GEMINI_SETUP.md) を参照
- **Supabase**：[`SUPABASE_SETUP.md`](SUPABASE_SETUP.md) を参照（SQLテーブル定義あり）

---

### 注意事項

- `GEMINI_API_KEY` 未設定時はルールベースエンジンで動作します（機能は完全に使えます）
- `SUPABASE_URL` / `SUPABASE_KEY` 未設定時は広場・お問い合わせのデータはメモリ保存となり、再起動で消えます
- 履歴はブラウザの LocalStorage に保存されるため、ブラウザデータを削除すると消えます
- お問い合わせフォームは Supabase 未接続時、サーバーのコンソールログにのみ出力されます

---

### ライセンス

MIT License

---

### 作成者

AI社畜評論家開発チーム

**楽しんでご利用ください！** 🎉

---

<p align="right"><a href="#top">▲ トップへ戻る</a></p>
