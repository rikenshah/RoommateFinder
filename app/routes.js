require('dotenv').config();
const knn_rec = require('./../ml/helper');

const SendBird = require('sendbird-nodejs');
const sb = SendBird(process.env.SendBird_Api_Token);
const user_profile = require('./controllers/user_profile');
const getSearchResults=require('./models/search.js');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        var user = null;
        if(req.user){
            user = req.user
        }
        res.render('index.ejs',{
            user : user
        });
    });

    // DASHBOARD SECTION with chatbox =========================
    app.get('/dashboard', isLoggedIn, function(req, res) {
      const payload = {
        "user_id": req.user.google.id,
        "nickname": req.user.google.name,
        "profile_url": ""
      };
      // Create a new user entry in the sendbird database
      sb.users.create(payload).then(function (response, err) {
          if (err) {
            throw err;
          }
          console.log('User Added Successfully');
      });
        res.render('dashboard.ejs', {
          app_Id : process.env.SendBird_App_Id,
          user: req.user
        });
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      console.log(req.user.Summary);
      // Check whether a profile already exists or not
      var profile_exists  = false;
      if (req.user.gender == null) {
        res.render('profile.ejs', {
            user : req.user,
            profile: profile_exists
        });
      }
      else {
        profile_exists = true;
        res.render('profile.ejs', {
            user : req.user,
            profile: profile_exists
        });
      }
    });

    //Search section ==============================
    app.get('/search', isLoggedIn, function(req, res) {
        res.render('search.ejs', {
            user : req.user
        });
    });

    app.post('/searchResult', isLoggedIn, function(req, res) {

        var userSearchCriteria={"roomSharing":req.body.roomSharing,
            "pet":req.body.pet,
            "smoke":req.body.smoke,
            "visitors":req.body.visitors,
            "drink":req.body.drink,
            "veg":req.body.veg,
            "livingPreference":req.body.livingPreference//gender preference

        };
        console.log('user search criteria is'+userSearchCriteria);
        getSearchResults.getSearchResults(userSearchCriteria,function(searchResults){
            console.log('searchresults are'+searchResults);
            res.render('searchResult.ejs', {user : req.user, searchResults:searchResults });
        });


        //res.render('searchResult.ejs', {user : req.user, searchResults:searchResults });
    });

    // Handle profile
    app.post('/handle_profile',isLoggedIn, user_profile.add);


    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

        // handle the callback after twitter has authenticated the user
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/auth/google', passport.authenticate('google', {
             // Only show accounts that match the hosted domain.
            // hd: 'ncsu.edu',
            scope : ['profile', 'email']
        }));

        // the callback after google has authenticated the user
        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect : '/dashboard',
                failureRedirect : '/'
            }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // // facebook -------------------------------

    //     // send to facebook to do the authentication
    //     app.get('/connect/facebook', passport.authorize('facebook', { scope : ['public_profile', 'email'] }));

    //     // handle the callback after facebook has authorized the user
    //     app.get('/connect/facebook/callback',
    //         passport.authorize('facebook', {
    //             successRedirect : '/profile',
    //             failureRedirect : '/'
    //         }));

    // // twitter --------------------------------

    //     // send to twitter to do the authentication
    //     app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    //     // handle the callback after twitter has authorized the user
    //     app.get('/connect/twitter/callback',
    //         passport.authorize('twitter', {
    //             successRedirect : '/profile',
    //             failureRedirect : '/'
    //         }));


    // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // // facebook -------------------------------
    // app.get('/unlink/facebook', isLoggedIn, function(req, res) {
    //     var user            = req.user;
    //     user.facebook.token = undefined;
    //     user.save(function(err) {
    //         res.redirect('/profile');
    //     });
    // });

    // // twitter --------------------------------
    // app.get('/unlink/twitter', isLoggedIn, function(req, res) {
    //     var user           = req.user;
    //     user.twitter.token = undefined;
    //     user.save(function(err) {
    //         res.redirect('/profile');
    //     });
    // });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    app.get('/recommend', isLoggedIn, function(req, res) {
        var user          = req.user;
        
        var result = knn_rec.recommend_user(user, function(res){
            console.log(res);
        });
            // res.redirect('/profile');
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
