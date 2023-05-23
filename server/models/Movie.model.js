//Define a Movie database model.
module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define('Movie', {
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        //use imdb_id as a unique identifier
        //rename to id and force the table
        imdb_id: {
            type: Sequelize.STRING,
            primaryKey: true
        }
    }, {
        //other model options go here. For exapmple we could stop auto-pluralization with `freezeTableName: true`.
        //Providing table name directly: `tableName: Movies`.
        //Disable timestamps: timestamps: false.
    })
    return Movie
}