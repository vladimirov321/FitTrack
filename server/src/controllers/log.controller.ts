import { Request, Response } from 'express';
import { logService } from '../services/log.service';
import { asyncHandler } from '../utils/asyncHandler';

// POST /logs - Start a new program log
export const startProgramLog = asyncHandler(async (req: Request, res: Response) => {
  const { programId } = req.body;
  const userId = req.user!.userId;

  const programLog = await logService.startProgramLog(userId, programId);
  res.status(201).json(programLog);
});

// PATCH /logs/:logId/day/:dayId - Log a completed workout day
export const logWorkoutDay = asyncHandler(async (req: Request, res: Response) => {
  const { logId, dayId } = req.params;
  const workoutData = req.body;
  const userId = req.user!.userId;

  const logDay = await logService.logWorkoutDay(userId, logId, dayId, workoutData);
  res.json(logDay);
});

// GET /logs - Get all user's program logs
export const getUserLogs = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const logs = await logService.getUserLogs(userId);
  res.json(logs);
});

// GET /logs/:logId - Get a specific log by ID
export const getLogById = asyncHandler(async (req: Request, res: Response) => {
  const { logId } = req.params;
  const userId = req.user!.userId;

  const log = await logService.getLogById(userId, logId);
  res.json(log);
});

// PATCH /logs/:logId/end - End a program log
export const endProgramLog = asyncHandler(async (req: Request, res: Response) => {
  const { logId } = req.params;
  const userId = req.user!.userId;

  const log = await logService.endProgramLog(userId, logId);
  res.json(log);
});

// GET /logs/program/:programId - Get logs for a specific program
export const getProgramLogs = asyncHandler(async (req: Request, res: Response) => {
  const { programId } = req.params;
  const userId = req.user!.userId;

  const logs = await logService.getProgramLogs(userId, programId);
  res.json(logs);
});
