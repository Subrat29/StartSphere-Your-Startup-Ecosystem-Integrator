// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
