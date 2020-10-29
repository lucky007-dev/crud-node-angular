const Chat = require('../models/chat.js');

exports.getChatByRoom=(req, res, next)=> {
  Chat.find({ creator: req.params.id }).then((chats)=>{
    res.status(201).json({
      message:'Chatssss Fetched',
      chats:chats
    });
  })

}

exports.getChats=(req, res, next)=> {
  Chat.find().then((chats)=>{

    res.status(201).json({
      message:'Chat Fetched',
      chats:chats
    });
  }).catch(error=>{
    res.status(500).json({
      message:'Fetching chat failed!',
      chats:chats
    })
  });
}
exports.saveChat=(req, res, next)=> {
  const chat = new Chat({
    creator:req.userData.userId,
    message:req.body.message,
    room:req.body.room,
    createdAt:req.body.createdAt
  });
  chat.save().then((result)=>{
    res.status(201).json({
      message:'Chat added successfully.',
      chat:
      {
        ...result,
        id:result._id
      }
    });

  }).catch(error=>{
    res.status(500).json({
      message:'Creating a chat failed!'
    })
  });
}
