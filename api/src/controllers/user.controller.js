const User = require("../models/user.model.js");
const Pet = require("../models/pet.model.js");
const jwt = require("jsonwebtoken");

/**
 * Authentication
 */
exports.register = (req, res) => {
  User.create(req.body, (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Erreur serveur." });
    }
    return res.json(user);
  });
};

exports.login = (req, res) => {
  let email = req.body.email.trim();
  let password = req.body.password.trim();

  if (!email)
    return res
      .status(400)
      .json({ kind: "content_not_found", content: "email" });
  if (!password)
    return res
      .status(400)
      .json({ kind: "content_not_found", content: "password" });

  User.login(email, password, (err, user) => {
    if (err) {
      if (err.kind === "user_not_found" || err.kind === "password_mismatch")
        return res
          .status(400)
          .json({ message: "Utilisateur ou mot de passe incorrect." });
      return res.status(500).json({ message: JSON.stringify(err) });
    }
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "verySecret",
      {
        expiresIn: "7d",
      }
    );

    jwt.verify(
      token,
      process.env.JWT_SECRET || "verySecret",
      (err, decoded) => {
        if (err) {
          console.error("Erreur de décodage du JWT : ", err);
          return;
        }
      }
    );

    user.password = undefined;

    Pet.findByUserId(user.id, (err, pets) => {
      if (err) return res.status(500).json({ message: "Erreur serveur." });
      user.pets = pets;
      return res.json({ user, token });
    });
  });
};

/**
 * Handle Users
 */
exports.getAllUsers = (req, res) => {
  User.all((err, users) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    return res.json(users);
  });
};

exports.getUserById = (req, res) => {
  User.findById(req.params.userId, (err, user) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    return res.json(user);
  });
};

exports.getAccount = (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Token manquant." });
  }

  const token = req.headers.authorization.replace("Bearer ", "");

  jwt.verify(token, process.env.JWT_SECRET || "verySecret", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: err.message });
    }

    User.getById(decoded.id, (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Erreur serveur." });
      }

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      Pet.findByUserId(decoded.id, (err, pets) => {
        if (err) {
          return res.status(500).json({ message: "Erreur serveur." });
        }

        user.pets = pets;
        return res.json(user);
      });
    });
  });
};
