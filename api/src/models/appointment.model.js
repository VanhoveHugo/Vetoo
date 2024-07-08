const database = require("../utils/database.js");
const xss = require("xss");

const Appointment = (appointment) => {
  this.meet_at = appointment.meet_at; // Required
  this.reason = appointment.reason; // Required
  this.vet_name = appointment.vet_name;
  this.comment = appointment.comment;
  this.pet_id = appointment.pet_id; // Required
};

Appointment.create = async (newAppointment, result) => {
  try {
    // Check required fields
    const requiredFields = ["meet_at", "reason", "pet_id"];
    for (const field of requiredFields) {
      if (!newAppointment[field]) {
        return result({ kind: "content_not_found", content: field }, null);
      }
    }

    // Escape user inputs to prevent XSS
    const escapedAppointment = {
      meet_at: xss(newAppointment.meet_at),
      reason: xss(newAppointment.reason),
      vet_name: newAppointment.vet_name ? xss(newAppointment.vet_name) : null,
      comment: newAppointment.comment ? xss(newAppointment.comment) : null,
      pet_id: xss(newAppointment.pet_id),
    };

    // Add appointment to the database
    database.query(
      `INSERT INTO appointments SET ?`,
      escapedAppointment,
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while creating the appointment:",
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

        result(null, { id: data.insertId, ...escapedAppointment });
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

Appointment.findById = async (appointmentId, result) => {
  try {
    // Check if appointmentId is provided
    if (!appointmentId) {
      return result(
        {
          kind: "appointment_id_required",
          message: "Appointment ID is required",
        },
        null
      );
    }

    // Query to find appointment by ID
    database.query(
      `SELECT meet_at, reason, vet_name, comment, pet_id FROM appointments WHERE id = ?`,
      appointmentId,
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while reading the appointment:",
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

        // Check if any appointment is found
        if (data.length === 0) {
          return result(
            {
              kind: "not_found",
              message: `Appointment with ID ${appointmentId} not found`,
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

Appointment.findByPetId = async (petId, result) => {
  try {
    // Check if petId is provided
    if (!petId) {
      return result(
        {
          kind: "appointment_id_required",
          message: "Appointment ID is required",
        },
        null
      );
    }

    // Query to find appointment by ID
    database.query(
      `SELECT meet_at, reason, vet_name, comment, pet_id FROM appointments WHERE pet_id = ?`,
      petId,
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while reading the appointment:",
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

        result(null, data);
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

Appointment.updateById = async (appointmentId, updatedAppointment, result) => {
  try {
    // Check if appointmentId is provided
    if (!appointmentId) {
      return result(
        {
          kind: "appointment_id_required",
          message: "Appointment ID is required",
        },
        null
      );
    }

    // Handle required fields
    const requiredFields = ["meet_at", "reason", "pet_id"];
    for (const field of requiredFields) {
      if (updatedAppointment[field] === undefined) {
        return result({ kind: "content_not_found", content: field }, null);
      }
    }

    // Escape user inputs to prevent XSS
    const escapedAppointment = {
      meet_at: updatedAppointment.meet_at
        ? xss(updatedAppointment.meet_at)
        : null,
      reason: updatedAppointment.reason ? xss(updatedAppointment.reason) : null,
      vet_name: updatedAppointment.vet_name
        ? xss(updatedAppointment.vet_name)
        : null,
      comment: updatedAppointment.comment
        ? xss(updatedAppointment.comment)
        : null,
      pet_id: updatedAppointment.pet_id ? xss(updatedAppointment.pet_id) : null,
    };

    // Remove undefined properties from escapedAppointment
    Object.keys(escapedAppointment).forEach((key) => {
      if (escapedAppointment[key] === null) {
        delete escapedAppointment[key];
      }
    });

    // Update appointment in the database
    database.query(
      `UPDATE appointments SET ? WHERE id = ?`,
      [escapedAppointment, appointmentId],
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while updating the appointment:",
            err.message
          );
          return result(
            {
              kind: "database_error",
              message: "An error occurred while updating the appointment",
            },
            null
          );
        }

        if (data.affectedRows === 0) {
          return result(
            {
              kind: "not_found",
              message: `Appointment with ID ${appointmentId} not found`,
            },
            null
          );
        }

        result(null, { id: appointmentId, ...escapedAppointment });
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

Appointment.deleteById = async (appointmentId, result) => {
  try {
    // Check if appointmentId is provided
    if (!appointmentId) {
      return result(
        {
          kind: "appointment_id_required",
          message: "Appointment ID is required",
        },
        null
      );
    }

    // Delete appointment from the database
    database.query(
      `DELETE FROM appointments WHERE id = ?`,
      appointmentId,
      (err, data) => {
        if (err) {
          console.error(
            "An error occurred while deleting the appointment:",
            err.message
          );
          return result(
            {
              kind: "database_error",
              message: "An error occurred while deleting the appointment",
            },
            null
          );
        }

        // Check if any appointment was deleted
        if (data.affectedRows === 0) {
          return result(
            {
              kind: "not_found",
              message: `Appointment with ID ${appointmentId} not found`,
            },
            null
          );
        }

        result(null, {
          message: `Appointment with ID ${appointmentId} was deleted successfully`,
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

module.exports = Appointment;
