# 免费接入 Google Gemini 大模型指南

本项目已支持 **Google Gemini 1.5 Flash（官方提供完全免费的 API 配额）**！

---

## 1. 获取免费的 Gemini API Key（只需 1 分钟）

1. 打开 [Google AI Studio](https://aistudio.google.com/)。
2. 使用你的 Google 账号登录。
3. 点击左上角或页面中间的 **Get API key**。
4. 点击 **Create API key** -> 选择或新建一个 Google Cloud 项目。
5. 复制生成的 API Key（形如 `AIzaSy...`）。

---

## 2. 在 Render 线上环境中配置

1. 打开 [Render Dashboard](https://dashboard.render.com/)，进入你的 `ai-comment` 服务。
2. 点击左侧 **Environment**。
3. 点击 **Add Environment Variable**：
   - Key: `GEMINI_API_KEY`
   - Value: `你的 Gemini API Key (AIzaSy...)`
4. 点击 **Save Changes**。

Render 会自动重新部署，部署完成后，所有生成的社畜评论都将由 **Google Gemini 真实大模型** 实时创作！

---

## 3. 双模自动保护说明
- **未配置 API Key**：系统会自动使用本地编写的搞笑规则引擎生成，不花一分钱也能稳定运行。
- **配置了 API Key**：系统会自动调用真实 Gemini 大模型，输出更有梗、更毒舌、更懂打工人的评价。
