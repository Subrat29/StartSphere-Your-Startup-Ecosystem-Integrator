const Chat = require("../Models/Chat/Chat");
const Message = require("../Models/Chat/Message");

 const AllChat=async (req, res) => {
    const { userId } = req.params;
    const chats = await Chat.find({ participants: userId }).populate('participants', 'username');
    res.json(chats);
  }
  const SpecificChat= async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate('messages').populate('participants', 'username');
    res.json(chat);
  }

  const fetchAllChats = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        // Fetch all chats containing the userId in the participants array
        const chats = await Chat.find({ participants: userId })
            .sort({ updatedAt: -1 })
            .populate({ path: 'participants', select: 'Name Bio Image' })
            .populate({
                path: 'messages',
                populate: {
                    path: 'sender',
                    select: 'Name Image',
                },
            });

        // Send the fetched chats as a response
        res.status(200).json(chats);
    } catch (error) {
        // Pass the error to the next middleware for handling
        next(error);
    }
};


const accessChat = async (req, res) => {
    const user1 = req.body.userId;
    const user2 = req.query.userId;

    console.log(user1);
    console.log(user2);
    if (!user1 || !user2) {
        return res.status(400).json({ msg: "User IDs cannot be null" });
    }

    try {
        let chat = await Chat.findOne({
            participants: { $all: [user1, user2] }
        })

        if (chat) {
            const fullChat = await Chat.findOne({ _id: chat._id })
            .populate('participants', 'Name Image')  // Populate participants with their name and image
            .populate({
              path: 'messages',
              populate: {
                path: 'sender',
                select: 'Name Image'  // Select only the sender's name and image
              }
            });
            return res.status(200).json(fullChat);
        } else {
            const chatData = {
                participants: [user1, user2],
                messages: []
            };
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("participants");
            return res.status(200).json(fullChat);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
const SendMessage= async (req, res) => {
    const { chatId, senderId, content } = req.body;
  
    if (!chatId || !senderId || !content) {
      return res.status(400).json({ message: "chatId, senderId, and content are required." });
    }
  
    try {
      // Create a new message
      const newMessage = await Message.create({
        chat: chatId,
        sender: senderId,
        content: content,
      });
  
      // Add the message to the chat
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { messages: newMessage._id } },
        { new: true }
      ).populate('participants').populate('messages');
  
      res.status(200).json(updatedChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  module.exports = {
    AllChat,
    SpecificChat,
    fetchAllChats,
    accessChat,
    SendMessage
  };