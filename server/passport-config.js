const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt")


function initialize(passport, getUserByName, getUserById){
    //middleware function. Call done() to move on!
    const authenticateUser = async (name, password, done) => {
        const user = await getUserByName(name) //have to await this

        if (user == null) {
            //null - no error. false - no user found. message - our 'error' message
            return done(null, false, {message: "no user with that name"})
        }

        try {

            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else {
                return done(null, false, {message: "password incorrect"})
            }
        } catch (e) {
            return done(e)
        }
    }

    //tell it to use "name" as the default username field
    passport.use(new LocalStrategy({usernameField: "name"}, authenticateUser))

    passport.serializeUser((user, done) => done(null, user.id)) //save the user id to the session. IMPORTANT
    passport.deserializeUser((id, done) => done(null, getUserById(id))
)
}

module.exports = initialize