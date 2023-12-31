//Here we define functions for interacting with the local database and the external API.

const db = require("../database/index");
const Movie = db.Movie;

const axios = require('axios');

//Set up the request template for the external API 
const BASE_URL = 'https://moviesdatabase.p.rapidapi.com/'
const options = {
  method: 'GET',
  url: BASE_URL,
  params: {
    info: "base_info", //always get the base info by default
    titleType: "movie"
  },
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
  }
};

//#EXTERNAL API INTERFACE#

function RapidAPItoMyAPI(movie) {
    //check for null, because the MovieDatabase API has them
    return  {
      imdb_id: movie.id, 
      title: movie.originalTitleText.text, 
      description: (movie.plot !== null && movie.plot.plotText !== null) ? movie.plot.plotText.plainText : "", 
      rating: movie.ratingsSummary !== null ? movie.ratingsSummary.aggregateRating: 0,
      banner: movie.primaryImage !== null ? movie.primaryImage.url : "",
      genre: (movie.genres !== null && 
        typeof movie.genres.genres[0] !== 'undefined') ? movie.genres.genres[0].text : "",
        //only save one genere. A movie may have multiple genres, 
        //I just don't want to bother setting up another one-to-many relationship.
      local: false
    }
}

/**
 * Return the movie object with the id provided from MoviesMiniDB
 * @param {string} movie_id 
 */
async function findOneMoviesMiniDB(movie_id) {
  const newOptions =  JSON.parse(JSON.stringify(options)) //ideally change this to lodash

  const url = "titles/" + movie_id
  newOptions.url += url
  //fetch the data
  try {
      const results = (await axios.request(newOptions)).data.results;
      //format the results from external API
      movieExternal = RapidAPItoMyAPI(results)
      return(movieExternal)
  } catch (error) {
      console.error(error);
  }
}

exports.findTop50 = async (req, res) => {
  //set up a custom url for the API
  const newOptions = JSON.parse(JSON.stringify(options))

  const url = "titles/"
  newOptions.url += url
  newOptions.params.list = "top_rated_english_250"
  newOptions.params.limit = "50"
  //fetch the data
  try {
      //get the top 50 most popular movies
      const response = (await axios.request(newOptions)).data.results;
      //format the data for every movie, checking the database for every movie
      const movies = response.map(async (movie) => {
        //try to find the movie locally
        movieLocal = await Movie.findOne({
          where: {
            imdb_id: movie.id,
            UserId: req.user.id
          }
        })
        //if found a movie in local db, return that
        if(movieLocal != null){
          movieLocalJson = movieLocal.toJSON()
          movieLocalJson.local = true
          return movieLocalJson
        }
        //if not in the local, format and return the response data
        //Send the data from MoviesDatabase
        movieExternal = RapidAPItoMyAPI(movie)
        return movieExternal
      })
      //send the response from external API
      res.json(await Promise.all(movies))
  } catch (error) {
      console.error(error);
  }
}

exports.search = async (req, res) => {
  //set up a custom url for the API
  const newOptions = JSON.parse(JSON.stringify(options))

  const url = "titles/search/title/" + req.query.title
  newOptions.url += url
  newOptions.params.exact = false
  newOptions.params.limit = "20"

  //fetch the data
  try {
      const response = (await axios.request(newOptions)).data.results;
      const movies = response.map(async (movie) => {
        
        //try to find the movie locally
        movieLocal = await Movie.findOne({
          where: {
            imdb_id: movie.id,
            UserId: req.user.id
          }
        })
        //if found a movie in local db, add that
        if(movieLocal != null){
          movieLocalJson = movieLocal.toJSON()
          movieLocalJson.local = true
          return movieLocalJson
        }
        //if not in the local, add the data from MoviesDatabase
        movieExternal = RapidAPItoMyAPI(movie)
        return movieExternal
      })
      //send the movie found
      res.json(await Promise.all(movies))
  } catch (error) {
    //maybe I should send http error codes here...
    console.error(error);
  }
}

exports.similar = async (req, res) => {
  //set up a custom url for the API
  const newOptions = JSON.parse(JSON.stringify(options))

  const url = 'titles/random'
  newOptions.url += url

  newOptions.params.genre = req.query.genre
  newOptions.params.titleType = "movie"
  newOptions.params.limit = "3"
  newOptions.params.list = "top_rated_english_250"

  //fetch the data
  try {
      const response = (await axios.request(newOptions)).data.results;

      const movies = response.map(async (movie) => {
        //try to find the movie locally
        movieLocal = await Movie.findOne({
          where: {
            imdb_id: movie.id,
            UserId: req.user.id
          }
        })

        //if found a movie in local db, add that
        if(movieLocal != null){
          movieLocalJson = movieLocal.toJSON()
          movieLocalJson.local = true
          return movieLocalJson
        }
        //if not in the local, format and add the data from MoviesDatabase
        movieExternal = RapidAPItoMyAPI(movie)
        return movieExternal
      })
      //send the movies found
      res.json(await Promise.all(movies))
  } catch (error) {
      console.error(error);
      res.json({}) //to prevent crashes
  }
}

//#END OF THE EXTERNAL API INTERFACE#

// Create and Save a new Movie
exports.create = (req, res) => {
   // Validate request
   if (!req.body.title) {
    res.status(400).send({
      message: "Title can not be empty!"
    });
    return;
  }
  // Create a Movie. Add the UserId here.
  const newMovie = {
    title: req.body.title,
    description: req.body.description,
    imdb_id: req.body.imdb_id,
    rating: req.body.rating,
    banner: req.body.banner,
    genre: req.body.genre,
    UserId: req.user.id
  };

  // Save the Movie in the database
  Movie.create(newMovie)
    .then(data => {
      //redirect back to the Movie's page
      res.status(200).redirect("../movie/" + data.imdb_id);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Movie."
      });
    });
};

// Retrieve all Movies from the database.
exports.findAll = async (req, res) => {
  res.send(await Movie.findAll({where: {UserId: req.user.id}}))
};

// Find a single Movie with an id as a parameter
exports.findOne = async (req, res) => {
  movie_id = req.params.id
  //have to check if it is in the database, if not request the RapidAPI
  movieLocal = await Movie.findOne({
    where: {
      imdb_id: movie_id,
      UserId: req.user.id
    }
  })
  //if found a movie in local db, return that
  if(movieLocal != null){
    //Set local to true
    movieLocalJson = movieLocal.toJSON()
    movieLocalJson.local = true
    return res.json(movieLocalJson)
  }
  //Send the data from MoviesMiniDatabase
  res.send(await findOneMoviesMiniDB(movie_id))
};

// Update a Movie with the id specified
exports.update = async (req, res) => {
  try {
    Movie.update({ description: req.body.description }, {
      where: {
        UserId: req.user.id,
        imdb_id: req.body.imdb_id
      }
    });
    res.status(200).send()

  } catch (err){
    console.error(err)
  }
  
};

// Delete a Movie with the specified id
exports.delete = async (req, res) => {
  const movie_id = req.params.id
  await Movie.destroy({
    where: {
      UserId: req.user.id,
      imdb_id: movie_id
    }
  });

  //return the MoviesDatabase movie as a response
  res.send(await findOneMoviesMiniDB(movie_id))

};

// Delete all Movies from the database.
exports.deleteAll = (req, res) => {
  
};