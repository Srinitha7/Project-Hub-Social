import express from 'express';
import { getConversations, getMessagesWithUser, sendMessage } from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/conversations', getConversations);
router.get('/:partnerId', getMessagesWithUser);
router.post('/', sendMessage);

export default router;
