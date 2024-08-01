const Weight = require("../models/weight.model");

exports.create = (req, res) => {
  const { date, weight, pet_id } = req.body.data;

  if (!date || !weight) {
    return res
      .status(400)
      .json({ message: "Date and weight are required fields." });
  }

  Weight.findByDate(date, pet_id, (err, existingWeight) => {
    if (err) {
      console.error("Error checking weight:", err);
      return res
        .status(500)
        .json({ message: "Failed to create weight entry." });
    }

    if (existingWeight) {
      // Si le poids existe déjà, mettre à jour l'entrée existante
      const updateData = { date, weight, pet_id };
      Weight.updateById(existingWeight.id, updateData, (err, updatedWeight) => {
        if (err) {
          console.error("Error updating weight:", err);
          return res
            .status(500)
            .json({ message: "Failed to update weight entry." });
        }
        return res.status(200).json(updatedWeight); // Retourner l'entrée de poids mise à jour
      });
    } else {
      // Si le poids n'existe pas, créer une nouvelle entrée
      const newWeight = { date, weight, pet_id };
      Weight.create(newWeight, (err, createdWeight) => {
        if (err) {
          console.error("Error creating weight:", err);
          return res
            .status(500)
            .json({ message: "Failed to create weight entry." });
        }
        return res.status(201).json(createdWeight); // Retourner la nouvelle entrée de poids créée
      });
    }
  });
};

exports.getWeightByPetId = (req, res) => {
  const petId = req.params.petId;

  // Appeler la méthode findById du modèle Weight
  Weight.findByPetId(petId, (err, weight) => {
    if (err) {
      console.error("Error retrieving weight:", err);
      return res.status(500).json({ message: "Failed to retrieve weight." });
    }
    if (!weight) {
      return res.status(404).json({ message: "Weight not found." });
    }
    res.status(200).json(weight); // Retourner les poids trouvé
  });
};

exports.update = (req, res) => {
  const weightId = req.params.weightId;
  const { date, weight } = req.body;

  // Vérifier si les champs obligatoires sont présents
  if (!date || !weight) {
    return res
      .status(400)
      .json({ message: "Date and weight are required fields." });
  }

  // Créer un objet Weight avec les nouvelles données
  const updatedWeight = new Weight({
    id: weightId,
    date,
    weight,
  });

  // Appeler la méthode update du modèle Weight
  Weight.update(updatedWeight, (err, result) => {
    if (err) {
      console.error("Error updating weight:", err);
      return res.status(500).json({ message: "Failed to update weight." });
    }
    if (!result) {
      return res.status(404).json({ message: "Weight not found." });
    }
    res.status(200).json(result); // Retourner le poids mis à jour
  });
};

exports.delete = (req, res) => {
  const weightId = req.params.weightId;

  // Appeler la méthode deleteById du modèle Weight
  Weight.deleteById(weightId, (err, result) => {
    if (err) {
      console.error("Error deleting weight:", err);
      return res.status(500).json({ message: "Failed to delete weight." });
    }
    if (!result) {
      return res.status(404).json({ message: "Weight not found." });
    }
    res.status(204).json({ message: "Weight deleted successfully." }); // Retourner un statut 204 (No Content) pour succès
  });
};
