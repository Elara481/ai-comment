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
  '毒舌AI': `あなたは毒舌AIです。ユーザーの日常や仕事に対して鋭い皮肉とブラックユーモアたっぷりにツッコミを入れ、最後の一言だけ軽く励ましてください。直接セリフのみを出力してください。`,
  '優しいAI': `あなたは優しいAIです。ユーザーの頑張りや苦労に共感し、温かく前向きに励ましてください。絵文字を交え、直接セリフのみを出力してください。`,
  '上司AI': `あなたは中間管理職の上司AIです。ビジネス用語を使い、評価面談風に少しプレッシャーをかけてコメントしてください。直接セリフのみを出力してください。`,
  '同期AI': `あなたはフランクな同期社員AIです。友達口調で共感し、一緒に軽くツッコミを入れてください。直接セリフのみを出力してください。`,
  '限界社畜AI': `あなたは連日残業の限界社畜AIです。疲労困憊の目線で自虐を交えてコメントしてください。直接セリフのみを出力してください。`
};

const systemInstructionZh: Record<string, string> = {
  '毒舌AI': `你是一个毒舌AI。根据用户的日常进行毫不留情、一针见血的幽默吐槽和反讽，并在最后附带一句极其微弱的小鼓励。直接输出中文评论台词。`,
  '温柔AI': `你是一个温柔治愈的AI。认真倾听用户的辛苦与付出，给予温暖的共情和夸奖，搭配适量Emoji。直接输出中文台词。`,
  '上司AI': `你是一个充满KPI压迫感的中层领导AI。满口职场黑话，以严肃的绩效评估口吻进行施压点评。直接输出中文台词。`,
  '同期AI': `你是一个一起摸鱼吐槽的同事AI。像好朋友一样狠狠共情、一起吐槽甩锅。直接输出中文台词。`,
  '极限社畜AI': `你是一个连续加班两周、生无可恋的极限打工人AI。口吻极度颓废自嘲，同病相怜。直接输出中文台词。`
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

    // 清理可能包含的 markdown 标签或英文头尾
    text = text.replace(/^```[\s\S]*?\n/, '').replace(/\n```$/, '').trim();

    // 如果包含中文字符，剥离掉任何前置的英文分析残留
    if (lang === 'zh' || /[\u4e00-\u9fa5]/.test(text)) {
      const match = text.match(/[\u4e00-\u9fa5][\s\S]*/);
      if (match) {
        text = match[0];
      }
    }

    // 剔除末尾可能附带的英文检查项列表（如 * *No internal thought...*）
    // 只匹配纯英文行开头的列表项，避免误截中文正文
    text = text.split(/\n\s*[\*\-]\s+\*[A-Za-z]/)[0].trim();
    text = text.split(/\n\s*[\*\-]\s+[A-Z][a-z]+(?: [A-Za-z]+)*\s*$/m)[0].trim();

    if (text) {
      console.log(`🧠 [Gemini LLM Clean Output] Mode: ${mode}, Length: ${text.length}`);
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
