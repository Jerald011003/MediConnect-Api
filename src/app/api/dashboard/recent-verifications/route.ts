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
    const { data: verifications, error } = await supabase
      .from('verifications')
      .select(`
        id,
        status,
        created_at,
        user_id
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching recent verifications:', error);
      throw error;
    }

    const verificationsWithUsers = await Promise.all(
      (verifications || []).map(async (verification) => {
        const { data: user } = await supabase
          .from('profiles')
          .select('full_name, email, profile_picture_url')
          .eq('id', verification.user_id)
          .single();

        return {
          id: verification.id,
          status: verification.status,
          created_at: verification.created_at,
          user: user || { full_name: 'Unknown', email: 'unknown@example.com' }
        };
      })
    );

    return NextResponse.json(verificationsWithUsers);
  } catch (error) {
    console.error('Error in recent verifications API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent verifications' },
      { status: 500 }
    );
  }
}