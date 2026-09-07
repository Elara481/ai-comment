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

// 内存后备存储（若用户未配置 Supabase 环境变量，依然可正常体验广场）
export interface FeedItem {
  id: string;
  input: string;
  mode: string;
  comment: string;
  rating: number;
  user_rating?: number;
  user_custom_answer?: string;
  likes?: number;
  replies?: ReplyItem[];
  created_at: string;
}

export const fallbackFeed: FeedItem[] = [];
export const fallbackReplies: ReplyItem[] = [];
