import express from 'express';
import { getHackathons, getHackathonById } from '../controllers/hackathonController.js';

const router = express.Router();

router.get('/', getHackathons);
router.get('/:id', getHackathonById);

export default router;
