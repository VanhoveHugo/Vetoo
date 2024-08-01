const database = require("../utils/database.js");
const xss = require("xss");

const Treatment = (treatment) => {
  this.title = treatment.title; // Required
  this.type = treatment.type; // Required
  this.date = treatment.date; // Required
  this.comment = treatment.comment;
}

Treatment.create = async (newTreatment, result) => {
  try {
    // Check required fields
    const requiredFields = ["title", "type", "date"];
    for (const field of requiredFields) {
      if (!newTreatment[field]) {
        return result({ kind: "content_not_found", content: field }, null);
      }
    }

    // Escape user inputs to prevent XSS
    const escapedTreatment = {
      title: xss(newTreatment.title),
      type: xss(newTreatment.type),
      date: xss(newTreatment.date),
      comment: newTreatment.comment ? xss(newTreatment.comment) : null,
    };

    // Add treatment to the database
    database.query(
      `INSERT INTO treatment SET ?`,
      escapedTreatment,
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while creating the treatment:",
            err.message
          );
          return result(
            {
              kind: "database_error",
              message: "An error occurred while querying the database",
            },
            null
          );
        }

        result(null, { id: data.insertId, ...escapedTreatment });
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

Treatment.findById = async (treatmentId, result) => {
  try {
    // Check if treatmentId is provided
    if (!treatmentId) {
      return result(
        { kind: "treatment_id_required", message: "Treatment ID is required" },
        null
      );
    }

    // Query to find treatment by ID
    database.query(
      `SELECT title, type, date, comment FROM treatment WHERE id = ?`,
      treatmentId,
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while reading the treatment:",
            err.message
          );
          return result(
            {
              kind: "database_error",
              message: "An error occurred while querying the database",
            },
            null
          );
        }

        // Check if any treatment is found
        if (data.length === 0) {
          return result(
            {
              kind: "not_found",
              message: `Treatment with ID ${treatmentId} not found`,
            },
            null
          );
        }

        result(null, data[0]);
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

Treatment.updateById = async (treatmentId, updatedTreatment, result) => {
  try {
    // Check if treatmentId is provided
    if (!treatmentId) {
      return result(
        { kind: "treatment_id_required", message: "Treatment ID is required" },
        null
      );
    }

    // Handle required fields
    const requiredFields = ["title", "type", "date"];
    for (const field of requiredFields) {
      if (updatedTreatment[field] === undefined) {
        return result({ kind: "content_not_found", content: field }, null);
      }
    }

    // Escape user inputs to prevent XSS
    const escapedTreatment = {
      title: updatedTreatment.title ? xss(updatedTreatment.title) : null,
      type: updatedTreatment.type ? xss(updatedTreatment.type) : null,
      date: updatedTreatment.date ? xss(updatedTreatment.date) : null,
      comment: updatedTreatment.comment ? xss(updatedTreatment.comment) : null,
    };

    // Remove undefined properties from escapedTreatment
    Object.keys(escapedTreatment).forEach((key) => {
      if (escapedTreatment[key] === null) {
        delete escapedTreatment[key];
      }
    });

    // Update treatment in the database
    database.query(
      `UPDATE treatment SET ? WHERE id = ?`,
      [escapedTreatment, treatmentId],
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while updating the treatment:",
            err.message
          );
          return result(
            {
              kind: "database_error",
              message: "An error occurred while updating the treatment",
            },
            null
          );
        }

        if (data.affectedRows === 0) {
          return result(
            {
              kind: "not_found",
              message: `Treatment with ID ${treatmentId} not found`,
            },
            null
          );
        }

        result(null, { id: treatmentId, ...escapedTreatment });
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

Treatment.deleteById = async (treatmentId, result) => {
  try {
    // Check if treatmentId is provided
    if (!treatmentId) {
      return result(
        { kind: "treatment_id_required", message: "Treatment ID is required" },
        null
      );
    }

    // Delete treatment from the database
    database.query(
      `DELETE FROM treatment WHERE id = ?`,
      treatmentId,
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while deleting the treatment:",
            err.message
          );
          return result(
            {
              kind: "database_error",
              message: "An error occurred while deleting the treatment",
            },
            null
          );
        }

        // Check if any treatment was deleted
        if (data.affectedRows === 0) {
          return result(
            {
              kind: "not_found",
              message: `Treatment with ID ${treatmentId} not found`,
            },
            null
          );
        }

        result(null, {
          message: `Treatment with ID ${treatmentId} was deleted successfully`,
        });
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

module.exports = Treatment;
