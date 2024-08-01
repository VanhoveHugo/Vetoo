const Appointment = require("../models/appointment.model.js");

/**
 * Handle Appointments
 */
exports.create = (req, res) => {
  Appointment.create(req.body, (err, appointment) => {
    if (err) return res.status(500).json({ message: err });
    return res.json(appointment);
  });
};

exports.get = (req, res) => {
  Appointment.findByPetId(req.params.petId, (err, appointment) => {
    if (err) return res.status(500).json({ message: err });
    return res.json(appointment);
  });
};
