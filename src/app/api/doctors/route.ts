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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        contact_number,
        role,
        created_at,
        availability_days,
        availability_times
      `)
      .eq('role', 'doctor');

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,contact_number.ilike.%${search}%`);
    }

    const { count: totalCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'doctor');

    const { data: doctors, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }

    return NextResponse.json({
      doctors: doctors || [],
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages: Math.ceil((totalCount || 0) / limit)
    });
  } catch (error) {
    console.error('Error in doctors API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .eq('role', 'doctor');

    if (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete doctor API:', error);
    return NextResponse.json(
      { error: 'Failed to delete doctor' },
      { status: 500 }
    );
  }
}