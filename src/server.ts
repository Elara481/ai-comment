import express, { Request, Response } from 'express';
import path from 'path';
import { generateComment } from './commentGenerator';

const app = express();
const PORT = 8091;

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
