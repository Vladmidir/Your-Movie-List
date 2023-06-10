const {Sequelize, Op, Model, DataTypes} = require('sequelize')

//create a sqlite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './server/database/database.sqlite',
    logging: false
});


//create a db object we will export
const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//pass the sequelize objects to the Movie Model
db.Movie = require("../models/Movie.model")(sequelize, Sequelize)
db.User = require("../models/User.model")(sequelize, Sequelize)

//declare a one to many relationship
db.User.hasMany(db.Movie)
db.Movie.belongsTo(db.User)

//what is the difference between this and export default?
module.exports = db