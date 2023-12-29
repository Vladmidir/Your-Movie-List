const {Sequelize, Op, Model, DataTypes} = require('sequelize')

//create an sqlite database (for development)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './server/database/database.sqlite',
    logging: false
});

//For AWS deployement
// const sequelize = new Sequelize({
//     dialect: "mariadb",
//     host: "yourmovielistdb.clkigk46msmr.us-east-2.rds.amazonaws.com",
//     port: 3036,
//     username: "admin",
//     password: process.env.DATABASE_KEY
// })


//create a db object we will export
const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//remember to pass the `sequelize` objects to the models
db.Movie = require("../models/Movie.model")(sequelize, Sequelize)
db.User = require("../models/User.model")(sequelize, Sequelize)

//declare a one to many relationship
db.User.hasMany(db.Movie)
db.Movie.belongsTo(db.User)

//what is the difference between module.exports and export default?
module.exports = db