# Supabase 数据库建表与配置指南

本项目已支持将所有用户的吐槽评论、AI评价、用户反驳打分与点赞持久化到 **Supabase（免费 PostgreSQL 云数据库）**。

---

## 1. 注册与创建 Supabase 项目

1. 前往 [Supabase 官网 (supabase.com)](https://supabase.com/) 并注册/登录账号。
2. 点击 **New Project** 创建一个新项目，设置名称（例如 `ai-comment`）和数据库密码。

---

## 2. 在 Supabase 中执行 SQL 建表

在 Supabase 控制台左侧菜单点击 **SQL Editor**，新建一个查询，粘贴以下 SQL 语句并点击 **Run** 运行：

```sql
-- 创建 comments 表
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  input TEXT NOT NULL,
  mode VARCHAR(50) NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER DEFAULT 3,
  user_rating INTEGER DEFAULT 0,
  user_custom_answer TEXT DEFAULT '',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 开启行级安全策略（RLS）或者允许所有人读写
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取和插入、更新
CREATE POLICY "Allow public read" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON comments FOR UPDATE USING (true);

-- 创建 replies（匿名盖楼回复表）
CREATE TABLE IF NOT EXISTS replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  nickname VARCHAR(50) DEFAULT '匿名社畜',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read replies" ON replies FOR SELECT USING (true);
CREATE POLICY "Allow public insert replies" ON replies FOR INSERT WITH CHECK (true);
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
