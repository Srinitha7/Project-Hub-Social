import express from 'express';
import {
  getTeams,
  getTeamById,
  createTeam,
  requestToJoinTeam,
  handleJoinRequest,
  createTeamTask,
  updateTeamTaskStatus
} from '../controllers/teamController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTeams);
router.get('/:id', getTeamById);
router.post('/', authenticateToken, createTeam);
router.post('/:id/request', authenticateToken, requestToJoinTeam);
router.put('/:id/request/:requestId', authenticateToken, handleJoinRequest);
router.post('/:id/tasks', authenticateToken, createTeamTask);
router.put('/tasks/:taskId', authenticateToken, updateTeamTaskStatus);

export default router;
