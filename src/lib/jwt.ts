import jwt from 'jsonwebtoken';

const API_KEY = process.env.STREAM_API_KEY;
const SECRET = process.env.STREAM_SECRET;

if (!API_KEY || !SECRET) {
  throw new Error('Missing required environment variables: STREAM_API_KEY or STREAM_SECRET');
}

export interface StreamTokenPayload {
  user_id: string;
  iss: string;
  iat: number;
  exp: number;
}

export function generateStreamToken(userId: string): string {
  if (!userId) {
    throw new Error('User ID is required for token generation');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: StreamTokenPayload = {
    user_id: userId,
    iss: API_KEY!,
    iat: now,
    exp: now + (60 * 60 * 24),
  };

  return jwt.sign(payload, SECRET!, { algorithm: 'HS256' });
}

export function verifyStreamToken(token: string): StreamTokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET!, { algorithms: ['HS256'] }) as StreamTokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}