const Pet = require("../models/pet.model.js");
const jwt = require("jsonwebtoken");

/**
 * Handle Pets
 */
exports.create = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || "verySecret");
    const ownerId = payload.id;

    // Check if user is logged in
    if (!ownerId) {
      return res.status(400).json({ kind: "not_logged_in" });
    }

    const newPet = req.body;

    // Handle required fields
    const requiredFields = ["name", "type"];
    for (const field of requiredFields) {
      if (!newPet[field]) {
        return res
          .status(400)
          .json({ kind: "content_not_found", content: field });
      }
    }

    // Handle constraints of database
    if (newPet.name.length > 20) {
      return res
        .status(400)
        .json({ kind: "content_too_long", content: "name" });
    }
    if (!["d", "c"].includes(newPet.type)) {
      return res.status(400).json({ kind: "content_invalid", content: "type" });
    }
    if (newPet.gender && !["m", "f"].includes(newPet.gender)) {
      return res
        .status(400)
        .json({ kind: "content_invalid", content: "gender" });
    }

    // Now handle the image upload
    Pet.create(newPet, ownerId, (err, pet) => {
      if (err) {
        console.error("Error creating pet: ", err);
        return res.status(400).json({ message: err.message });
      }
      return res.status(201).json(pet);
    });
  } catch (error) {
    console.error("Error processing request: ", error);
    return res.status(500).json({ message: "Server error." });
  }
};

exports.update = (req, res) => {
  const petId = req.params.id;
  const updatedPet = req.body;

  if (!petId) {
    return res.status(400).json({ message: "Pet ID is required." });
  }

  Pet.updateById(petId, updatedPet, (err, pet) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({ message: "Pet not found." });
      }
      console.error("Error updating pet: ", err);
      return res.status(500).json({ message: "Server error." });
    }
    return res.status(200).json({ pet });
  });
};

exports.getAllPets = (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  Pet.findByUserId(userId, (err, pets) => {
    if (err) {
      console.error("Error retrieving pets: ", err);
      return res.status(500).json({ message: "Server error." });
    }
    if (!pets || pets.length === 0) {
      return res.status(404).json({ message: "No pets found for this user." });
    }
    return res.status(200).json(pets);
  });
};

exports.delete = (req, res) => {
  const petId = req.params.petId;

  if (!petId) {
    return res.status(400).json({ message: "Pet ID is required." });
  }

  Pet.deleteById(petId, (err, pet) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).json({ message: "Pet not found." });
      }
      console.error("Error deleting pet: ", err);
      return res.status(500).json({ message: "Server error." });
    }
    return res.status(204).json({ message: "Pet deleted successfully." });
  });
};
