//Here we define functions for interacting with the database.

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

//#UTILS#
/**
 * Return the movie object with the id provided from MoviesMiniDB
 * @param {string} movie_id 
 */
async function findOneMoviesMiniDB(movie_id) {
  const url = "id/" + movie_id
  options.url += url

  //fetch the data
  try {
      const response = (await axios.request(options)).data.results;
      //format the response from external API
      movieExternal = {
        imdb_id: response.imdb_id, 
        title: response.title, 
        description: response.description, 
        rating: response.rating,
        thumbnail: response.image_url,
        banner: response.banner,
        local: false
      }
      options.url = BASE_URL // change the link before returning!
      return(movieExternal)
  } catch (error) {
      options.url = BASE_URL
      console.error(error);
  }
  //reset the url back to default
  options.url = BASE_URL
}
//#END UTILS#

exports.findTop50 = async (req, res) => {
  //set up a custom url for the API
  const url = "order/byPopularity/"
  options.url += url

  //fetch the data
  try {
    //get the top 50 titles and IDs
      const response = await axios.request(options);
      //setup the url for fetching the rest of the data about each of the top 50
      options.url = BASE_URL 
      //fetch the rest of the data about the rest of the top 50
      //I would have to also search the database :(

      console.log(response.data.results)

      //send the response from external API
      res.send(response.data.results)
  } catch (error) {
      options.url = BASE_URL
      console.error(error);
  }
  //reset the url back to default
  options.url = BASE_URL
}

exports.search = async (req, res) => {
  //set up a custom url for the API
  const url = "imdb_id/byTitle/" + req.query.title
  options.url += url

  //fetch the data
  try {
      const response = await axios.request(options);
      //send the response from external API
      res.send(response.data.results)
  } catch (error) {
      options.url = BASE_URL
      console.error(error);
  }
  //reset the url back to default
  options.url = BASE_URL
}

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
    thumbnail: req.body.thumbnail,
    banner: req.body.banner,
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