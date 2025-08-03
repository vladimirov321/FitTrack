import express from 'express';
import { login, logout, refresh, register } from '../controllers/auth.controller';
import { validateAuthRequest, validateRefreshToken } from '../middleware/validation.middleware';

const router = express.Router();

router.post('/register', validateAuthRequest, register);
router.post('/login', validateAuthRequest, login);
router.post('/refresh-token', validateRefreshToken, refresh);
router.post('/logout', logout);

export default router;
