import { Request, Response, NextFunction } from 'express';
const { body, validationResult } = require('express-validator');

export const validateCreateProgram = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Program name must be between 1 and 100 characters'),
  
  body('details')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Program details must not exceed 500 characters'),
  
  body('days')
    .isArray({ min: 1 })
    .withMessage('Program must have at least one day'),
  
  body('days.*.name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Day name must be between 1 and 50 characters'),
  
  body('days.*.exercises')
    .isArray({ min: 1 })
    .withMessage('Each day must have at least one exercise'),
  
  body('days.*.exercises.*')
    .isUUID()
    .withMessage('Exercise ID must be a valid UUID'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((err: any) => ({ msg: err.msg, param: err.param }))
      });
    }
    next();
  }
];
