// config/auth.js
require('dotenv').config();

// expose our config directly to our application using module.exports
module.exports = {

    // 'facebookAuth' : {
    //     'clientID'        : process.env.GOOGLE_CLIENT_ID, // your App ID
    //     'clientSecret'    : process.env.GOOGLE_CLIENT_SECRET, // your App Secret
    //     'callbackURL'     : 'http://localhost:8080/auth/facebook/callback',
    //     'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    //     'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API

    // },

    // 'twitterAuth' : {
    //     'consumerKey'        : process.env.GOOGLE_CLIENT_ID,
    //     'consumerSecret'     : process.env.GOOGLE_CLIENT_SECRET,
    //     'callbackURL'        : 'http://localhost:8080/auth/twitter/callback'
    // },

    // Mateen: For Remote change the  callbackURL to http://findmeroommate.herokuapp.com/auth/google/callback
    // For Local: http://localhost:8080/auth/google/callback
    'googleAuth' : {
        'clientID'         : process.env.GOOGLE_CLIENT_ID,
        'clientSecret'     : process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL'      : 'http://localhost:8080/auth/google/callback'
    }

};
