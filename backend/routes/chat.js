const express = require('express');
const router = express.Router();
const ChatController=require('../controllers/chat');
const checkAuth = require("../middleware/check-auth");


/* GET ALL CHATS */
router.get('/chats',checkAuth, ChatController.getChats);

/* GET SINGLE CHAT BY ID */
router.get('/:id',checkAuth,ChatController.getChatByRoom );

/* SAVE CHAT */
router.post('/savechat',checkAuth, ChatController.saveChat);



module.exports = router;
