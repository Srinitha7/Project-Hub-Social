import express from 'express';
import { getPosts, getSavedPosts, createPost, toggleLikePost, addCommentPost, toggleSavePost } from '../controllers/postController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/saved', authenticateToken, getSavedPosts);
router.post('/', authenticateToken, createPost);
router.post('/:postId/like', authenticateToken, toggleLikePost);
router.post('/:postId/comment', authenticateToken, addCommentPost);
router.post('/:postId/save', authenticateToken, toggleSavePost);

export default router;
