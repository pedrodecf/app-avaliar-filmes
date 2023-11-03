const { Router } = require("express");
const usersRoutes = require("./users.routes");
const movie_notesRoutes = require("./notes.routes");
const movie_tagsRoutes = require("./tags.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/movie", movie_notesRoutes);
routes.use("/tags", movie_tagsRoutes);

module.exports = routes;