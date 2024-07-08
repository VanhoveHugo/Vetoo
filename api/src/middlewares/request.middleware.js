exports.haveBodyContent = (req, res, next) => {
  // Check if request body exists and is not empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid request: Request body is empty." });
  }

  // Trim whitespace from all string values in the request body
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  }

  // Move to the next middleware or route handler
  next();
};

exports.haveQueryContent = (req, res, next) => {
  // Check if request query parameters exist and are not empty
  if (!req.query || Object.keys(req.query).length === 0) {
    return res
      .status(400)
      .json({ message: "Invalid request: Query parameters are empty." });
  }

  // Move to the next middleware or route handler
  next();
};
