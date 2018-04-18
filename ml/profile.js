var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://seprojuser:seprojuser123@ds117729.mlab.com:17729/roommatefinder', function() { /* dummy function */ })
  .then(() => {
    console.log('Connection to DB Successful');
  })
  .catch(err => { // mongoose connection error will be handled here
    console.error('App starting error:', err.stack);
    process.exit(1);
});


var Schema = mongoose.Schema;

var user_schema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String
    },
    name : String,
    age : Number,
    gender: Number,
    dietary: Number,
    drinking: Number,
    smoking: Number,
    room: Number,
    min_budget: Number,
    max_budget: Number,
    move_in_date: Date,
    move_out_date: Date,
    pet: Number,
    visitors: Number,
    openness: Number,
    conscientiousness: Number,
    neuroticism: Number,
    agreeableness: Number,
    extraversion: Number,
    Summary: String,
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }
},
{
   collection: 'users'
}
);

var profile_schema = new Schema(
	{
	  user_id: 'number',
	  age: 'number',
	  gender:'number',
	  veg:'number',
	  alcohol:'number',
	  smoke:'number',
	  roomshare:'number',
	  price:'number',
	  earlier_movein_date:'string',
	  latest_movein_date:'string',
	  duration:'number',
	  pet_friendly:'number',
	  visitors:'number',
	  profession:'string',
	  openness:'number',
	  aggreeableness:'number',
	  life_satisfaction:'number'
	}, 
	{
  	collection: 'profile'
	}
);

var cluster_schema = new Schema(
	{
    cluster_number: 'number',
    centroid: ['number'],
    user_list: ['string']
	}, 
	{
  	collection: 'cluster'
	}
);

var profile = mongoose.model('profile', profile_schema);
var cluster = mongoose.model('cluster', cluster_schema);
var users = mongoose.model('users', user_schema);

module.exports = {
  // return the list of all subjects
  fetch_profile: function(callback) {
    profile.find({}, '', function(err, res) {
      if (err) return err;
      callback(res);
    });
  },

  fetch_cluster: function(callback) {
  	
    cluster.find({}, '', function(err, res) {
    	// console.log(res);
      if (err) return err;
      callback(res);
    });
  },

  fetch_users: function(callback) {
    users.find({}, '', function(err, res) {
      if (err) return err;
      callback(res);
    });
  },
}






// function fetch_profile(vectors, callback)
// {
// 	console.log("In here");
//     profile.find({}, '', function(err, res) 
//     {
//       if (err) return err;
//       callback(res);
//       console.log(res);
//     });
// }

