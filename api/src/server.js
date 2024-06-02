require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");

const userRoute = require("./routes/user.route.js");
const debugRoute = require("./routes/debug.route.js");
const petRoute = require("./routes/pet.route.js");

// Config server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security
app.use(helmet());

// Routes
userRoute(app);
petRoute(app);
debugRoute(app);

app.listen(3001);
