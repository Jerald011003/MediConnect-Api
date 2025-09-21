import { NextRequest } from 'next/server';
import { generateTokenAction, verifyTokenAction } from '../../actions/auth';

export const AuthController = {
  generateToken: generateTokenAction,
  verifyToken: verifyTokenAction
};