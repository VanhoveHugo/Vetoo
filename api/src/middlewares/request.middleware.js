exports.haveBodyContent = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "La requête est invalide." });
  }
  for (let key in req.body) {
    if (typeof req.body[key] === "string") {
      req.body[key] = req.body[key].trim();
    }
  }
  next();
};

exports.haveQueryContent = (req, res, next) => {
  if (!req.query || Object.keys(req.query).length === 0) {
    return res.status(400).json({ message: "La requête est invalide." });
  }
  next();
};
