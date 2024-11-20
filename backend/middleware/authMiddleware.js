const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided. Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your environment variables
    req.user = decoded; // Attach user info to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token. Access denied." });
  }
};

module.exports = { authMiddleware };
