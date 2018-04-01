const mongoose=require('mongoose');
require('mongoose-type-email');
const Schema=mongoose.Schema;

// Create Schema
const UserSchema= new Schema({
  firstname:{
    type:String,
    required: true
  },
  lastname:{
    type:String,
    required: true
  },
  gender:{
    type:String,
    required:true
  },
  email:{
    type: mongoose.SchemaTypes.Email,
     required: true
  },
  phno:{
    type:String,
    required:true
  },
  password:{
    type: String,
    required: true
  },
  confirmpassword:{
    type: String,
    required: true
  },
  dietaryhabit:{
    type: String,
    required: true
  },
  smokinghabit:{
    type: String,
    required: true
  },
  alcoholichabit:{
    type:String,
    required: true
  },
  min_budget:{
    type:Number,
    required: true
  },
  max_budget:{
    type: Number,
    required: true
  },
  room_sharing:{
    type: String,
    required: true
  },
  earliest_move_in_date:{
    type: String,
    required: false
  },
  latest_move_in_date:{
    type: String,
    required: false
  }


});
mongoose.model('users',UserSchema);