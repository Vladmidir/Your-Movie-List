//Here we define functions for interacting with the database.
//Interact with RapidAPI in the server/index.js. Here we will only interact with the local database.

const db = require("../database/index");
const Movie = db.Movie;
const Op = db.Sequelize.Op;

const axios = require('axios');

//Set up for the external API 
const BASE_URL = 'https://moviesminidatabase.p.rapidapi.com/movie/'
const options = {
  method: 'GET',
  url: BASE_URL,
  headers: {
    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'moviesminidatabase.p.rapidapi.com'
  }
};

exports.findTop50 = async (req, res) => {
  //set up a custom url for the API
  const url = "order/byPopularity/"
  options.url += url

  //fetch the data
  try {
      const response = await axios.request(options);
      //send the response from external API
      res.send(response.data)
  } catch (error) {
      console.error(error);
  }
  //reset the url back to default
  options.url = BASE_URL
}

//##FOR THE GET REQUEST, I WILL HAVE TO ACESS RAPIDAPI IF NOTHING FOUND LOCALLY##
// Will have to either pass, or import axios here. Probably a better idea to import here,
// since this is the only place where we will access it (List.controller and User.controller should never acess the RapidAPI)

// Create and Save a new Movie
exports.create = (req, res) => {
   // Validate request
   if (!req.body.title) {
    console.log(req.body)
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Movie
  const newMovie = {
    title: req.body.title,
    description: req.body.description,
    imdb_id: req.body.imdb_id
  };

  // Save Movie in the database
  Movie.create(newMovie)
    .then(data => {
      //redirect back to the Movie's page
      res.redirect("../movie/" + newMovie.imdb_id);
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
  res.send(await Movie.findAll())
};

// Find a single Movie with an id as a parameter
exports.findOne = async (req, res) => {
  movie_id = req.params.id
  //have to check if it is in the database, if not request the RapidAPI
  movieLocal = await Movie.findByPk(movie_id)
  //if found a movie in local db, return that
  if(movieLocal != null){
    //Set local to true
    movieLocalJson = movieLocal.toJSON()
    movieLocalJson.local = true
    return res.json(movieLocalJson)
  }

  //else, get the movie from the MoviesMiniDatabase
  const url = "id/" + movie_id
  options.url += url

  console.log(options.url)

  //fetch the data
  try {
      const response = (await axios.request(options)).data.results;
      //format the response from external API
      movieExternal = {imdb_id: response.imdb_id, title: response.title, description: response.description, local: false}

      res.send(movieExternal)
  } catch (error) {
      console.error(error);
  }
  //reset the url back to default
  options.url = BASE_URL

  //respond with the Movie's data (title, description, id) is json format
  //status code 200
};

// Update a Movie by the id in the request
exports.update = async (req, res) => {
  try {
    Movie.update({ description: req.body.description }, {
      where: {
        imdb_id: req.body.imdb_id
      }
    });
    res.status(200).send()

  } catch (err){
    console.log(err)
  }
  
};

// Delete a Movie with the specified id in the request
exports.delete = async (req, res) => {
  await Movie.destroy({
    where: {
      imdb_id: req.params.id
    }
  });
};

// Delete all Movies from the database.
exports.deleteAll = (req, res) => {
  
};