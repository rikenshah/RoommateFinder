var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://seprojuser:seprojuser123@ds117729.mlab.com:17729/roommatefinder')
    .then(() => { // if all is ok we will be here
      console.log('Connected');
    })
    .catch(err => { // if error we will be here
        console.error('App starting error:', err.stack);
        process.exit(1);
    });

var Schema = mongoose.Schema;

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
var profile = mongoose.model('profile', profile_schema);

module.exports = {
  // return the list of all subjects
  fetch_profile: function(callback) {
    profile.find({}, '', function(err, res) {
      if (err) return err;
      callback(res);
    });
  }
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