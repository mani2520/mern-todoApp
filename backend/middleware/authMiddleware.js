const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ meassage: "No token, authorization denied" });
  jwt.verify(token, "secretkey", (error, decoded) => {
    if (error) return res.status(401).json({ message: "Invalid token" });
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
