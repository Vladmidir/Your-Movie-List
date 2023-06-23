const Movies = require("../controllers/Movie.controller")
const router = require("express").Router()

//Return top 50 Movies from MoviesMiniDatabase. Has to be on top, so it does not trigger an id route.
router.get("/top50", Movies.findTop50)

//search for a movie locally, if not found return data from RapidAPI
router.get("/search", Movies.search)

//get random movies of the genre specified
router.get("/similar", Movies.similar)

//Get all movies in the LOCAL database
router.get("/", Movies.findAll)

//Add a movie to the local db
router.post("/", Movies.create)

//Get a movie from the local DB, if nothing in the local db, get from MoviesDatabase 
router.get("/:id", Movies.findOne)

// Update a Movie with id in the local db
router.put("/:id", Movies.update);

// Delete a Movie with id in the local db
router.delete("/:id", Movies.delete);

//Delete all movies from the list. Not implemented.
router.delete("/", Movies.deleteAll)

module.exports = router

