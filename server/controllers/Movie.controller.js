//Here we define functions for interacting with the database.

const db = require("../database/index");
const Movie = db.Movie;
const Op = db.Sequelize.Op;

const axios = require('axios');
const MovieModel = require("../models/Movie.model");

//Set up for the external API 
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
      description: movie.plot.plotText.plainText, 
      rating: movie.ratingsSummary.aggregateRating,
      banner: movie.primaryImage.url,
      genre: movie.genres.genres[0].text,//only save one genere. A movie may have multiple genre, 
      //I just don't want to bother setting up another one-to-many relationship
      local: false
    }
}

/**
 * Return the movie object with the id provided from MoviesMiniDB
 * @param {string} movie_id 
 */
async function findOneMoviesMiniDB(movie_id) { //RENAME TO MOVIES RAPID
  const newOptions =  JSON.parse(JSON.stringify(options)) //ideally change this to lodash

  const url = "titles/" + movie_id
  newOptions.url += url
  //fetch the data
  try {
      const results = (await axios.request(newOptions)).data.results;
      //format the results from external API
      movieExternal = {
        imdb_id: results.id, 
          title: results.originalTitleText.text, 
          description: results.plot !== null ? results.plot.plotText.plainText : "", 
          rating: results.ratingsSummary !== null ? results.ratingsSummary.aggregateRating: 0,
          banner: results.primaryImage !== null ? results.primaryImage.url : "",
          genre: results.genres !== null ? results.genres.genres[0].text : "",//only save one genere. A movie may have multiple genre, 
          //I just don't want to bother setting up another one-to-many relationship
          local: false
      }
      return(movieExternal)
  } catch (error) {
      console.error(error);
  }
}


exports.findTop50 = async (req, res) => {
  //set up a custom url for the API
  
  const newOptions =  JSON.parse(JSON.stringify(options))

  const url = "titles/"
  newOptions.url += url
  newOptions.params.list = "most_pop_movies"
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
        movieExternal = {
          imdb_id: movie.id, 
          title: movie.originalTitleText.text, 
          description: movie.plot.plotText.plainText, 
          rating: movie.ratingsSummary.aggregateRating,
          banner: movie.primaryImage.url,
          genre: movie.genres.genres[0].text,//only save one genere. A movie may have multiple genre, 
          //I just don't want to bother setting up another one-to-many relationship
          local: false
        }
        return movieExternal
      })
      //send the response from external API
      res.json(await Promise.all(movies))
  } catch (error) {
      console.error(error);
  }
}

exports.search = async (req, res) => {
  const newOptions =  JSON.parse(JSON.stringify(options))

  //set up a custom url for the API
  const url = "titles/search/title/" + req.query.title
  newOptions.url += url
  newOptions.params.exact = false
  newOptions.params.limit = "20"

  //fetch the data
  try {
      const response = (await axios.request(newOptions)).data.results;
      //KEEPS RETURNING NULL!!!!!111
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
          //console.log(movie.plot.plotText.plainText)
          movieExternal = {
            imdb_id: movie.id, 
            title:  movie.originalTitleText !== null ? movie.originalTitleText.text : "", 
            description: (movie.plot !== null && movie.plot.plotText !== null) ? movie.plot.plotText.plainText : "", 
            rating: movie.ratingsSummary !== null ? movie.ratingsSummary.aggregateRating: 0,
            banner: movie.primaryImage !== null ? movie.primaryImage.url : "",
            genre: (movie.genres !== null && movie.genres.genres[0] !== undefined) ? movie.genres.genres[0].text : "",//only save one genere. A movie may have multiple genre, 
            //I just don't want to bother setting up another one-to-many relationship
            local: false
          }

          return movieExternal
        })
             
      //send the response from external API

      res.json(await Promise.all(movies))
  } catch (error) {
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
  newOptions.params.list = "most_pop_movies"

  //fetch the data
  try {
      const response = (await axios.request(newOptions)).data.results;

      //MAKE THIS MAP INTO A UTILITY FUNCTION
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
        movieExternal = {
          imdb_id: movie.id, 
          title: movie.originalTitleText.text, 
          description: movie.plot !== null ? movie.plot.plotText.plainText : "", 
          rating: movie.ratingsSummary !== null ? movie.ratingsSummary.aggregateRating: 0,
          banner: movie.primaryImage !== null ? movie.primaryImage.url : "",
          genre: movie.genres !== null ? movie.genres.genres[0].text : "",//only save one genere. A movie may have multiple genre, 
          //I just don't want to bother setting up another one-to-many relationship
          local: false
        }
        return movieExternal
      })
      //send the response from external API
      res.json(await Promise.all(movies))
  } catch (error) {
      console.error(error);
      res.json({})
  }
}

//#END EXTERNAL API INTERFACE#

// Create and Save a new Movie
exports.create = (req, res) => {
   // Validate request
   if (!req.body.title) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // Create a Movie. Would have to add UserId here. (Notice that the movie id is added automatically)
  const newMovie = {
    title: req.body.title,
    description: req.body.description,
    imdb_id: req.body.imdb_id,
    rating: req.body.rating,
    banner: req.body.banner,
    genre: req.body.genre,
    UserId: req.user.id
  };

  // Save Movie in the database
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

// Update a Movie by the id in the request
exports.update = async (req, res) => {
  try {
    Movie.update({ description: req.body.description }, {
      where: {
        UserId: req.user.id,
        imdb_id: req.body.imdb_id //THIS MAY CAUSE BUGS. MAKE SURE TO PASS THE ID PROPERTY
      }
    });
    res.status(200).send()

  } catch (err){
    console.error(err)
  }
  
};

// Delete a Movie with the specified id in the request
exports.delete = async (req, res) => {
  const movie_id = req.params.id
  await Movie.destroy({
    where: {
      UserId: req.user.id,
      imdb_id: movie_id
    }
  });

  //return the MoviesMiniDatabse movie as response
  res.send(await findOneMoviesMiniDB(movie_id))

};


// Delete all Movies from the database.
exports.deleteAll = (req, res) => {
  
};