const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const todoRoutes = require("./routes/todoRoutes");

const authRouters = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/todos", todoRoutes);

app.use("/api", authRouters);

require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Server runnnig successfully");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started at PORT: ${PORT}`);
});
