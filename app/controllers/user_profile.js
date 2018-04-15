var User = require('../models/user');
module.exports = {
  add: function (req,res) {
            var newUser = {};
            console.log(req.user.google.id);
            newUser.firstname = req.body.name;
            newUser.age = req.body.age;
            newUser.gender = req.body.gender;
            newUser.dietary = req.body.dietary;
            newUser.drinking = req.body.drinking;
            newUser.smoking = req.body.smoking;
            newUser.room = req.body.room;
            newUser.min_budget = req.body.min_budget;
            newUser.max_budget = req.body.max_budget;
            newUser.move_in_date = req.body.move_in_date;
            newUser.move_out_date = req.body.move_out_date;
            newUser.pet = req.body.pet;
            newUser.visitors = req.body.visitors;
            newUser.Summary = req.body.Summary;
            User.update({'google.id': req.user.google.id},{$set:newUser}, function (err, result) {
              if (err) return err;
                console.log('1 entry added');
                res.redirect('/dashboard');
            });
  },

}
