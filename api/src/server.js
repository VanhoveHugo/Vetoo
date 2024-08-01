require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const path = require("path");``
const cors = require("cors");

const userRoute = require("./routes/user.route.js");
const debugRoute = require("./routes/debug.route.js");
const petRoute = require("./routes/pet.route.js");
const appointmentRoute = require("./routes/appointment.route.js");
const weightRoute = require("./routes/weight.route.js");
const connection = require("./utils/database.js");

// Security
app.use(helmet());
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Config server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));


// Routes
if (connection) {
  userRoute(app);
  petRoute(app);
  weightRoute(app);
  appointmentRoute(app);
  debugRoute(app);
}

app.listen(process.env.API_PORT);

module.exports = app;
