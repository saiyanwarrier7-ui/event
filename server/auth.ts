import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db, Profile } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexustech-secure-jwt-secret-key-2026';

export interface AuthUser {
  id: string;
  email: string;
  role: 'student' | 'admin';
  full_name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export function generateToken(user: Pick<Profile, 'id' | 'email' | 'role' | 'full_name'>): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (err) {
    return null;
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }

  const profile = db.findProfileById(payload.id);
  if (!profile) {
    return res.status(401).json({ error: 'User account no longer exists.' });
  }

  req.user = {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    full_name: profile.full_name,
  };

  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Administrator privileges required.' });
    }
    next();
  });
}
