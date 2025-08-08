import { Router } from 'express';
import { 
  startProgramLog, 
  logWorkoutDay, 
  getUserLogs, 
  getLogById, 
  endProgramLog, 
  getProgramLogs 
} from '../controllers/log.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { 
  validateStartProgramLog, 
  validateLogWorkoutDay, 
  validateLogId, 
  validateProgramId 
} from '../middleware/logValidation.middleware';

const router = Router();

// All log routes require authentication
router.use(authenticateToken);

// POST /logs - Start a new program log
router.post('/', validateStartProgramLog, startProgramLog);

// PATCH /logs/:logId/day/:dayId - Log a completed workout day
router.patch('/:logId/day/:dayId', validateLogWorkoutDay, logWorkoutDay);

// GET /logs - Get all user's program logs
router.get('/', getUserLogs);

// GET /logs/:logId - Get a specific log by ID
router.get('/:logId', validateLogId, getLogById);

// PATCH /logs/:logId/end - End a program log
router.patch('/:logId/end', validateLogId, endProgramLog);

// GET /logs/program/:programId - Get logs for a specific program
router.get('/program/:programId', validateProgramId, getProgramLogs);

export default router;
