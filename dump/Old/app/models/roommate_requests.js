const mongoose=require('mongoose');
const Schema=mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

// Create Roommate Request Schema
const roommate_request= new Schema({
  senderId:{
    type:Schema.Types.ObjectId, ref: 'users',
    required: true
  },
  receiverid:{
    type:Schema.Types.ObjectId, ref: 'users',
    required: true
  }
});

roommate_request.index({ senderId: 1, receiverid: 1}, { unique: true });
mongoose.model('roommate_requests',roommate_request); 