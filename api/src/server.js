require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");

const userRoute = require("./routes/user.route.js");
const debugRoute = require("./routes/debug.route.js");
const petRoute = require("./routes/pet.route.js");
const appointmentRoute = require("./routes/appointment.route.js");
const weightRoute = require("./routes/weight.route.js");

// Config server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

// Routes
userRoute(app);
petRoute(app);
weightRoute(app);
appointmentRoute(app);
debugRoute(app);

app.listen(process.env.API_PORT);

module.exports = app;
