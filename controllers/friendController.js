import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user.id;

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    const request = new FriendRequest({
      sender: senderId,
      recipient: recipientId
    });

    await request.save();

    // Add request to recipient's friendRequests array
    await User.findByIdAndUpdate(recipientId, {
      $push: { friendRequests: request._id }
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;
    const userId = req.user.id;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'accepted') {
      // Add users to each other's friends lists
      await User.findByIdAndUpdate(request.sender, {
        $push: { friends: request.recipient }
      });
      await User.findByIdAndUpdate(request.recipient, {
        $push: { friends: request.sender }
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFriendRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('friends');

    // Get friends of friends
    const friendsOfFriends = await User.find({
      _id: { 
        $in: user.friends.flatMap(friend => friend.friends),
        $nin: [...user.friends, userId]
      }
    }).limit(5);

    res.json(friendsOfFriends);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// New function to get received friend requests
export const getReceivedFriendRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await FriendRequest.find({
      recipient: userId,
      status: 'pending'
    }).populate('sender', 'username'); // Assuming sender has a username field

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};