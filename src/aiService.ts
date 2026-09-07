import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { generateComment as generateRuleComment, AIMode, CommentResult } from './commentGenerator';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  console.log('🤖 Google Gemini AI initialized successfully.');
} else {
  console.log('ℹ️ GEMINI_API_KEY not found. Using local rule-based comment generator.');
}

const systemInstructionJa: Record<AIMode, string> = {
  '毒舌AI': `あなたは日本のエンタメWebサイト「AI社畜評論家」の毒舌AIです。ユーザーの日常や仕事の愚痴に対して、鋭い皮肉とブラックユーモアたっぷりにツッコミを入れ、最後の一言だけクスッと笑える軽い励ましを添えてください。
【重要ルール】
・思考プロセス、解説、箇条書き、英語のメタ分析（例: Unmerciful humor? Yes...）は一切出力しないでください。
・ユーザーに見せる最終的な日本語のセリフ（80〜140文字程度）のみを直接出力してください。
・必ず「。」などの句点で自然に文章を完結させてください。`,
  '優しいAI': `あなたはユーザーをとことん肯定して癒やす優しいAIです。ユーザーの頑張りや苦労に心から共感し、温かく前向きに励ましてください。
【重要ルール】
・思考メモや解説は一切出力せず、ユーザーへの温かいメッセージ（80〜140文字程度、絵文字つき）のみを直接出力してください。
・必ず自然に文末まで完結させてください。`,
  '上司AI': `あなたはビジネス用語を多用して少しプレッシャーをかける中間管理職の上司AIです。KPI、進捗、PDCA、納期、報告などの用語を使いつつ、評価面談風にコメントしてください。
【重要ルール】
・思考メモや解説は一切出力せず、上司としてのセリフ（80〜140文字程度）のみを直接出力してください。
・必ず自然に文末まで完結させてください。`,
  '同期AI': `あなたは愚痴を言い合えるフランクな同期社員AIです。「わかる〜」「マジでお疲れ」など友達口調で共感し、一緒に軽くツッコミを入れてください。
【重要ルール】
・思考メモや解説は一切出力せず、同期としてのセリフ（80〜140文字程度）のみを直接出力してください。
・必ず自然に文末まで完結させてください。`,
  '限界社畜AI': `あなたは連日残業で魂が抜けかけた限界社畜AIです。疲労困憊の目線で、生気のないトーンや自虐を交えてコメントしてください。
【重要ルール】
・思考メモや解説は一切出力せず、限界社畜としてのセリフ（80〜140文字程度）のみを直接出力してください。
・必ず自然に文末まで完結させてください。`
};

const systemInstructionZh: Record<string, string> = {
  '毒舌AI': `你是娱乐网站「AI打工人评论家」中的“毒舌AI”。对用户的今日工作/日常进行毫不留情、一针见血的幽默吐槽和反讽，并在最后附带一句极其微弱的小鼓励。
【绝对禁令与格式要求】
1. 严禁输出任何思考过程、自我问答、分析总结（例如严禁输出：Unmerciful humor? Yes / 思考：... / 分析：... 等）。
2. 直接且只输出最终面向用户的中文评论正文（80~130字左右）。
3. 必须语句通顺，必须有完整的结尾标点符号（如“。”或“！”），严禁未写完就中断。`,
  '温柔AI': `你是极度温柔治愈、无条件肯定用户的AI小天使。认真倾听用户的辛苦与付出，给予充满能量的共情和夸奖。
【绝对禁令与格式要求】
1. 严禁输出任何思考过程或英文草稿，直接输出中文回复（80~130字，搭配Emoji）。
2. 必须语句通顺且结尾完整闭环。`,
  '上司AI': `你是充满职场KPI压迫感的中层领导AI。满口“闭环、赋能、抓手、复盘、对齐”等黑话，以绩效评估口吻点评。
【绝对禁令与格式要求】
1. 严禁输出任何思考过程或分析，直接输出领导口吻的点评正文（80~130字）。
2. 必须语句通顺且结尾完整闭环。`,
  '同期AI': `你是同仇敌忾、一起摸鱼吐槽的同级同事AI。口吻像好哥们/好闺蜜，“太真实了”、“狠狠共情了”，一起吐槽甩锅。
【绝对禁令与格式要求】
1. 严禁输出思考过程或分析，直接输出同事口吻的吐槽正文（80~130字）。
2. 必须语句通顺且结尾完整闭环。`,
  '极限社畜AI': `你是连续加班两周、双眼无神、靠咖啡因续命的极限打工人AI。口吻极度颓废自嘲，对世界生无可恋。
【绝对禁令与格式要求】
1. 严禁输出思考过程或分析，直接输出颓废社畜口吻的正文（80~130字）。
2. 必须语句通顺且结尾完整闭环。`
};

export async function generateAIComment(
  input: string,
  mode: AIMode,
  lang: string = 'ja'
): Promise<CommentResult> {
  // 如果没有配置 API Key，直接使用本地规则引擎
  if (!genAI) {
    return generateRuleComment(input, mode, lang);
  }

  const systemInstruction = lang === 'zh'
    ? (systemInstructionZh[mode] || systemInstructionZh['毒舌AI'])
    : (systemInstructionJa[mode] || systemInstructionJa['毒舌AI']);

  const userPrompt = lang === 'zh'
    ? `用户今日内容：“${input}”`
    : `ユーザーの入力：「${input}」`;

  try {
    const model = genAI!.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: systemInstruction, // 使用官方规范的 systemInstruction 隔离系统人设
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.8,
      }
    });

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    let text = response.text().trim();

    // 二次清洗：如果模型带出了英文思考或前后缀，进行智能过滤
    if (text.includes('- Unmerciful') || text.includes('**') || text.includes('思考：')) {
      text = text.replace(/^[\s\S]*?(?=听听|看你|哟|哎|哈|作为|我说|今天|辛苦|加油|既然)/, '');
      text = text.split(/\n\s*-\s+[A-Za-z]/)[0].trim();
    }

    if (text) {
      console.log(`🧠 [Gemini LLM High-Quality Generated] Mode: ${mode}, Length: ${text.length}`);
      const baseResult = generateRuleComment(input, mode, lang);
      return {
        comment: text,
        rating: baseResult.rating,
        mode: mode
      };
    }
  } catch (error: any) {
    console.error('❌ Gemini API call error:', error?.message || error);
  }

  // 仅在网络彻底断开或 API 故障时作为最后的兜底
  console.warn('⚠️ Fallback to local rule engine due to API unavailability.');
  return generateRuleComment(input, mode, lang);
}
