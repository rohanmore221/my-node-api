const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// A sample protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
});

module.exports = router;
