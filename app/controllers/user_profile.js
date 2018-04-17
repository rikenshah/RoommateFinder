const request = require('request');
var User = require('../models/user');

module.exports = {
  add: function (req,res) {
      var text = req.body.Summary;
      var url = "https://personalityapi.herokuapp.com/predict?text="+text;
      request(url,function (err, response, body) {
        if (err) return err;
        result = JSON.parse(body);
        console.log("Body Predictions is",result.predictions);
        var openness = findTrait("BIG5_Openness",result.predictions);
        var conscientiousness = findTrait("BIG5_Conscientiousness",result.predictions);
        var neuroticism = findTrait("BIG5_Neuroticism",result.predictions);
        var agreeableness = findTrait("BIG5_Agreeableness",result.predictions);
        var extraversion = findTrait("BIG5_Extraversion",result.predictions);
        var newUser = {};
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
        newUser.openness = openness;
        newUser.conscientiousness= conscientiousness;
        newUser.neuroticism = neuroticism;
        newUser.agreeableness = agreeableness;
        newUser.extraversion = extraversion;
        console.log(newUser);
        User.update({'google.id': req.user.google.id},{$set:newUser}, function (err, result) {
          if (err) return err;
            console.log('1 entry added');
            res.redirect('/dashboard');
        });
      });

      function findTrait(trait, response) {
        for (var i in response) {
          if (response[i].trait == trait) {
            return response[i].value;
          }
        }
        return 0;
      }
  },

}
