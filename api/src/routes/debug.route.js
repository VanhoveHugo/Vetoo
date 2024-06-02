module.exports = (server) => {
  server
    .route("/version")
    .get((_, res) => res.json({ version: process.version }));
};
