import express from 'express';
import {
  createExercise,
  getUserExercises,
  getExerciseById,
  updateExerciseName,
  replaceExerciseSets,
  deleteExercise
} from '../controllers/exercise.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  validateCreateExercise,
  validateUpdateExerciseName,
  validateReplaceExerciseSets,
  validateExerciseId
} from '../middleware/exerciseValidation.middleware';

const router = express.Router();

// All exercise routes require authentication
router.use(authenticateToken);

// GET /exercises - Get all exercises for the authenticated user
router.get('/', getUserExercises);

// POST /exercises - Create a new exercise
router.post('/', validateCreateExercise, createExercise);

// GET /exercises/:id - Get a specific exercise by ID
router.get('/:id', validateExerciseId, getExerciseById);

// PUT /exercises/:id/name - Update exercise name
router.put('/:id/name', validateExerciseId, validateUpdateExerciseName, updateExerciseName);

// PUT /exercises/:id/sets - Replace exercise sets
router.put('/:id/sets', validateExerciseId, validateReplaceExerciseSets, replaceExerciseSets);

// DELETE /exercises/:id - Delete an exercise
router.delete('/:id', validateExerciseId, deleteExercise);

export default router;
