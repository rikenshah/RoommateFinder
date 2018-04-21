// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

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
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//adding indexes
userSchema.index({ "age": 1});//see if age need to be within a range?
userSchema.index({ "gender": 1});//living preference
userSchema.index({ "dietary": 1 });
userSchema.index({ "drinking": 1});
userSchema.index({ "smoking": 1});
userSchema.index({ "room": 1});//room sharing
userSchema.index({ "pet": 1});//pet friendly
userSchema.index({ "visitors": 1 });
userSchema.index({"Summary":"text"});


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

//module.exports = {findOne};
