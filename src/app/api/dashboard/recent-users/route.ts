import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET() {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role, created_at, profile_picture_url')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recent users:', error);
      throw error;
    }

    return NextResponse.json(users || []);
  } catch (error) {
    console.error('Error in recent users API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent users' },
      { status: 500 }
    );
  }
}