const jwt = require("jsonwebtoken");

const User = require("../Models/User");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-Password");
      if (!req.user) {
        res.status(404);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      console.error("Error in token verification or user query:", error); // Log error
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authorizeUser = asyncHandler((req, res, next) => {
  try {
    const { User } = req.body;
    console.log(req.user)
    console.log(User)
    if (User !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this route" });
    }
    next();
  } catch (error) {
    console.error("Error in user authorization:", error); // Log error
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});

module.exports = { protect, authorizeUser };
