import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Authentication errors
  if (err.message === 'Invalid credentials') {
    return res.status(401).json({ message: err.message });
  }

  if (err.message === 'Invalid or expired refresh token') {
    return res.status(401).json({ message: err.message });
  }

  if (err.message === 'User not found') {
    return res.status(404).json({ message: err.message });
  }

  // Validation errors
  if (err.message === 'Email already in use') {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === 'Email and password required') {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === 'No refresh token') {
    return res.status(401).json({ message: err.message });
  }

  if (err.message === 'Invalid email format') {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === 'Password must be at least 6 characters') {
    return res.status(400).json({ message: err.message });
  }

  if (err.message === 'Access token required') {
    return res.status(401).json({ message: err.message });
  }

  // Exercise-specific errors
  if (err.message === 'Exercise name already exists') {
    return res.status(409).json({ message: err.message });
  }

  if (err.message === 'Exercise not found') {
    return res.status(404).json({ message: err.message });
  }

  if (err.message === 'Cannot delete exercise that is used in programs') {
    return res.status(409).json({ message: err.message });
  }

  // Exercise validation errors
  if (err.message.includes('Exercise name') || 
      err.message.includes('Sets must be') || 
      err.message.includes('Set ') || 
      err.message.includes('Exercise ID') ||
      err.message.includes('Invalid exercise ID format') ||
      err.message.includes('weight must be') ||
      err.message.includes('reps must be') ||
      err.message.includes('order must be') ||
      err.message.includes('Set orders must be unique') ||
      err.message.includes('Maximum 20 sets allowed')) {
    return res.status(400).json({ message: err.message });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(403).json({ message: 'Token expired' });
  }

  // Default error
  res.status(500).json({ 
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
