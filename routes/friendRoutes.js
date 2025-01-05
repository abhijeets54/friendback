import express from 'express';
import { auth } from '../middleware/auth.js';
import {
  sendFriendRequest,
  respondToFriendRequest,
  getFriendRecommendations,
  getReceivedFriendRequests // Importing the new function
} from '../controllers/friendController.js';

const router = express.Router();

router.use(auth);

router.post('/request', sendFriendRequest);
router.post('/respond', respondToFriendRequest);
router.get('/recommendations', getFriendRecommendations);
router.get('/requests', getReceivedFriendRequests); // New route for received friend requests

export default router;
