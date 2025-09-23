import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface UpdateVerificationData {
  status: 'pending' | 'verified' | 'rejected';
  updated_at: string;
  reviewer_notes?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';

    const offset = (page - 1) * limit;

    let query = supabase
      .from('verifications')
      .select(`
        id,
        user_id,
        status,
        primary_id_type,
        primary_id_front,
        primary_id_back,
        secondary_id_type,
        secondary_id_image,
        selfie_image,
        reviewer_notes,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    let countQuery = supabase
      .from('verifications')
      .select('*', { count: 'exact', head: true });

    if (status) {
      countQuery = countQuery.eq('status', status);
    }

    const { count: totalCount } = await countQuery;

    const { data: verifications, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching verifications:', error);
      throw error;
    }

    const verificationsWithUsers = await Promise.all(
      (verifications || []).map(async (verification) => {
        const { data: user } = await supabase
          .from('profiles')
          .select('id, full_name, email, role, profile_picture_url')
          .eq('id', verification.user_id)
          .single();

        return {
          ...verification,
          user
        };
      })
    );

    return NextResponse.json({
      verifications: verificationsWithUsers,
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages: Math.ceil((totalCount || 0) / limit)
    });
  } catch (error) {
    console.error('Error in verifications API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, reviewer_notes } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Verification ID and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be pending, verified, or rejected' },
        { status: 400 }
      );
    }

    const updateData: UpdateVerificationData = {
      status,
      updated_at: new Date().toISOString()
    };

    if (reviewer_notes !== undefined) {
      updateData.reviewer_notes = reviewer_notes;
    }

    const { data, error } = await supabase
      .from('verifications')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating verification:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      verification: data?.[0]
    });
  } catch (error) {
    console.error('Error in update verification API:', error);
    return NextResponse.json(
      { error: 'Failed to update verification' },
      { status: 500 }
    );
  }
}