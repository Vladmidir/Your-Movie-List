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
        imdb_id: {
            type: Sequelize.STRING,
        },
        rating: Sequelize.FLOAT,
        banner: Sequelize.STRING
    }, {
        //other model options go here. For exapmple we could stop auto-pluralization with `freezeTableName: true`.
        //Providing table name directly: `tableName: Movies`.
        //Disable timestamps: timestamps: false.
    })
    return Movie
}