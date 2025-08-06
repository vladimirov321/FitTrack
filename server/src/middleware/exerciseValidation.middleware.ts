import { Request, Response, NextFunction } from 'express';
const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error(errors.array()[0].msg);
    return next(error);
  }
  next();
};

export const validateCreateExercise = [
  body('name')
    .isString()
    .withMessage('Exercise name is required and must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Exercise name must be between 1 and 100 characters'),
  handleValidationErrors
];

export const validateUpdateExerciseName = [
  body('name')
    .isString()
    .withMessage('Exercise name is required and must be a string')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Exercise name must be between 1 and 100 characters'),
  handleValidationErrors
];

export const validateReplaceExerciseSets = [
  body('sets')
    .isArray({ max: 20 })
    .withMessage('Sets must be an array with maximum 20 items'),
  body('sets.*.weight')
    .isFloat({ min: 0, max: 1000 })
    .withMessage('Weight must be a number between 0 and 1000'),
  body('sets.*.reps')
    .isInt({ min: 1, max: 100 })
    .withMessage('Reps must be an integer between 1 and 100'),
  body('sets.*.order')
    .isInt({ min: 1, max: 20 })
    .withMessage('Order must be an integer between 1 and 20'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(errors.array()[0].msg);
      return next(error);
    }
    
    // Check for duplicate orders
    const { sets } = req.body;
    const orders = sets.map((set: any) => set.order);
    const uniqueOrders = new Set(orders);
    if (orders.length !== uniqueOrders.size) {
      const error = new Error('Set orders must be unique');
      return next(error);
    }
    
    next();
  }
];

export const validateExerciseId = [
  param('id')
    .isUUID()
    .withMessage('Invalid exercise ID format'),
  handleValidationErrors
];
