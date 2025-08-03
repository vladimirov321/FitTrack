import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.register(req.body.email, req.body.password);
  res.status(201).json({ id: user.id, email: user.email });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { accessToken } = await authService.login(req.body.email, req.body.password, res);
  res.json({ accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const token = req.refreshToken!; // Set by middleware
  const { accessToken } = await authService.refreshToken(token, res);
  res.json({ accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) await authService.logout(token);
  res.clearCookie('refreshToken');
  res.status(204).send();
});
