const database = require("../utils/database.js");
const xss = require("xss");

const Pet = (pet) => {
  this.name = pet.name; // Required
  this.type = pet.type; // Required
  this.picture_url = pet.picture_url;
  this.chip = pet.chip;
  this.birthdate = pet.birthdate;
  this.gender = pet.gender;
  this.user_id = pet.user_id; // Required
};

Pet.create = async (newPet, ownerId, result) => {
  try {
    // Check if user is logged in
    if (!ownerId) {
      return result({ kind: "not_logged_in" }, null);
    }

    // Handle required fields
    const requiredFields = ["name", "type"];
    for (const field of requiredFields) {
      if (!newPet[field]) {
        return result({ kind: "content_not_found", content: field }, null);
      }
    }

    // Handle constraints of database
    if (newPet.name.length > 20) {
      return result({ kind: "content_too_long", content: "name" }, null);
    }
    if (!["d", "c", "n"].includes(newPet.type)) {
      return result({ kind: "content_invalid", content: "type" }, null);
    }
    if (newPet.gender && !["m", "f"].includes(newPet.gender)) {
      return result({ kind: "content_invalid", content: "gender" }, null);
    }

    // Escape user inputs to prevent XSS
    const escapedPet = {
      name: xss(newPet.name),
      type: xss(newPet.type),
      picture_url: newPet.picture_url ? xss(newPet.picture_url) : null,
      chip: newPet.chip ? xss(newPet.chip) : null,
      birthdate: newPet.birthdate ? xss(newPet.birthdate) : null,
      gender: newPet.gender ? xss(newPet.gender) : null,
      user_id: ownerId,
    };

    // Add pet to database
    database.query(`INSERT INTO pets SET ?`, escapedPet, (err, data) => {
      if (err) {
        console.error("An error occurred while creating pet:", err.message);
        return result(null, err);
      }

      result(null, { id: data.insertId, ...escapedPet });
    });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    result(null, {
      kind: "unexpected_error",
      message: "An unexpected error occurred",
    });
  }
};

Pet.findByUserId = async (userId, result) => {
  try {
    // Check if user ID is provided
    if (!userId) {
      return result({ kind: "user_not_found" }, null);
    }

    // Query to find pets by user ID
    database.query(
      `SELECT birthdate, chip, created_at, gender, id, name, picture_url, type FROM pets WHERE user_id = ?`,
      userId,
      (err, data) => {
        if (err) {
          console.error("An error occurred while reading pets:", err.message);
          return result(
            {
              kind: "database_error",
              message: "An error occurred while querying the database",
            },
            null
          );
        }
        return result(null, data);
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
    result(null, {
      kind: "unexpected_error",
      message: "An unexpected error occurred",
    });
  }
};

Pet.updateById = async (petId, updatedPet, result) => {
  try {
    // Check if petId is provided
    console.log(updatedPet);
    if (!petId) {
      return result(
        { kind: "pet_id_required", message: "Pet ID is required" },
        null
      );
    }

    // Handle required fields
    const requiredFields = ["name", "type", "gender"];
    for (const field of requiredFields) {
      if (updatedPet[field] === undefined) {
        return result({ kind: "content_not_found", content: field }, null);
      }
    }

    // Handle constraints of database
    if (updatedPet.name && updatedPet.name.length > 20) {
      return result({ kind: "content_too_long", content: "name" }, null);
    }
    if (updatedPet.type && !["d", "c", "n"].includes(updatedPet.type)) {
      return result({ kind: "content_invalid", content: "type" }, null);
    }
    if (updatedPet.gender && !["m", "f"].includes(updatedPet.gender)) {
      return result({ kind: "content_invalid", content: "gender" }, null);
    }

    // Escape user inputs to prevent XSS
    const escapedPet = {
      name: updatedPet.name ? xss(updatedPet.name) : null,
      type: updatedPet.type ? xss(updatedPet.type) : null,
      picture_url: updatedPet.picture_url ? xss(updatedPet.picture_url) : null,
      chip: updatedPet.chip ? xss(updatedPet.chip) : null,
      birthdate: updatedPet.birthdate ? xss(updatedPet.birthdate) : null,
      gender: updatedPet.gender ? xss(updatedPet.gender) : null,
    };

    // Update pet in the database
    database.query(
      `UPDATE pets SET ? WHERE id = ?`,
      [escapedPet, petId],
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while updating the pet:",
            err.message
          );
          return result(
            {
              kind: "database_error",
              message: "An error occurred while updating the pet",
            },
            null
          );
        }

        if (data.affectedRows === 0) {
          return result(
            { kind: "not_found", message: `Pet with ID ${petId} not found` },
            null
          );
        }

        result(null, { id: petId, ...escapedPet });
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error.message);
    result(null, {
      kind: "unexpected_error",
      message: "An unexpected error occurred",
    });
  }
};

Pet.deleteById = async (petId, result) => {
  try {
    // Check if petId is provided
    if (!petId) {
      return result(
        { kind: "pet_id_required", message: "Pet ID is required" },
        null
      );
    }

    // Delete pet from database
    database.query(`DELETE FROM pets WHERE id = ?`, petId, (err, data) => {
      if (err) {
        console.error("An error occurred while deleting pet:", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while deleting the pet",
          },
          null
        );
      }

      // Check if any pet was deleted
      if (data.affectedRows === 0) {
        return result(
          { kind: "not_found", message: `Pet with ID ${petId} not found` },
          null
        );
      }

      // Return success response
      result(null, {
        message: `Pet with ID ${petId} was deleted successfully`,
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    result(null, {
      kind: "unexpected_error",
      message: "An unexpected error occurred",
    });
  }
};

module.exports = Pet;
