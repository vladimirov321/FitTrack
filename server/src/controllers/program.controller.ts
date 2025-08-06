import { Request, Response } from 'express';
import { programService } from '../services/program.service';
import { asyncHandler } from '../utils/asyncHandler';

export const createProgramWithDaysAndExercises = asyncHandler(async (req: Request, res: Response) => {
  const { name, details, days } = req.body;
  const userId = req.user!.userId;

  const program = await programService.createProgramWithDaysAndExercises(userId, {
    name,
    details,
    days
  });
  
  res.status(201).json(program);
});

export const getUserPrograms = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const programs = await programService.getUserPrograms(userId);
  res.json(programs);
});
