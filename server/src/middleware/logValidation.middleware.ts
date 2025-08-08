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

// Validation for starting a program log
export const validateStartProgramLog = [
  body('programId')
    .isUUID()
    .withMessage('Program ID must be a valid UUID'),
  handleValidationErrors
];

// Validation for logging a workout day
export const validateLogWorkoutDay = [
  param('logId')
    .isUUID()
    .withMessage('Log ID must be a valid UUID'),
  
  param('dayId')
    .isUUID()
    .withMessage('Day ID must be a valid UUID'),
  
  body('date')
    .isISO8601({ strict: true })
    .withMessage('Date must be a valid ISO 8601 date (YYYY-MM-DD)'),
  
  body('exercises')
    .isArray({ min: 1 })
    .withMessage('Exercises must be a non-empty array'),
  
  body('exercises.*.exerciseId')
    .isUUID()
    .withMessage('Exercise ID must be a valid UUID'),
  
  body('exercises.*.sets')
    .isArray({ min: 1 })
    .withMessage('Sets must be a non-empty array'),
  
  body('exercises.*.sets.*.weight')
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  
  body('exercises.*.sets.*.reps')
    .isInt({ min: 1 })
    .withMessage('Reps must be a positive integer'),
  
  body('exercises.*.sets.*.order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  
  // Custom validation to check for duplicate order values within each exercise
  body('exercises').custom((exercises: any[]) => {
    for (const exercise of exercises) {
      if (exercise.sets && Array.isArray(exercise.sets)) {
        const orders = exercise.sets.map((set: any) => set.order);
        const uniqueOrders = new Set(orders);
        if (orders.length !== uniqueOrders.size) {
          throw new Error(`Duplicate order values found in exercise "${exercise.name}"`);
        }
      }
    }
    return true;
  }),
  
  handleValidationErrors
];

// Validation for log ID parameter
export const validateLogId = [
  param('logId')
    .isUUID()
    .withMessage('Log ID must be a valid UUID'),
  
  handleValidationErrors
];

// Validation for program ID parameter
export const validateProgramId = [
  param('programId')
    .isUUID()
    .withMessage('Program ID must be a valid UUID'),
  
  handleValidationErrors
];
