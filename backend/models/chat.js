const mongoose = require('mongoose');
const { stringify } = require('querystring');
const ChatSchema = mongoose.Schema({
  creator :{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  message: {type:String,required:true},
  room:{type:String,required:true},
  createdAt: { type: String, required:true },
});

module.exports = mongoose.model('Chat', ChatSchema);
