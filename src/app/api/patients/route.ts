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
        date_of_birth,
        gender,
        address
      `)
      .eq('role', 'patient');

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { count: totalCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient');

    const { data: patients, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }

    return NextResponse.json({
      patients: patients || [],
      totalCount: totalCount || 0,
      currentPage: page,
      totalPages: Math.ceil((totalCount || 0) / limit)
    });
  } catch (error) {
    console.error('Error in patients API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
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
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id)
      .eq('role', 'patient');

    if (error) {
      console.error('Error deleting patient:', error);
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in delete patient API:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}