import { NextRequest } from 'next/server';
import { AuthController } from '@/api/controllers/auth';

export async function POST(request: Request) {
  return AuthController.verifyToken(request as NextRequest);
}