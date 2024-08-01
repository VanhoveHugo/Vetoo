const AppointmentController = require("../controllers/appointment.controller");
const requestMiddleware = require("../middlewares/request.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (server) => {
  /**
   * Handle Appointments
   */
  server.route("/appointments").post(AppointmentController.create);

  server
    .route("/appointments/:petId")
    .get(AppointmentController.get);
};
