import { NextRequest, NextResponse } from 'next/server';
import { verifyStreamToken } from '@/lib/jwt';

export const verifyTokenAction = async (req: NextRequest) => {
  try {
    if (req.method !== 'POST') {
      return NextResponse.json(
        { success: false, error: 'Method not allowed' },
        { status: 405 }
      );
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    const payload = verifyStreamToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      payload: {
        userId: payload.user_id,
        issuedAt: new Date(payload.iat * 1000).toISOString(),
        expiresAt: new Date(payload.exp * 1000).toISOString()
      }
    });

  } catch (error) {
    console.error('verifyTokenAction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to verify token' 
      },
      { status: 500 }
    );
  }
};