const LocalStrategy = require('passport-local').Strategy
const bcrypt = require("bcrypt")

function initialize(passport, getUserByName, getUserById){
    //middleware function. Call cb() to move on!
    const authenticateUser = async (name, password, cb) => {
        const user = await getUserByName(name) //have to await this

        if (user == null) {
            //null - no error. false - no user found. message - our 'error' message
            return cb(null, false, {message: "no user with that name"})
        }

        try {
            if (await bcrypt.compare(password, user.password)){
                return cb(null, {id: user.id, name: user.name})
            }else {
                return cb(null, false, {message: "password incorrect"})
            }
        } catch (e) {
            return cb(e)
        }
    }

    //Use "name" as the default username field
    passport.use(new LocalStrategy({usernameField: "name"}, authenticateUser))
    passport.serializeUser((user, cb) => {
        process.nextTick( () => {
            return cb(null, {id: user.id, name: user.name})
        })
    }) //save the user id to the session. IMPORTANT
    passport.deserializeUser(async (user, cb) => cb(null, (await getUserById(user.id)))//REMEBER TO AWAIT
)}

module.exports = initialize