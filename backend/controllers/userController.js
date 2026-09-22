const User = require("../models/User");
const LessonProgress = require("../models/LessonProgress");
const LabProgress = require("../models/LabProgress");
require("../models/Lesson");
require("../models/Lab");

// GET LOGGED-IN USER PROFILE
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("completedLessons", "title category lessonNumber")
      .populate("completedLabs", "title tool category difficulty xpReward");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Aggregate completed lessons from LessonProgress collection to ensure complete accuracy
    const lessonProgressRecords = await LessonProgress.find({
      user: req.user.id,
      completed: true,
    }).populate("lesson", "title category lessonNumber");

    // Aggregate completed labs from LabProgress collection
    const labProgressRecords = await LabProgress.find({
      user: req.user.id,
      completed: true,
    }).populate("lab", "title tool category difficulty xpReward");

    const completedLessonMap = new Map();
    (user.completedLessons || []).forEach(l => {
      if (l && l._id) completedLessonMap.set(l._id.toString(), l);
    });
    lessonProgressRecords.forEach(lp => {
      if (lp.lesson && lp.lesson._id) {
        completedLessonMap.set(lp.lesson._id.toString(), lp.lesson);
      }
    });

    const completedLabMap = new Map();
    (user.completedLabs || []).forEach(l => {
      if (l && l._id) completedLabMap.set(l._id.toString(), l);
    });
    labProgressRecords.forEach(lp => {
      if (lp.lab && lp.lab._id) {
        completedLabMap.set(lp.lab._id.toString(), lp.lab);
      }
    });

    const userObj = user.toObject();
    userObj.completedLessons = Array.from(completedLessonMap.values());
    userObj.completedLabs = Array.from(completedLabMap.values());

    res.status(200).json({
      success: true,
      data: userObj,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load profile",
    });
  }
};

module.exports = {
  getMyProfile,
};
