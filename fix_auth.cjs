const fs = require('fs');

let code = `import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { adminAuth, adminDb } from '../firebase-admin';
import { Permission, hasPermission, Role } from '../../lib/permissions';

export interface AuthRequest extends Request {
  user?: any;
  userRole?: string;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: No token provided' });
    return;
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    
    // 1. Authoritative Role from Firebase Custom Claims
    if (decodedToken.role) {
      req.userRole = decodedToken.role;
    } else {
      // 2. Fallback to Firestore (which shouldn't be the sole security authority, but good for backward compatibility if claims haven't propagated)
      let userDoc;
      try {
        userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
      } catch (dbErr: any) {
        console.error("DB Error in auth middleware", dbErr);
        req.userRole = 'customer';
      }
      if (userDoc?.exists) {
        req.userRole = userDoc.data()?.role || 'customer';
      } else {
        req.userRole = 'customer';
      }
    }
    
    next();
  } catch (error: any) {
    console.error('Verify ID token error:', error); 
    res.status(401).json({ error: 'Unauthorized: Invalid token - ' + (error.message || error.toString()) });
    return;
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.userRole) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    // Super admin is allowed everything
    if (req.userRole === 'super_admin') {
      next();
      return;
    }
    
    if (!allowedRoles.includes(req.userRole)) {
      res.status(403).json({ error: 'Forbidden: Insufficient role' });
      return;
    }
    
    next();
  };
};

export const requirePermission = (permission: Permission) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.userRole) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    if (!hasPermission(req.userRole as Role, permission)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    
    next();
  };
};
`;

fs.writeFileSync('src/server/middleware/auth.ts', code);
