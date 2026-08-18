const fs = require('fs');

const code = `import { Request, Response, NextFunction } from 'express';
import { adminAuth, adminDb } from '../firebase-admin';
import { Permission, hasPermission } from '../../lib/permissions';

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
    
    // Fetch user role from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (userDoc.exists) {
      req.userRole = userDoc.data()?.role || 'customer';
    } else {
      req.userRole = 'customer';
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized: Invalid token' });
    return;
  }
};

export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.userRole) {
      res.status(401).json({ error: 'Unauthorized' });
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
    
    if (!hasPermission(req.userRole as any, permission)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    
    next();
  };
};
`;

fs.writeFileSync('src/server/middleware/auth.ts', code);
