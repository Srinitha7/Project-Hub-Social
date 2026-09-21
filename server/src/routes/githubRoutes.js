import express from 'express';
import { getGitHubUserRepos } from '../controllers/githubController.js';

const router = express.Router();

router.get('/:username/repos', getGitHubUserRepos);

export default router;
