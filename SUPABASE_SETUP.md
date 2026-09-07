# Supabase 数据库建表与配置指南
# Supabase データベーステーブル作成・設定ガイド

本项目支持将「打工人广场」的工作评价、匿名吐槽及回复持久化到 **Supabase（免费 PostgreSQL 云数据库）**。  
本プロジェクトは「社畜広場」の仕事評価・匿名投稿・返信を **Supabase（無料 PostgreSQL クラウドデータベース）** に永続化することができます。

---

## 1. 在 Supabase 中执行 SQL 建表
## 1. Supabase で SQL テーブルを作成する

在 Supabase 控制台左侧菜单点击 **SQL Editor**，新建查询，粘贴以下 SQL 并点击 **Run** 运行：  
Supabase コンソール左側メニューの **SQL Editor** をクリックし、新規クエリを作成して以下の SQL を貼り付け、**Run** をクリックして実行してください：

```sql
-- 1. 创建 square_posts（打工人广场工作评价与心声表）
-- 1. square_posts テーブルを作成（社畜広場の仕事評価・吐槽テーブル）
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

-- 2. 创建 square_replies（匿名跟帖回复表）
-- 2. square_replies テーブルを作成（匿名返信テーブル）
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

-- 3. 创建 contacts（用户联系表单表）
-- 3. contacts テーブルを作成（お問い合わせテーブル）
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read contacts" ON contacts FOR SELECT USING (true);
```

---

## 2. 获取 API 密钥
## 2. API キーを取得する

在 Supabase 项目控制台中：  
Supabase プロジェクトコンソールで：

1. 点击左侧 **Project Settings** → **API**。  
   左側の **Project Settings** → **API** をクリックする。
2. 找到 **Project URL** 和 **anon public key**，复制备用。  
   **Project URL** と **anon public key** を見つけてコピーしておく。

---

## 3. 在 Render / 本地配置环境变量
## 3. Render / ローカルで環境変数を設定する

### 在 Render 部署中配置 / Render デプロイでの設定

1. 打开 [Render Dashboard](https://dashboard.render.com/)，进入你的 `ai-comment` Web Service。  
   [Render Dashboard](https://dashboard.render.com/) を開き、`ai-comment` Web Service に入る。
2. 点击左侧 **Environment**。  
   左側の **Environment** をクリックする。
3. 添加以下两个环境变量 / 以下の 2 つの環境変数を追加する：
   - `SUPABASE_URL`: 你的 Project URL / あなたの Project URL
   - `SUPABASE_KEY`: 你的 anon public key / あなたの anon public key
4. 保存后 Render 会自动重启服务，打工人广场数据将永久保存！  
   保存後、Render が自動で再起動し、社畜広場のデータが永続化されます！

### 在本地配置 / ローカルでの設定

在项目根目录创建 `.env` 文件 / プロジェクトルートに `.env` ファイルを作成する：

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-public-key
```

---

## 4. 降级保护说明
## 4. 降級保護について

- **未配置 Supabase 环境变量**：网站自动使用内存模式运行，功能正常，但重启后数据清空。  
  **Supabase 環境変数未設定時**：メモリモードで自動動作します。機能は正常ですが、再起動でデータが消えます。
- **已配置 Supabase 环境变量**：所有广场投稿、回复、联系表单数据永久保存到云端数据库。  
  **Supabase 環境変数設定済み**：広場の投稿・返信・お問い合わせデータがすべてクラウドDBに永久保存されます。
