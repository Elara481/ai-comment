# 免费接入 Google Gemini 大模型指南 / Google Gemini 大規模モデル無料接続ガイド

<p align="center">
  <a href="#gemini-zh">🇨🇳 中文</a> ／ <a href="#gemini-ja">🇯🇵 日本語</a>
</p>

---

<a id="gemini-zh"></a>

# 🇨🇳 中文

## 免费接入 Google Gemini 大模型指南

本项目已支持 **Google Gemini Flash（官方提供完全免费的 API 配额）**！

---

### 1. 获取免费的 Gemini API Key（只需 1 分钟）

1. 打开 [Google AI Studio](https://aistudio.google.com/)。
2. 使用你的 Google 账号登录。
3. 点击左上角或页面中间的 **Get API key**。
4. 点击 **Create API key** → 选择或新建一个 Google Cloud 项目。
5. 复制生成的 API Key（形如 `AIzaSy...`）。

---

### 2. 在 Render 线上环境中配置

1. 打开 [Render Dashboard](https://dashboard.render.com/)，进入你的 `ai-comment` 服务。
2. 点击左侧 **Environment**。
3. 点击 **Add Environment Variable**，填写以下内容：
   - Key: `GEMINI_API_KEY`
   - Value: 你的 Gemini API Key（`AIzaSy...`）
4. 点击 **Save Changes**。

Render 会自动重新部署，部署完成后，所有生成的评论都将由 **Google Gemini 真实大模型** 实时创作！

---

### 3. 双模自动保护说明

- **未配置 API Key**：系统会自动使用本地规则引擎生成评论，不花一分钱也能稳定运行。
- **已配置 API Key**：系统会自动调用真实 Gemini 大模型，输出更有梗、更毒舌、更懂打工人的评价。

---

<p align="right"><a href="#top">▲ 返回顶部</a></p>

---
---

<a id="gemini-ja"></a>

# 🇯🇵 日本語

## Google Gemini 大規模モデル無料接続ガイド

本プロジェクトは **Google Gemini Flash（公式が完全無料の API クォータを提供）** に対応しています！

---

### 1. 無料の Gemini API Key を取得する（1分でできます）

1. [Google AI Studio](https://aistudio.google.com/) を開く。
2. Google アカウントでログインする。
3. 左上または画面中央の **Get API key** をクリックする。
4. **Create API key** をクリック → Google Cloud プロジェクトを選択または新規作成する。
5. 生成された API Key（`AIzaSy...` という形式）をコピーする。

---

### 2. Render 本番環境での設定

1. [Render Dashboard](https://dashboard.render.com/) を開き、`ai-comment` サービスに入る。
2. 左側メニューの **Environment** をクリックする。
3. **Add Environment Variable** をクリックし、以下を入力する：
   - Key: `GEMINI_API_KEY`
   - Value: 取得した Gemini API Key（`AIzaSy...`）
4. **Save Changes** をクリックする。

Render が自動で再デプロイされ、完了後はすべての評論が **Google Gemini 大モデル** によってリアルタイムで生成されます！

---

### 3. デュアルモード自動保護について

- **API Key 未設定時**：ローカルのルールベースエンジンで自動生成します。費用ゼロで安定動作します。
- **API Key 設定済み**：本物の Gemini 大モデルを呼び出し、よりキレのある、より毒舌な、より社畜心をわかった評論を出力します。

---

<p align="right"><a href="#top">▲ トップへ戻る</a></p>
