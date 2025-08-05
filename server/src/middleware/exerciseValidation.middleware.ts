import { Request, Response, NextFunction } from 'express';

export const validateCreateExercise = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    const error = new Error('Exercise name is required and must be a string');
    return next(error);
  }

  if (name.trim().length === 0) {
    const error = new Error('Exercise name cannot be empty');
    return next(error);
  }

  if (name.length > 100) {
    const error = new Error('Exercise name must be 100 characters or less');
    return next(error);
  }

  // Trim the name
  req.body.name = name.trim();
  next();
};

export const validateUpdateExerciseName = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    const error = new Error('Exercise name is required and must be a string');
    return next(error);
  }

  if (name.trim().length === 0) {
    const error = new Error('Exercise name cannot be empty');
    return next(error);
  }

  if (name.length > 100) {
    const error = new Error('Exercise name must be 100 characters or less');
    return next(error);
  }

  // Trim the name
  req.body.name = name.trim();
  next();
};

export const validateReplaceExerciseSets = (req: Request, res: Response, next: NextFunction) => {
  const { sets } = req.body;

  if (!Array.isArray(sets)) {
    const error = new Error('Sets must be an array');
    return next(error);
  }

  if (sets.length > 20) {
    const error = new Error('Maximum 20 sets allowed per exercise');
    return next(error);
  }

  // Validate each set
  for (let i = 0; i < sets.length; i++) {
    const set = sets[i];

    if (!set || typeof set !== 'object') {
      const error = new Error(`Set ${i + 1} must be an object`);
      return next(error);
    }

    const { weight, reps, order } = set;

    if (typeof weight !== 'number' || weight < 0 || weight > 1000) {
      const error = new Error(`Set ${i + 1}: weight must be a number between 0 and 1000`);
      return next(error);
    }

    if (typeof reps !== 'number' || reps < 1 || reps > 100) {
      const error = new Error(`Set ${i + 1}: reps must be a number between 1 and 100`);
      return next(error);
    }

    if (typeof order !== 'number' || order < 1 || order > 20) {
      const error = new Error(`Set ${i + 1}: order must be a number between 1 and 20`);
      return next(error);
    }
  }

  // Check for duplicate orders
  const orders = sets.map((set: any) => set.order);
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    const error = new Error('Set orders must be unique');
    return next(error);
  }

  next();
};

export const validateExerciseId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    const error = new Error('Exercise ID is required');
    return next(error);
  }

  // Trim whitespace
  const trimmedId = id.trim();
  
  // Check basic length first
  if (trimmedId.length !== 36) {
    const error = new Error('Invalid exercise ID format');
    return next(error);
  }

  // UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmedId)) {
    const error = new Error('Invalid exercise ID format');
    return next(error);
  }

  next();
};
