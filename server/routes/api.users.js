var jwt = require('jsonwebtoken');
var User = require('../models/User');
var config = require('../../config');

var secret = config.secret;

module.exports = function(router) {

    // route to authenticate a user 
    router.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        })
        .select('username password') // explicitly select the password since mongoose does not return it by default
        .exec(function(err, user) {
            if (err) {
                console.error(err);
                throw err;
            }

            if (!user) { // no user with that username was found
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            }
            else {

                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                }
                else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.token({
                        username: user.username,
                    }, secret, {
                        expiresIn: '24h'
                    });

                    // return the information, including token, as JSON
                    res.json({
                        success: true,
                        message: 'Authentication successful.',
                        token: token
                    });
                }
            }
        });
    });

    // route to register a new user
    router.post('/register', function(req, res) {
        var user = new User();

        if (!req.body.username || !req.body.password) {
            // res.send(new Error('Registration failed. Username and password required.'));
            return res.json({
                success: false,
                message: 'Registration failed. Username and password required.'
            });
        }

        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err) {
            if (err) return res.send(err);

            res.json({
                success: true,
                message: 'Registration successful.'
            });
        });
    });

    // route middleware to verify a token
    router.use(function(req, res, next) {
        // logging
        console.log('A user just came to our Users API!');
        
        // check post parameters, url parameters, or headers for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        // decode token 
        if (token) {
            
            // verifies token and checks exp
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    return res.status(401).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req.decoded = decoded;
                }
            });
        } else {
            
            // if there is no token
            // 403 (access forbidden)
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    });
    
    // 
    
};