const database = require("../utils/database.js");

const Weight = (weight) => {
  this.date = weight.date; // Required
  this.weight = weight.weight; // Required
};

Weight.create = (newWeight, result) => {
  try {
    // Vérifier si les champs obligatoires sont présents
    if (!newWeight.date || !newWeight.weight) {
      return result(
        {
          kind: "content_not_found",
          message: "Date and weight are required fields",
        },
        null
      );
    }

    console.log("New weight: ", newWeight);

    // Requête pour insérer un nouveau poids
    const query = `INSERT INTO weights SET ?`;
    database.query(query, newWeight, (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while inserting the weight",
          },
          null
        );
      }
      result(null, { id: data.insertId, ...newWeight });
    });
  } catch (error) {
        console.error("Error: ", error.message);
result(
      {
        kind: "unexpected_error",
        message: "An unexpected error occurred",
      },
      null
    );
  }
};


Weight.findByPetId = (id, result) => {
  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return result(
        { kind: "content_not_found", message: "Pet ID is required" },
        null
      );
    }

    // Requête pour récupérer un poids par ID
    const query = `SELECT * FROM weights WHERE pet_id = ? ORDER BY date ASC`;
    database.query(query, [id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while querying the database",
          },
          null
        );
      }

      // Retourner les données du poids
      result(null, data);
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

Weight.updateById = (id, updatedWeight, result) => {
  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return result(
        { kind: "content_not_found", message: "Weight ID is required" },
        null
      );
    }

    // Vérifier si les champs obligatoires sont présents
    if (!updatedWeight.date || !updatedWeight.weight) {
      return result(
        {
          kind: "content_not_found",
          message: "Date and weight are required fields",
        },
        null
      );
    }

    // Requête pour mettre à jour un poids par ID
    const query = `UPDATE weights SET ? WHERE id = ?`;
    database.query(query, [updatedWeight, id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while updating the weight",
          },
          null
        );
      }

      // Vérifier si le poids est trouvé et mis à jour
      if (data.affectedRows === 0) {
        return result(
          {
            kind: "weight_not_found",
            message: `Weight with ID ${id} not found`,
          },
          null
        );
      }

      // Retourner les données mises à jour du poids
      result(null, { id: id, ...updatedWeight });
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

Weight.deleteById = (id, result) => {
  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return result(
        { kind: "content_not_found", message: "Weight ID is required" },
        null
      );
    }

    // Requête pour supprimer un poids par ID
    const query = `DELETE FROM weights WHERE id = ?`;
    database.query(query, [id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while deleting the weight",
          },
          null
        );
      }

      // Vérifier si le poids est trouvé et supprimé
      if (data.affectedRows === 0) {
        return result(
          {
            kind: "weight_not_found",
            message: `Weight with ID ${id} not found`,
          },
          null
        );
      }

      // Retourner les données du poids supprimé
      result(null, { message: `Weight with ID ${id} deleted successfully` });
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

Weight.findByDate = (date, pet_id, result) => {
  try {
    if (!date) {
      return result(
        { kind: "content_not_found", message: "Date is required" },
        null
      );
    }

    const query = `SELECT * FROM weights WHERE date = ? AND pet_id = ? ORDER BY date ASC`;
    database.query(query, [date, pet_id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while querying the database",
          },
          null
        );
      }

      if (data.length) {
        return result(null, data[0]); // Retourner le premier enregistrement trouvé
      } else {
        return result(null, null); // Aucune donnée trouvée
      }
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

module.exports = Weight;