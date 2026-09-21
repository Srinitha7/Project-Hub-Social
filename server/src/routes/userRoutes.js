import express from 'express';
import { getProfileByUsername, updateProfile, toggleFollow, findTeammates } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/teammates', findTeammates);
router.get('/profile/:username', getProfileByUsername);
router.put('/profile', authenticateToken, updateProfile);
router.post('/follow', authenticateToken, toggleFollow);

export default router;
