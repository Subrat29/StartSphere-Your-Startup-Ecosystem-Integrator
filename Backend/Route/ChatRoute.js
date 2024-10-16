// routes/chat.js
const express = require('express');
const router = express.Router();
const Profile = require('../Models/Profile');
const Message = require('../Models/Chat/Message');
const Chat = require('../Models/Chat/Chat');
const { AllChat, SpecificChat, fetchAllChats,accessChat,SendMessage } = require('../Controller/ChatController');

router.get('/chats/:userId',AllChat);
router.get('/:chatId',SpecificChat);
router.get('/myallchats/:userId',fetchAllChats);
router.post('/accesschat',accessChat);
router.post('/send-message',SendMessage);
module.exports = router;
