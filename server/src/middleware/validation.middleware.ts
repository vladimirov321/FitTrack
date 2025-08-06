import { Request, Response, NextFunction } from 'express';
const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    return next(error);
  }
  next();
};

export const validateAuthRequest = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

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
