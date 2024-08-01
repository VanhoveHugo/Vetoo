const database = require("../utils/database.js");

const Vaccine = (vaccine) => {
  this.name = vaccine.name; // Required
  this.type = vaccine.type; // Required
  this.date = vaccine.date;
  this.reminder = vaccine.reminder;
  this.comment = vaccine.comment;
};

Vaccine.create = (newVaccine, result) => {
  try {
    // Vérifier si les champs obligatoires sont présents
    if (!newVaccine.name || !newVaccine.type) {
      return result(
        {
          kind: "content_not_found",
          message: "Name and type are required fields",
        },
        null
      );
    }

    // Requête pour insérer un nouveau vaccin
    const query = `INSERT INTO vaccines SET ?`;
    database.query(query, newVaccine, (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while inserting the vaccine",
          },
          null
        );
      }
      result(null, { id: data.insertId, ...newVaccine });
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

Vaccine.findById = (id, result) => {
  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return result(
        { kind: "content_not_found", message: "Vaccine ID is required" },
        null
      );
    }

    // Requête pour récupérer un vaccin par ID
    const query = `SELECT * FROM vaccines WHERE id = ?`;
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

      // Vérifier si le vaccin est trouvé
      if (data.length === 0) {
        return result(
          {
            kind: "vaccine_not_found",
            message: `Vaccine with ID ${id} not found`,
          },
          null
        );
      }

      // Retourner les données du vaccin
      result(null, data[0]);
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

Vaccine.updateById = (id, updatedVaccine, result) => {
  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return result(
        { kind: "content_not_found", message: "Vaccine ID is required" },
        null
      );
    }

    // Vérifier si les champs obligatoires sont présents
    if (!updatedVaccine.name || !updatedVaccine.type) {
      return result(
        {
          kind: "content_not_found",
          message: "Name and type are required fields",
        },
        null
      );
    }

    // Requête pour mettre à jour un vaccin par ID
    const query = `UPDATE vaccines SET ? WHERE id = ?`;
    database.query(query, [updatedVaccine, id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while updating the vaccine",
          },
          null
        );
      }

      // Vérifier si le vaccin est trouvé et mis à jour
      if (data.affectedRows === 0) {
        return result(
          {
            kind: "vaccine_not_found",
            message: `Vaccine with ID ${id} not found`,
          },
          null
        );
      }

      // Retourner les données mises à jour du vaccin
      result(null, { id: id, ...updatedVaccine });
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

Vaccine.deleteById = (id, result) => {
  try {
    // Vérifier si l'ID est fourni
    if (!id) {
      return result(
        { kind: "content_not_found", message: "Vaccine ID is required" },
        null
      );
    }

    // Requête pour supprimer un vaccin par ID
    const query = `DELETE FROM vaccines WHERE id = ?`;
    database.query(query, [id], (err, data) => {
      if (err) {
        console.error("Error: ", err.message);
        return result(
          {
            kind: "database_error",
            message: "An error occurred while deleting the vaccine",
          },
          null
        );
      }

      // Vérifier si le vaccin est trouvé et supprimé
      if (data.affectedRows === 0) {
        return result(
          {
            kind: "vaccine_not_found",
            message: `Vaccine with ID ${id} not found`,
          },
          null
        );
      }

      // Retourner les données du vaccin supprimé
      result(null, { message: `Vaccine with ID ${id} deleted successfully` });
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    result(
      { kind: "unexpected_error", message: "An unexpected error occurred" },
      null
    );
  }
};

module.exports = Appointment;
