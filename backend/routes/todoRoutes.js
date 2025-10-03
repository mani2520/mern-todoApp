const express = require("express");
const router = express.Router();

const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

const authMiddleware = require("../middleware/authMiddleware");
const todoLimitMiddleware = require("../middleware/todoLimitMiddleware");

router.get("/", authMiddleware, getTodos);

router.post("/", authMiddleware, todoLimitMiddleware, createTodo);

router.put("/:id", authMiddleware, updateTodo);

router.delete("/:id", authMiddleware, deleteTodo);

module.exports = router;
