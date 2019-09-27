const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByusername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByusername(username);
        if(user === null || user === '') {
            return done(null, false, { message: 'User does not exist'});
        }
        //done(<errorType>, <user:object, false>, <message>)
        //https://www.youtube.com/watch?v=gzDB0ZGOjA0 > 12:59
        try {
            if(await bcrypt.compare(password, user.password)) {
                if(!user.isVerified)
                    return done(null, false, { message: 'Account not activated. Sign up again to re-send token.' });
                else
                    return done(null, user);
            } else {
                return done(null, false, { message: 'Username or Password incorrect' });
            }
        } catch (e) {
            return done(e);
        }
    };

    passport.use(new LocalStrategy({usernameField: 'username', passwordField: 'password'}, authenticateUser));
    passport.serializeUser((user, done) => {
        return done(null, user._id);
    });
    passport.deserializeUser(async (id, done) => {
        return done(null, await getUserById(id));
    });
}

module.exports = initialize;