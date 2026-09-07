import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase connected successfully.');
} else {
  console.log('⚠️ SUPABASE_URL or SUPABASE_KEY not found. Running in fallback mode.');
}

export { supabase };

// 匿名回复评论接口
export interface ReplyItem {
  id: string;
  comment_id: string;
  nickname?: string;
  content: string;
  created_at: string;
}

// 广场帖子：社畜工作评价/吐槽
export interface FeedItem {
  id: string;
  author_name?: string; // 发布者昵称（可选，默认匿名社畜）
  job_type?: string;     // 岗位/职业（如：程序员、运营、销售、设计、人事...）
  content: string;       // 对工作的评价/真实想法/吐槽
  work_rating?: number;  // 对自己这份工作/今日工作的打分（1~5星）
  input?: string;        // 兼容旧字段
  mode?: string;
  comment?: string;
  rating?: number;
  likes?: number;
  replies?: ReplyItem[];
  created_at: string;
}

export const fallbackFeed: FeedItem[] = [];
export const fallbackReplies: ReplyItem[] = [];
