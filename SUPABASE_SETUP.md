# Supabase 数据库建表与配置指南

本项目支持将「社畜广场」的工作评价、匿名吐槽以及其他人的匿名评论回复持久化到 **Supabase（免费 PostgreSQL 云数据库）**。

---

## 在 Supabase 中执行 SQL 建表

在 Supabase 控制台左侧菜单点击 **SQL Editor**，新建一个查询，粘贴以下 SQL 语句并点击 **Run** 运行：

```sql
-- 1. 创建 square_posts（社畜广场工作评价与心声表）
CREATE TABLE IF NOT EXISTS square_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name VARCHAR(50) DEFAULT '匿名社畜',
  job_type VARCHAR(50) DEFAULT '社畜',
  content TEXT NOT NULL,
  work_rating INTEGER DEFAULT 3,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE square_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read square_posts" ON square_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert square_posts" ON square_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update square_posts" ON square_posts FOR UPDATE USING (true);

-- 2. 创建 square_replies（他人匿名评价/跟帖互动表）
CREATE TABLE IF NOT EXISTS square_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES square_posts(id) ON DELETE CASCADE,
  nickname VARCHAR(50) DEFAULT '匿名社畜',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE square_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read square_replies" ON square_replies FOR SELECT USING (true);
CREATE POLICY "Allow public insert square_replies" ON square_replies FOR INSERT WITH CHECK (true);
```

---

## 3. 获取 API 密钥并在 Render / 本地配置

在 Supabase 项目控制台中：
1. 点击左侧 **Project Settings** -> **API**。
2. 找到 **Project URL** 和 **anon public key**。

### 在 Render 部署中配置环境变量：
1. 打开 [Render Dashboard](https://dashboard.render.com/)，进入你的 `ai-comment` Web Service。
2. 点击左侧 **Environment**。
3. 添加以下两个环境变量：
   - `SUPABASE_URL`: `你的 Project URL`
   - `SUPABASE_KEY`: `你的 anon public key`
4. 保存后 Render 会自动重启服务，开启全网公共广场！

---

## 4. 特性说明
- **渐进式降级保护**：即使未配置 Supabase 环境变量，网站依然会自动使用内存模式正常运行，不会崩溃。
