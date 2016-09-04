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
            } else {
                
                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {
                    
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

    router.post('/register', function(req, res){
        var user = new User();
        
        
    })
};