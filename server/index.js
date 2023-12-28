const path = require('node:path');
const express = require("express")
const bcrypt = require("bcrypt")
const passport = require("passport")
const session = require("express-session")
const PORT = process.env.PORT || 8080


//create our app and our database
const app = express()
app.use(express.json()) //for RapidAPI 
const bodyParser = require('body-parser'); //for the html forms
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./database/index") 
db.sequelize.sync({force: false})
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});

const User = db.User //User model

//Set up user authentication and sessions
const initializePassport = require('./passport-config')
initializePassport(
    passport, 
    async Uname =>  await User.findOne({where: {
      name: Uname
    }}),
    async id => await User.findByPk(id))

app.use(session({ 
    secret: process.env.SESSION_KEY, //CONFIGURE THIS PROPERLY with .env!
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session()) //this works WITH the express-session

//Resiter a user
app.post("/api/register", checkNotAuthenticated, async (req, res) => {
  //check that the username is not taken
  const user = await User.findOne({where: {name: req.body.name}})
  if (user != null ){
      //user already exists
      return res.status(409).send({message: "username already exists"})
  }

  HashedPass = await bcrypt.hash(req.body.password, 10)
  newUser = {
      name: req.body.name,
      password: HashedPass
  }
  await User.create(newUser)

  return res.status(201).send()
})

//Login the user. With middleware to send error messages
app.post("/api/login", checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
}))

//Logout the user 
app.post("/api/logout", (req, res) => {
  //make sure the user is logged in
  if (!req.isAuthenticated()) { 
    return  res.status(401).redirect('/login')
  }

  req.logout(function(err) { //the logout function is now async!
      if (err) { 
          res.send(err)
       }
      res.status(200).redirect('/login')
    });
});

//for the client to check authentication status
app.get("/api/authenticated", async (req, res) => {
  if(req.isAuthenticated()) {
    return res.status(200).send({id: req.user.id, name: req.user.name})
  }
  return res.status(401).send(false)
})

//set up the routes for Movies. Make sure the request is authenticated.
const movies = require("./routes/Movie.router.js")
app.use('/api/movie', checkAuthenticated, movies)

//uncomment for production
app.use(express.static(path.resolve(__dirname, "../client/build")))

//Send all non-api requests to the React app.
//uncomment for production
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
})

app.listen(PORT, () => {
    console.log(`Server Listening on ${PORT}`)
    console.log(`http://localhost:${PORT}`)
})


//middleware functions
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { //function from passport (true if authenticated, false otherwise)
      return next() //everything works! We can run safely.
  }

  res.status(401).send("not logged in!") //401 - unauthorized
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
      return res.redirect('/') //redirect to homepage if logged in
  }

  next()
}