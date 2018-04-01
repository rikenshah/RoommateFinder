const mongoose=require('mongoose');
require('mongoose-type-email');
const Schema=mongoose.Schema;
const constants = require('../../constants');
var uniqueValidator = require('mongoose-unique-validator');

// Create Schema
const users= new Schema({
  email:{
   // type: mongoose.SchemaTypes.Email,
    type: String,
    required: true,
    unique: true
  },
  password:{
    type: String,
    required: true
  },
 first_name:{
    type:String,
    required: false
  },
  last_name:{
    type:String,
    required: false
  },
  gender:{
    type:String,
    required:false
  },
  phone_no:{
    type:String,
    required:false
  },
  location:{
    type: [String],
    required: false
  },
  /*location:[{
    type: Schema.Types.ObjectId, ref: 'locations',
    required: true
  }],*/
  min_budget:{
    type:Number,
    required: false
  },
  max_budget:{
    type: Number,
    required: false
  },
  room_sharing:{
    type: String,
    required: false
  },
  earliest_move_in_date:{
    type: String,
    required: false
  },
  latest_move_in_date:{
    type: String,
    required: false
  },
  dietary_habit:{
    type: String,
    required: false
  },
  smoking_habit:{
    type: String,
    required: false
  },
  alcoholic_habit:{
    type:String,
    required: false
  },
  status:{
    type: String,
    required: false,
    default: constants.AVAILABLE
  },
  last_search:{
    type: String,
    required: false
  }
});
mongoose.model('users',users);