import { AuthController } from '@/api/controllers/auth';

export async function POST(request: Request) {
  return AuthController.verifyToken(request as any);
}