import User from '../models/User.js';

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user.id }
    }).select('-password');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('friends', '-password')
      .select('friends');
    
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};