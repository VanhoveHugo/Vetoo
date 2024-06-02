const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
  try {
    let Authorization = req.headers.authorization;

    let token = Authorization.split(" ")[1];

    if (!token)
      return res.status(401).json({
        message: "Vous devez être connecté pour accéder à cette ressource.",
      });

    const payload = jwt.verify(token, jwtSecret);

    if (!payload)
      return res.status(401).json({
        message: "Vous devez être connecté pour accéder à cette ressource.",
      });

    req.user = payload;
    next();
  } catch (error) {
    if (error.message === "jwt expired") {
      return res.status(401).json({ message: "Votre session a expiré." });
    }
    res.status(500).json({ message: "Erreur serveur." });
  }
};
