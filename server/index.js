const path = require('node:path');
const express = require("express")
const PORT = process.env.PORT || 8080
const Movie = require("./database/index.js") //Movie model. THIS DOES NOT WORK

//create our app and our database
const app = express()
app.use(express.json()) //for RapidAPI
const bodyParser = require('body-parser'); //for the html forms
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./database") //can I refence a directory like that?
db.sequelize.sync() //this will create a table
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});


//uncomment for production
//app.use(express.static(path.resolve(__dirname, "../client/build")))

//set up the routes for Movies
const movies = require("./routes/Movie.router.js")
app.use('/api/movie', movies)

//uncomment for production
//Send all non-api requests to the React app.
//app.get("*", (req, res) => {
//  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
//})

app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`)
})


