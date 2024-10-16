const express = require("express");
const dotenv = require("dotenv");
const UserRoute = require("./Route/UserRoute");
const ProfileRoute = require("./Route/ProfileRoute");
const PostRoute = require("./Route/PostRoute");
const ArticleRoute = require("./Route/ArticleRoute");
const StartUpRoute = require("./Route/StartupRoute");
const EventRoute = require("./Route/EventRoute");
const chatRoute = require("./Route/ChatRoute");
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require("./Config/db");
const cors = require("cors");
const Chat = require("./Models/Chat/Chat");
const Message = require("./Models/Chat/Message");
const { default: mongoose } = require("mongoose");

dotenv.config();
const PORT = process.env.PORT || 7000;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/user", UserRoute);
app.use("/api/profile", ProfileRoute);
app.use("/api/post", PostRoute);
app.use("/api/startup", StartUpRoute);
app.use("/api/article", ArticleRoute);
app.use("/api/event", EventRoute);
app.use("/api/chat", chatRoute);
io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('joinChat', ({ chatId }) => {
    console.log(chatId)
    socket.join(chatId);
  });
  socket.on('sendMessage', async ({ chatId, senderId, content }) => {

    // Validate chatId and senderId are not empty and are valid ObjectIds
    if (!chatId || !senderId || !content || !mongoose.Types.ObjectId.isValid(chatId) || !mongoose.Types.ObjectId.isValid(senderId)) {
      console.error('Invalid data received:', { chatId, senderId, content });
      return;
    }
    try {
      // Create and save the new message
      let newMessage = new Message({ chat: chatId, sender: senderId, content });
      await newMessage.save();
      // Find the chat and push the new message
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.error('Chat not found:', chatId);
        return;
      }
      chat.messages.push(newMessage);
      await chat.save();
      // Populate the sender's name and image
      newMessage = await newMessage.populate('sender', 'Name Image')
      console.log(newMessage)
      // Emit the new message to all clients in the chat room
      io.to(chatId).emit('message', newMessage);
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
