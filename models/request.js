const mongoose=require('mongoose');

const Schema=mongoose.Schema;

// Create Schema
const UserRequest= new Schema({
  senderID:{
    type:String,
    required: true
  },
  receiverID:{
    type:String,
    required: true
  }
});
mongoose.model('request',UserRequest); 