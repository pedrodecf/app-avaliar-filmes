const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController");

const movie_notesRoutes = Router();

const movieNotesController = new MovieNotesController();

movie_notesRoutes.get("/:user_id", movieNotesController.index);
movie_notesRoutes.get("/", movieNotesController.show);
movie_notesRoutes.post("/:user_id", movieNotesController.create);
movie_notesRoutes.delete("/:id", movieNotesController.delete);

module.exports = movie_notesRoutes;