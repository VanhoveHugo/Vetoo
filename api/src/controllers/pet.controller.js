const Pet = require("../models/pet.model.js");

/**
 * Handle Pets
 */
exports.createPet = (req, res) => {
  let ownerId = req.user.id;
  Pet.create(req.body, ownerId, (err, pet) => {
    if (err) return res.status(500).json({ message: err });
    return res.json(pet);
  });
};

exports.getAllPets = (req, res) => {
  Pet.findByUserId(req.params.userId, (err, pets) => {
    if (err) return res.status(500).json({ message: "Erreur serveur." });
    return res.json(pets);
  });
};
