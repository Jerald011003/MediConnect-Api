import { NextRequest, NextResponse } from 'next/server';
import { generateStreamToken } from '@/lib/jwt';

export const generateTokenAction = async (req: NextRequest) => {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      );
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    const token = generateStreamToken(userId);

    return NextResponse.json({
      success: true,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });

  } catch (error) {
    console.error('generateTokenAction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate token' 
      },
      { status: 500 }
    );
  }
};