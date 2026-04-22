const User = require("../models/User");

// @desc    Update user fit data
// @route   POST /api/users/fit
// @access  Private
const saveUserFit = async (req, res) => {
  try {
    const { fitType, fitAdvice, confidence } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.fitType = fitType || user.fitType;
      user.fitAdvice = fitAdvice || user.fitAdvice;
      user.confidence = confidence || user.confidence;

      const updatedUser = await user.save();

      res.json({
        message: "Fit saved successfully ✅",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          fitType: updatedUser.fitType,
          fitAdvice: updatedUser.fitAdvice,
          confidence: updatedUser.confidence,
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get user fit data
// @route   GET /api/users/fit
// @access  Private
const getUserFit = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        fitType: user.fitType,
        fitAdvice: user.fitAdvice,
        confidence: user.confidence
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { saveUserFit, getUserFit };
