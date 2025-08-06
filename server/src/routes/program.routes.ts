import express from 'express';
import {
  createProgramWithDaysAndExercises,
  getUserPrograms
} from '../controllers/program.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  validateCreateProgram
} from '../middleware/programValidation.middleware';

const router = express.Router();

// All program routes require authentication
router.use(authenticateToken);

// GET /programs - Get all programs for the authenticated user
router.get('/', getUserPrograms);

// POST /programs - Create program with days & exercises
router.post('/', validateCreateProgram, createProgramWithDaysAndExercises);

export default router;
