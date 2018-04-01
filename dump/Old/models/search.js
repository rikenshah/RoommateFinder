const mongoose=require('mongoose');
require('mongoose-type-email');
const Schema=mongoose.Schema;

// Create Search Schema
const SearchSchema= new Schema({
  dietary_habit:{
        type:String,
        required: false
  },
  smoking_habit:{
    type:String,
    required: false
  },
  alcoholic_habit:{
    type: mongoose.SchemaTypes.Email,
     required: false
  },
  gender:{
    type:String,
    required:false
  },
  min_budget:{
    type:Number,
    required:false
  },
  max_budget:{
    type: Number,
    required: false
  },
  room_sharing:{
    type: Boolean,
    required: false
  },
  earliest_move_in_date:{
    type: Date,
    required: false
  },
  latest_move_in_date:{
    type: Date,
    required: false
  }
});
mongoose.model('users',SearchSchema);