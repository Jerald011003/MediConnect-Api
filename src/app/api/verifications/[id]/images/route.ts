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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: verification, error } = await supabase
      .from('verifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !verification) {
      return NextResponse.json(
        { error: 'Verification not found' },
        { status: 404 }
      );
    }

    const images = [];

    if (verification.primary_id_front) {
      const { data: url } = await supabase.storage
        .from('verification_documents')
        .createSignedUrl(verification.primary_id_front, 3600);
      
      if (url) {
        images.push({
          type: 'primary_front',
          label: 'Primary ID Front',
          url: url.signedUrl
        });
      }
    }

    if (verification.primary_id_back) {
      const { data: url } = await supabase.storage
        .from('verification_documents')
        .createSignedUrl(verification.primary_id_back, 3600);
      
      if (url) {
        images.push({
          type: 'primary_back',
          label: 'Primary ID Back',
          url: url.signedUrl
        });
      }
    }

    if (verification.secondary_id_image) {
      const { data: url } = await supabase.storage
        .from('verification_documents')
        .createSignedUrl(verification.secondary_id_image, 3600);
      
      if (url) {
        images.push({
          type: 'secondary',
          label: `Secondary ID (${verification.secondary_id_type})`,
          url: url.signedUrl
        });
      }
    }

    if (verification.selfie_image) {
      const { data: url } = await supabase.storage
        .from('verification_documents')
        .createSignedUrl(verification.selfie_image, 3600);
      
      if (url) {
        images.push({
          type: 'selfie',
          label: 'Selfie',
          url: url.signedUrl
        });
      }
    }

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching verification images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}