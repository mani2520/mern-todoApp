const Todo = require("../models/Todo");
const User = require("../models/User");

const todoLimitMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const todoCount = await Todo.countDocuments({ user: user._id });
    console.log("Todo count:", todoCount);

    if (!user.verified) {
      const todoCount = await Todo.countDocuments({ user: user._id });

      if (todoCount >= 5) {
        return res
          .status(403)
          .json({ message: "Verify your account to add more todos" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = todoLimitMiddleware;
