import express, { Request, Response } from 'express';
import path from 'path';
import { generateComment } from './commentGenerator';
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
app.post('/api/generate', (req: Request, res: Response) => {
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
    const result = generateComment(input, mode, lang || 'ja');
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'コメント生成中にエラーが発生しました。' });
  }
});

// 广场 API：获取最近的吐槽评论（附带匿名盖楼回复）
app.get('/api/square', async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          *,
          replies (
            id,
            nickname,
            content,
            created_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase fetch error (trying without relation):', error);
        // 如果未建 replies 表关联，降级单独查 comments
        const { data: simpleComments } = await supabase
          .from('comments')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        return res.json(simpleComments || fallbackFeed);
      }
      return res.json(comments || []);
    } else {
      return res.json(fallbackFeed);
    }
  } catch (err) {
    console.error('API /api/square error:', err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// 广场 API：发表匿名评论/盖楼回复
app.post('/api/square/reply', async (req: Request, res: Response) => {
  const { commentId, nickname, content } = req.body;
  if (!commentId || !content || !content.trim()) {
    return res.status(400).json({ error: 'Comment ID and content are required' });
  }

  const safeNick = (nickname && nickname.trim()) ? nickname.trim().substring(0, 20) : '匿名社畜';
  const safeContent = content.trim().substring(0, 200);

  const newReply: ReplyItem = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
    comment_id: commentId,
    nickname: safeNick,
    content: safeContent,
    created_at: new Date().toISOString()
  };

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('replies')
        .insert([{
          comment_id: commentId,
          nickname: safeNick,
          content: safeContent
        }])
        .select();

      if (error) {
        console.error('Supabase reply insert error:', error);
        // 降级回退
        fallbackReplies.push(newReply);
        return res.json(newReply);
      }
      return res.json(data && data[0] ? data[0] : newReply);
    } else {
      const target = fallbackFeed.find(item => item.id === commentId);
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

// 广场 API：发布或同步一条新生成的评论到广场
app.post('/api/square', async (req: Request, res: Response) => {
  const { input, mode, comment, rating } = req.body;
  if (!input || !comment || !mode) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newItem: FeedItem = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
    input,
    mode,
    comment,
    rating: rating || 3,
    user_rating: 0,
    user_custom_answer: '',
    likes: 0,
    created_at: new Date().toISOString()
  };

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          input: newItem.input,
          mode: newItem.mode,
          comment: newItem.comment,
          rating: newItem.rating,
          user_rating: newItem.user_rating,
          user_custom_answer: newItem.user_custom_answer,
          likes: 0
        }])
        .select();

      if (error) {
        console.error('Supabase insert error:', error);
        fallbackFeed.unshift(newItem);
        if (fallbackFeed.length > 100) fallbackFeed.pop();
        return res.json(newItem);
      }
      return res.json(data && data[0] ? data[0] : newItem);
    } else {
      fallbackFeed.unshift(newItem);
      if (fallbackFeed.length > 100) fallbackFeed.pop();
      return res.json(newItem);
    }
  } catch (err) {
    console.error('API POST /api/square error:', err);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// 广场 API：更新某条记录的用户打分或反驳
app.post('/api/square/feedback', async (req: Request, res: Response) => {
  const { id, userRating, userCustomAnswer } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('comments')
        .update({
          user_rating: userRating,
          user_custom_answer: userCustomAnswer
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase update feedback error:', error);
      }
      return res.json({ success: true, data: data ? data[0] : null });
    } else {
      const target = fallbackFeed.find(item => item.id === id);
      if (target) {
        target.user_rating = userRating;
        target.user_custom_answer = userCustomAnswer;
      }
      return res.json({ success: true });
    }
  } catch (err) {
    console.error('API POST /api/square/feedback error:', err);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// 广场 API：给某条吐槽点赞
app.post('/api/square/like', async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    if (supabase) {
      // 通过 rpc 或 先查后更新
      const { data: item, error: findError } = await supabase
        .from('comments')
        .select('likes')
        .eq('id', id)
        .single();

      if (findError || !item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      const nextLikes = (item.likes || 0) + 1;
      const { data, error } = await supabase
        .from('comments')
        .update({ likes: nextLikes })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase like error:', error);
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
