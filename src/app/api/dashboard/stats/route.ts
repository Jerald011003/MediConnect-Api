import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const { count: totalPatients, error: patientsError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'patient');

    if (patientsError) {
      console.error('Error fetching patients:', patientsError);
      throw patientsError;
    }
    const { count: totalDoctors, error: doctorsError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'doctor');

    if (doctorsError) {
      console.error('Error fetching doctors:', doctorsError);
      throw doctorsError;
    }
    const { count: pendingVerifications, error: verificationsError } = await supabase
      .from('verifications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (verificationsError) {
      console.error('Error fetching verifications:', verificationsError);
      throw verificationsError;
    }
    const { count: totalAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    if (appointmentsError) {
      console.error('Error fetching appointments:', appointmentsError);
      throw appointmentsError;
    }

    const stats = {
      totalPatients: totalPatients || 0,
      totalDoctors: totalDoctors || 0,
      pendingVerifications: pendingVerifications || 0,
      totalAppointments: totalAppointments || 0
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}