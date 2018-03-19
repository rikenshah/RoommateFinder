const mongoose=require('mongoose');

// Create Location Schema
const locations= new Schema({
  location_name:{
        type:String,
        required: true
  }
})

mongoose.model('locations',locations);