const corn = require("node-cron");
const User = require("./models/User");
const Todo = require("./models/Todo");

corn.schedule("0 * * * *", async () => {
  const expire = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const users = await User.find({
    verified: false,
    createdAt: { $lt: expire },
  });

  for (const user of users) {
    await Todo.deleteMany({ user: user._id });
    await user.deleteOne();
  }

  console.log("Deleted unverified accounts + todos older than 1 day");
});
