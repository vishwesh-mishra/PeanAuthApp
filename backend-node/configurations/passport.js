const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../queries/userQueries')
const config = require('../configurations/config');

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        // console.log(jwt_payload);
        User.getUserById(jwt_payload.id, (err, user) => {
            if(err) return done(err, false);
            if(user) return done(null, user);
            return done(null, false);
        });
    }));
}