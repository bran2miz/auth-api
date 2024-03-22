'use strict';

const {users} = require('../models');

const bearer = async(req, res, next) => {
    // check if we have bearer auth in our req.header
    // might not want to use this for hackers (in real world)
    if (!req.headers.authorization) return next('Not authorized, no token present');

    // if the one I have is Bearer instead of Basic
    // "Bearer this.is.going.to.be.the.token"
    // split it on the " "
    // [Bearer, this.is.going.to.be.the.token]
    // const authType = req.headers.authorization.split(" ")[0]
    // const token = req.headers.authorization.split(" ")[1]
    try {
        // array deconstruction
        const [authType, token] = req.headers.authorization.split(' ');
        if (authType === 'Bearer') {
            // check to see if this is a valid token
            // if you have a token i will send the token to the user model to see if this is a valid token
            let validUser = await users.authenticateBearer(token);
            if (validUser) {
                // send info (request) to the route handler
                // attach user property to the request and provide it validUser
                req.user = validUser;
                req.token = validUser.token;
                return next();
            } else {
              res.status(403).send('Invalid Login');
            }
        } else {
          res.status(403).send('Invalid Login');
        }
    }
    catch (e) {
        console.error(e);
        next(e);
    };
};

module.exports = bearer;