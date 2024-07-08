const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    // Extract the Authorization header from the request
    let authorizationHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authorizationHeader) {
      return res
        .status(401)
        .json({ message: "You must be logged in to access this resource." });
    }

    // Split the Authorization header to retrieve the token part
    let token = authorizationHeader.split(" ")[1];

    // Check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "You must be logged in to access this resource." });
    }

    // Verify the JWT token
    const payload = jwt.verify(token, process.env.JWT_SECRET || "verySecret");

    if (!payload) {
      return res
        .status(401)
        .json({ message: "You must be logged in to access this resource." });
    }

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    // Handle specific JWT errors
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Your session has expired." });
    }

    // Handle other errors
    res.status(500).json({ message: "Server error." });
  }
};
