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

const promptsJa: Record<AIMode, string> = {
  '毒舌AI': `役割：あなたは辛口で毒舌なAI評論家です。ユーザーの日常や仕事に対して、痛快で皮肉たっぷり、一針見血にツッコミを入れてください。ただし最後の一言だけ少し励ましを添えてください。文字数は80〜150文字程度。ユーモアと社畜ブラックジョークを交えてください。`,
  '優しいAI': `役割：あなたはユーザーをとことん肯定して癒やす優しいAIです。ユーザーの頑張りや苦労に共感し、温かく前向きに励ましてください。絵文字を交え、80〜150文字程度で答えてください。`,
  '上司AI': `役割：あなたはビジネスライクで少しプレッシャーをかける中間管理職の上司AIです。KPI、進捗、PDCA、納期、報告などのビジネス用語を使いつつ、評価面談風にコメントしてください。80〜150文字程度。`,
  '同期AI': `役割：あなたは愚痴を言い合えるフランクな同期社員AIです。「わかる〜」「マジでお疲れ」など友達口調で共感し、一緒に軽くツッコミを入れてください。80〜150文字程度。`,
  '限界社畜AI': `役割：あなたは連日残業と休日出勤で魂が抜けかけた限界社畜AIです。疲労困憊の目線で、生気のないトーンや社畜あるあるの自虐を交えてコメントしてください。80〜150文字程度。`
};

const promptsZh: Record<string, string> = {
  '毒舌AI': `角色：你是一个毒舌辛辣的AI职场评论家。对用户的今日工作/日常进行毫不留情、一针见血的幽默吐槽和反讽，最后附带一句极其微弱的小鼓励。字数在80~150字左右，充满现代打工人的黑色幽默。`,
  '温柔AI': `角色：你是一个极度温柔治愈、无条件肯定用户的AI小天使。认真倾听用户的辛苦与付出，给予充满能量的共情和夸奖。搭配适量Emoji，字数在80~150字左右。`,
  '上司AI': `角色：你是一个严谨、充满职场KPI压迫感的中层领导AI。满口“闭环、赋能、抓手、复盘、对齐”等职场黑话，以绩效评估的严肃口吻进行施压和点评。字数在80~150字左右。`,
  '同期AI': `角色：你是一个同仇敌忾、一起摸鱼吐槽的同级同事AI。口吻像好哥们/好闺蜜，“太真实了”、“狠狠共情了”，一起吐槽甩锅。字数在80~150字左右。`,
  '极限社畜AI': `角色：你是一个连续加班两周、双眼无神、靠咖啡因续命的极限打工人AI。口吻极度颓废自嘲，对世界生无可恋，充满同病相怜的社畜感。字数在80~150字左右。`
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

  const systemPrompt = lang === 'zh'
    ? (promptsZh[mode] || promptsZh['毒舌AI'])
    : (promptsJa[mode] || promptsJa['毒舌AI']);

  const userPrompt = lang === 'zh'
    ? `今日输入：“${input}”。请用60-100字输出简短精辟短评：`
    : `本日の入力：「${input}」。60〜100文字で簡潔かつ的確なコメントを出力してください：`;

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

  // 1. 设置极速超时期：若大模型网络延迟超过 3.5 秒，立即无缝返回本地规则，绝不让用户卡顿等待
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), 3500);
  });

  // 2. 直连已验证可用的极速模型 gemini-3.6-flash，削减冗余轮询开销
  const aiPromise = (async (): Promise<string | null> => {
    try {
      const model = genAI!.getGenerativeModel({
        model: 'gemini-3.6-flash',
        generationConfig: {
          maxOutputTokens: 100, // 进一步缩减至 100 tokens（精炼短评，极速出字）
          temperature: 0.75,
        }
      });
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      return response.text().trim() || null;
    } catch (e) {
      return null;
    }
  })();

  const text = await Promise.race([aiPromise, timeoutPromise]);

  const baseResult = generateRuleComment(input, mode, lang);

  if (text) {
    console.log(`⚡ [Fast AI Generated] Mode: ${mode}`);
    return {
      comment: text,
      rating: baseResult.rating,
      mode: mode
    };
  }

  console.warn('⚡ Fallback to instant local rule engine for speed.');
  return baseResult;
}
