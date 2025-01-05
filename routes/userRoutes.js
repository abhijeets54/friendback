import express from 'express';
import { auth } from '../middleware/auth.js';
import { searchUsers, getFriends } from '../controllers/userController.js';

const router = express.Router();

router.use(auth);

router.get('/search', searchUsers);
router.get('/friends', getFriends);

export default router;