
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkoyykxmtksnyizsectx.supabase.co';
const supabaseKey = 'sb_publishable_79lijucCjzJuklrZhkUukw_FJc05tYF';

export const supabase = createClient(supabaseUrl, supabaseKey);
