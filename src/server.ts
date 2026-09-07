import express, { Request, Response } from 'express';
import path from 'path';
import { generateAIComment } from './aiService';
import { supabase, fallbackFeed, fallbackReplies, FeedItem, ReplyItem } from './supabase';

const app = express();
const PORT = process.env.PORT || 8091;

// ミドルウェア設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// EJSテンプレートエンジン設定
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// ルート
app.get('/', (req: Request, res: Response) => {
  res.render('index', { title: 'AI社畜評論家' });
});

app.get('/square', (req: Request, res: Response) => {
  res.render('square', { title: '社畜広場 - AI社畜評論家' });
});

app.get('/history', (req: Request, res: Response) => {
  res.render('history', { title: '履歴 - AI社畜評論家' });
});

app.get('/contact', (req: Request, res: Response) => {
  res.render('contact', { title: 'お問い合わせ - AI社畜評論家' });
});

// API エンドポイント
app.post('/api/generate', async (req: Request, res: Response) => {
  const { input, mode, lang } = req.body;

  // 入力チェック
  if (!input || input.trim() === '') {
    return res.status(400).json({ error: '入力内容を入力してください。' });
  }

  if (input.length > 200) {
    return res.status(400).json({ error: '入力は200文字以内にしてください。' });
  }

  // 禁止文字チェック
  const forbiddenChars = ['<', '>', '&', ';'];
  for (const char of forbiddenChars) {
    if (input.includes(char)) {
      return res.status(400).json({ error: `禁止文字「${char}」が含まれています。` });
    }
  }

  if (!mode) {
    return res.status(400).json({ error: 'AIモードを選択してください。' });
  }

  try {
    const result = await generateAIComment(input, mode, lang || 'ja');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'コメント生成中にエラーが発生しました。' });
  }
});

// 广场 API：获取工作心声与评价帖子列表（附带他人的匿名盖楼回复）
app.get('/api/square', async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data: posts, error } = await supabase
        .from('square_posts')
        .select(`
          *,
          square_replies (
            id,
            nickname,
            content,
            created_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase square_posts fetch error, trying simple query:', error);
        const { data: simplePosts, error: simpleErr } = await supabase
          .from('square_posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (simpleErr) {
          // 如果 square_posts 尚未建表，尝试回退到旧 comments 表或内存
          const { data: oldComments } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
          return res.json(oldComments || fallbackFeed);
        }
        return res.json(simplePosts || fallbackFeed);
      }
      
      // 统一回复字段名 replies
      const formatted = (posts || []).map((p: any) => ({
        ...p,
        replies: p.square_replies || p.replies || []
      }));

      return res.json(formatted);
    } else {
      return res.json(fallbackFeed);
    }
  } catch (err) {
    console.error('API /api/square error:', err);
    res.status(500).json({ error: 'Failed to fetch square posts' });
  }
});

// 广场 API：用户发布自己的工作评价/心声吐槽
app.post('/api/square/post', async (req: Request, res: Response) => {
  const { authorName, jobType, content, workRating } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '内容を入力してください / 请输入评价内容' });
  }

  if (content.length > 300) {
    return res.status(400).json({ error: '300文字以内で入力してください / 请在300字以内' });
  }

  const safeAuthor = (authorName && authorName.trim()) ? authorName.trim().substring(0, 20) : '匿名社畜';
  const safeJob = (jobType && jobType.trim()) ? jobType.trim().substring(0, 20) : '社畜';
  const safeContent = content.trim();
  const safeRating = Number(workRating) >= 1 && Number(workRating) <= 5 ? Number(workRating) : 3;

  const newPost: FeedItem = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
    author_name: safeAuthor,
    job_type: safeJob,
    content: safeContent,
    work_rating: safeRating,
    likes: 0,
    replies: [],
    created_at: new Date().toISOString()
  };

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('square_posts')
        .insert([{
          author_name: safeAuthor,
          job_type: safeJob,
          content: safeContent,
          work_rating: safeRating,
          likes: 0
        }])
        .select();

      if (error) {
        console.error('Supabase square_posts insert error:', error);
        fallbackFeed.unshift(newPost);
        if (fallbackFeed.length > 100) fallbackFeed.pop();
        return res.json(newPost);
      }
      return res.json(data && data[0] ? data[0] : newPost);
    } else {
      fallbackFeed.unshift(newPost);
      if (fallbackFeed.length > 100) fallbackFeed.pop();
      return res.json(newPost);
    }
  } catch (err) {
    console.error('API POST /api/square/post error:', err);
    res.status(500).json({ error: 'Failed to publish post' });
  }
});

// 广场 API：其他用户发表匿名评价/跟帖回复
app.post('/api/square/reply', async (req: Request, res: Response) => {
  const { postId, nickname, content } = req.body;
  if (!postId || !content || !content.trim()) {
    return res.status(400).json({ error: 'Post ID and content are required' });
  }

  const safeNick = (nickname && nickname.trim()) ? nickname.trim().substring(0, 20) : '匿名社畜';
  const safeContent = content.trim().substring(0, 200);

  const newReply: ReplyItem = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
    comment_id: postId,
    nickname: safeNick,
    content: safeContent,
    created_at: new Date().toISOString()
  };

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('square_replies')
        .insert([{
          post_id: postId,
          nickname: safeNick,
          content: safeContent
        }])
        .select();

      if (error) {
        console.error('Supabase square_replies insert error:', error);
        fallbackReplies.push(newReply);
        return res.json(newReply);
      }
      return res.json(data && data[0] ? data[0] : newReply);
    } else {
      const target = fallbackFeed.find(item => item.id === postId);
      if (target) {
        if (!target.replies) target.replies = [];
        target.replies.push(newReply);
      }
      fallbackReplies.push(newReply);
      return res.json(newReply);
    }
  } catch (err) {
    console.error('API POST /api/square/reply error:', err);
    res.status(500).json({ error: 'Failed to save reply' });
  }
});


// 广场 API：给某条工作评价点赞
app.post('/api/square/like', async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    if (supabase) {
      const { data: item, error: findError } = await supabase
        .from('square_posts')
        .select('likes')
        .eq('id', id)
        .single();

      if (findError || !item) {
        // 尝试旧表 comments
        const { data: oldItem } = await supabase.from('comments').select('likes').eq('id', id).single();
        if (oldItem) {
          const next = (oldItem.likes || 0) + 1;
          await supabase.from('comments').update({ likes: next }).eq('id', id);
          return res.json({ success: true, likes: next });
        }
        return res.status(404).json({ error: 'Item not found' });
      }

      const nextLikes = (item.likes || 0) + 1;
      const { data, error } = await supabase
        .from('square_posts')
        .update({ likes: nextLikes })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase square_posts like error:', error);
        return res.status(500).json({ error: 'Failed to like' });
      }
      return res.json({ success: true, likes: nextLikes });
    } else {
      const target = fallbackFeed.find(item => item.id === id);
      if (target) {
        target.likes = (target.likes || 0) + 1;
        return res.json({ success: true, likes: target.likes });
      }
      return res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error('API POST /api/square/like error:', err);
    res.status(500).json({ error: 'Failed to like' });
  }
});

app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'すべての項目を入力してください。' });
  }

  // 実際の送信処理はここに実装（今回はログ出力のみ）
  console.log('お問い合わせ受信:', { name, email, message });

  res.json({ success: true, message: 'お問い合わせを受け付けました。' });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});

// Made with Bob
