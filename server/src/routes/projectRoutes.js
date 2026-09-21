import express from 'express';
import { getProjects, getProjectById, createProject, toggleLikeProject, addProjectComment } from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', authenticateToken, createProject);
router.post('/:id/like', authenticateToken, toggleLikeProject);
router.post('/:id/comment', authenticateToken, addProjectComment);

export default router;
