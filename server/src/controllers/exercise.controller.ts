import { Request, Response } from 'express';
import { exerciseService } from '../services/exercise.service';
import { asyncHandler } from '../utils/asyncHandler';

export const createExercise = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.user!.userId;

  const exercise = await exerciseService.createExercise(userId, { name });
  res.status(201).json(exercise);
});

export const getUserExercises = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const exercises = await exerciseService.getUserExercises(userId);
  res.json(exercises);
});

export const getExerciseById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const exercise = await exerciseService.getExerciseById(userId, id);
  res.json(exercise);
});

export const updateExerciseName = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  const userId = req.user!.userId;

  const exercise = await exerciseService.updateExerciseName(userId, id, { name });
  res.json(exercise);
});

export const replaceExerciseSets = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { sets } = req.body;
  const userId = req.user!.userId;

  const exercise = await exerciseService.replaceExerciseSets(userId, id, sets);
  res.json(exercise);
});

export const deleteExercise = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  const result = await exerciseService.deleteExercise(userId, id);
  res.json(result);
});
