import { Request, Response, NextFunction } from 'express';

export const validateAuthRequest = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    const error = new Error('Email and password required');
    return next(error);
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error('Invalid email format');
    return next(error);
  }
  
  // Password length validation
  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    return next(error);
  }
  
  next();
};

export const validateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.refreshToken;
  
  if (!token) {
    const error = new Error('No refresh token');
    return next(error);
  }
  
  // Add token to request object for use in controller
  req.refreshToken = token;
  next();
};
