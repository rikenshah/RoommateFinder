// config/auth.js
require('dotenv').config();

// expose our config directly to our application using module.exports
module.exports = {
    'googleAuth' : {
        'clientID'         : process.env.GOOGLE_CLIENT_ID,
        'clientSecret'     : process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL'      : process.env.GOOGLE_CALLBACK_URL
    }

};
