const mysql = require("mysql2");

let connection;

const connectWithRetry = () => {
  connection = mysql.createConnection({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "root",
    database: process.env.MYSQL_NAME || "vetoo",
    charset: "utf8mb4",
  });

  connection.connect((err) => {
    if (err) {
      console.error("[API] Connecting to the database failed. Retrying in 10 seconds...");
      setTimeout(connectWithRetry, 10000);
    } else {
      console.log("[API] Connected to the database");
      // Start the ping routine
      keepAlive();
    }
  });

  connection.on("error", (err) => {
    console.error("[API] Error in the database connection");
    setTimeout(connectWithRetry, 10000);
  });
};

const keepAlive = () => {
  setInterval(() => {
    connection.ping((err) => {
      if (err) {
        console.error("[API] Ping error", err);
        connectWithRetry();
      }
    });
  }, 3600000); // Ping every hour (3600000 ms)
};

connectWithRetry();

module.exports = connection;
